import { model, Schema } from "mongoose";

const serviceMappingSchema = new Schema({
    //serviceId: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    selectedAt: { type: Date, default: Date.now }
});

export const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    accountType: {
        type: String,
        enum: ['Researcher', 'Service Provider', 'company', 'admin', 'doctor'],
    },

    services: [serviceMappingSchema],
    plan:[{
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    }],

    //common data 
    nationalId: {
         type: String,
     },
    university: {
        type: String,
    },
    degree: {
        type: String,
    },
    major: {
        type: String,
    },
    currentYear: {
        type: String,
        enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Fifth Year', 'Sixth Year'],
    },
    educationLevel: {
        type: String,
        enum: ['Undergraduate (Senior Year)', 'MasPostgraduate (Masters)ter', 'Postgraduate (PHD)', 'Postgraduate (Diploma)' ,'Other'],
    },
    //provider's Data
    cv: {
        type: String,
    },
    companyName: {
        type: String,
    },
    address: {
        type: String,
    },
    commercialRegistration: {
        type: String,
    },
    logo: {
        type: String,
    },
    service: {
        type: String,
    },

    /*  providedServices: { 
        type: [String],  
     },  */
    providedServices: [
        {
            serviceName: {
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
            description: { type: String },

            languages: [{ type: String }],

            tools: [{ type: String }],
        }
    ],

    paymentMethod: {
        type: String,
        enum: ['cash', 'payMob'],
    },

    resetPasswordOTP: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    profilePic: {
        type: String,
        default: null
    }

}, { timestamps: true });


export const User = model('User', UserSchema);