import { User } from "../../DB/models/User.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate user using JWT token

export const Authentication =asyncHandler(async (req, res, next) => {
    const token = req.headers['token'];
    if (!token) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user= await User.findById(payload.id);
        if (!user) {
            return next (new Error("User not found, authentication denied",{cause:404}));
        }
        req.user = user; // Attach user to request object
        next(); 
    } catch (error) {
        return next (new Error({ message: "Token is not valid" },{cause: 401 }));
    }

}) 