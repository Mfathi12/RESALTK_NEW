import { Schema, model } from "mongoose";

const DoctorAvailableSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "cancelled"],
      default: "available",
    },
  },
  { timestamps: true }
);

export const DoctorAvailable = model("DoctorAvailable", DoctorAvailableSchema);
