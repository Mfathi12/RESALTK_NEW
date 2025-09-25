import { model, Schema,Types } from "mongoose";

export const WaitingProvidersSchema = new Schema({
    requestId: {
        type: Types.ObjectId,
        ref:"Services",
        required: true
    },
    providerId: {
        type:Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: Number,
    },

})

export const WaitingProviders = model('WaitingProviders', WaitingProvidersSchema);