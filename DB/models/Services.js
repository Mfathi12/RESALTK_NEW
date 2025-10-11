import { model, Schema, Types } from "mongoose";

export const ServicesSchema = new Schema({
    ownerId: {
        type: Types.ObjectId,
        ref: "User",
    },

    providerId: {
        type: Types.ObjectId,
        ref: "User",
    },

    serviceType: {
        type: String,
        required: true,
        enum: [
            "GrammarCheck",
            "Paraphrase",
            "Reference",
            "Translation",
            "ScientificIllustration",
            "PowerPoint",
            "Word",
            "ResearchGuidance",
            "AcademicWritingHelp",
            "SoftwareToolsAccess",
            "ChemicalSuppliers",
            "Printing"
        ]
    },

    //common fields
    requestName: { type: String, required: true },
    //uploadFile: { type: String ,required :true},
    description: { type: String },
    deadline: { type: Date },
    implementationtime: { type: Date },
    status: {
        type: String,
        enum: ['new-request', 'provider-selection', 'in-progress', 'completed'],
        default: "new-request"
    },
    // dynamic details for each service type
    details: {
        type: Map,
        of: Schema.Types.Mixed
    },

    candidates: [{
        type: Types.ObjectId,
        ref: "User"
    }],
    selectedProvider: {
        type: Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },

    state: {
        type: String,
        enum: ["accept", "reject", "submitted"],
        default: null // أو default: "pending" لو عايزة قيمة افتراضية
    },
    paidAmount: {
        type: Number,
        default: 0 // اللي اتدفع فعليًا
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    deliveredAt: {
        type: Date,
        default: Date.now(),
    },
},
    {
        timestamps: true,
    });

export const Services = model('Services', ServicesSchema);