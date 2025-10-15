// src/socket.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Message } from "../../../DB/models/Message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });
  console.log(" Socket.io initialized and waiting for connections...");

  // Token authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("token is required"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  // Socket events
  io.on("connection", async (socket) => {
    console.log("✅ User connected:", socket.userId);

    const messages = await Message.find({
      $or: [{ sender: socket.userId }, { receiver: socket.userId }],
    }).populate("sender receiver", "name email");

    socket.emit("messages", messages);

    socket.on("private-message", async ({ to, message }) => {
      if (!to || !message) return;

      const newMsg = await Message.create({
        sender: socket.userId,
        receiver: to,
        message,
      });

      const populatedMsg = await newMsg.populate("sender receiver", "name email");

      socket.to(to).emit("private-message", populatedMsg);
      socket.emit("private-message", populatedMsg);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.userId);
    });
  });

  return io;
};
