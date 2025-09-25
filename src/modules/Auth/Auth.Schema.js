import Joi from "joi";
import { validate } from "../../MiddleWare/Validation.js";

const baseSchema = {
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(30).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    phone: Joi.string().optional(),
    accountType: Joi.string().valid('Researcher', 'Service Provider','company' ,'admin', 'doctor').required(),
};

// researcher schema
export const researcherSchema = Joi.object({
    ...baseSchema,
    university: Joi.string().required(),
    degree: Joi.string().required(),
    major: Joi.string().required(),
    currentYear: Joi.string().optional(),
    educationLevel: Joi.string().required(),
    nationalId: Joi.string().required(),
});


// provider schema
export const providerSchema = Joi.object({
  ...baseSchema,
  educationLevel: Joi.string().required(),
  university: Joi.string().required(),
  degree: Joi.string().required(),
  major: Joi.string().required(),
  nationalId: Joi.string(),
  

  providedServices: Joi.array()
    .items(
      Joi.object({
        serviceName: Joi.string()
          .valid(
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
          )
          .required(),

        description: Joi.string().required(),

        // شرط خاص بالـ languages
        languages: Joi.when("serviceName", {
          is: Joi.valid("GrammarCheck", "Translation"),
          then: Joi.array().items(Joi.string()).min(1).required(),
          otherwise: Joi.forbidden(),
        }),

        // شرط خاص بالـ tools
        tools: Joi.when("serviceName", {
          is: Joi.valid("SoftwareToolsAccess"),
          then: Joi.array().items(Joi.string()).min(1).required(),
          otherwise: Joi.forbidden(),
        }),
      })
    )
    .min(1)
    .required(),
});


//company schema
export const companySchema = Joi.object({
    ...baseSchema,
    companyName: Joi.string().required(),
    address: Joi.string().required(),
    commercialRegistration: Joi.string().required(),
    providedServices: Joi.array().items(Joi.string()).min(1).required(),
    //logo: Joi.string().required(),
})

// admin schema
export const adminSchema = Joi.object({
    ...baseSchema,
    nationalId: Joi.string().required(),
});

//doctor schema
export const doctorSchema = Joi.object({
    ...baseSchema,
});

export const chooseSchema = (req, res, next) => {
    if (!req.body || !req.body.accountType) {
        return res.status(400).json({ message: "accountType is required in request body" });
    }
    let schema;
    switch (req.body.accountType) {
        case "Researcher":
            schema = researcherSchema;
            break;
        case "Service Provider":
            schema = providerSchema;
            break;
        case "company":
            schema = companySchema;
            break;
        case "admin":
            schema = adminSchema;
            break;
        case "doctor":
            schema = doctorSchema;
            break;
        default:
            return res.status(400).json({ message: "Invalid account type" });
    }
    return validate(schema)(req, res, next);
};

export const LoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(30),
}).required();

export const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
}).required();

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    newPassword: Joi.string().required().min(6).max(30),
    confirmNewPassword: Joi.string().required().valid(Joi.ref('newPassword')),
}).required();