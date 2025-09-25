import { model, Schema, Types } from "mongoose";

const PlanSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },

    planName: { type: String, required: true },

    services: [
        {
            type: Types.ObjectId,
            ref: "Services",
            required: true
        }
    ],

    providers: [
        {
            type: Types.ObjectId,
            ref: "User"
        }
    ],

    totalPrice: { type: Number, default: 0 },

    deadline: { type: Date},

    status: {
        type: String,
        enum:  ['new-request', 'provider-selection', 'in-progress', 'completed'],
        default: "new"
    },
        candidates: [{
            type:Types.ObjectId,
            ref: "User"
        }],
        selectedProvider: {
            type: Types.ObjectId,
            ref: "User"
        }
}, { timestamps: true });

export const Plan = model("Plan", PlanSchema);