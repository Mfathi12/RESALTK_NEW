import { Schema } from "mongoose";

export const TokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isValid: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
    });

export const Token=model.js("Token", TokenSchema);