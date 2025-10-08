import Joi from "joi";
import { validate , isValidObjectId } from "../../MiddleWare/Validation.js";

export const baseSchema ={
    ownerId: Joi.string().custom(isValidObjectId).optional(),
    teamId:Joi.string().custom(isValidObjectId).optional(),
    requestName: Joi.string().required(),
    description: Joi.string(),
    deadline: Joi.date(),
    implementationtime:Joi.date(),
    serviceType: Joi.string().valid("GrammarCheck",
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
            "Printing").required(),
        //uploadFile: Joi.array().items(Joi.string()).required()
};

export const GrammarCheckService =Joi.object({
    ...baseSchema,
    language: Joi.string().required(),
})

export const ParaphraseService =Joi.object({
    ...baseSchema,
    language: Joi.string().required(),
    tone:Joi.string().valid("Standard","Academic","Technical","Formal").required()
})

export const ReferenceService = Joi.object({
    ...baseSchema,
    citationStyle : Joi.string().valid("IEEE","APA","MLA","Chicago").required(),
})

export const TranslationService =Joi.object({
    ...baseSchema,
    sourceLanguage : Joi.string().required(),
    targetLanguage : Joi.string().required(),
})

export const ScientificIllustrationService =Joi.object({
    ...baseSchema,
})

export const PowerPointService = Joi.object({
    ...baseSchema,
    slidesNumber : Joi.number().integer().min(1).required(),
})

export const WordService=Joi.object({
    ...baseSchema,
    wordCount : Joi.number().integer().min(1).required(),
})

export const ResearchGuidanceService = Joi.object({
    ...baseSchema,
    areaOfResearch : Joi.string().required(),
})
export const AcademicWritingHelpService =Joi.object({
    ...baseSchema,
})
export const SoftwareToolsAccessService =Joi.object({
    ...baseSchema,
    softwareOrToolName : Joi.string().required()
})
export const ChemicalSuppliersService =Joi.object({
    ...baseSchema,
    itemName : Joi.string().required()
})

export const printingSchema = Joi.object({
    ...baseSchema,
    printType: Joi.string().required(),
    paperType: Joi.string().required(),
    paperSize: Joi.string().required(),
    colorMode: Joi.string().valid("Color", "B&W").required(),
    bindingType: Joi.string().required(),
    NumberOfcopies: Joi.number().required()
})

/* export const chooseServiceSchema= (req, res, next) => {
    const { serviceType } = req.body;
    let schema;
    switch (serviceType) {
        case "GrammarCheck":
            schema = GrammarCheckService;
            break;
        case "Paraphrase":
            schema = ParaphraseService;
            break;  
        case "Reference":
            schema = ReferenceService;
            break;
        case "Translation":
            schema = TranslationService;
            break;
        case "ScientificIllustration":
            schema = ScientificIllustrationService;
            break;
        case "PowerPoint":
            schema = PowerPointService;
            break;
        case "Word":
            schema = WordService;
            break;
        case "ResearchGuidance":
            schema = ResearchGuidanceService;
            break;
        case "AcademicWritingHelp":
            schema = AcademicWritingHelpService;
            break;
        case "SoftwareToolsAccess":
            schema = SoftwareToolsAccessService;
            break;
        case "ChemicalSuppliers":
            schema = ChemicalSuppliersService;
            break;
        case "Printing":
            schema = printingSchema;
            break;  
        default:
            return next (new Error("Invalid service type"));
    }
    return validate(schema)(req, res, next);
} */
export const chooseServiceSchema = (serviceType) => {
    switch (serviceType) {
        case "GrammarCheck":
            return GrammarCheckService;
        case "Paraphrase":
            return ParaphraseService;
        case "Reference":
            return ReferenceService;
        case "Translation":
            return TranslationService;
        case "ScientificIllustration":
            return ScientificIllustrationService;
        case "PowerPoint":
            return PowerPointService;
        case "Word":
            return WordService;
        case "ResearchGuidance":
            return ResearchGuidanceService;
        case "AcademicWritingHelp":
            return AcademicWritingHelpService;
        case "SoftwareToolsAccess":
            return SoftwareToolsAccessService;
        case "ChemicalSuppliers":
            return ChemicalSuppliersService;
        case "Printing":
            return printingSchema;
        default:
            throw new Error("Invalid service type");
    }
};
// Middleware للـ Validation
export const validateService = (req, res, next) => {
  const serviceType = req.params.serviceType || req.body.serviceType;
  if (!serviceType) {
    return next(new Error("Service type is required"));
  }

  let schema;
  try {
    schema = chooseServiceSchema(serviceType);
  } catch (err) {
    return next(new Error("Invalid service type"));
  }

  return validate(schema)(req, res, next);
};


export const validateStatus =Joi.object({
    status: Joi.string()
    .valid("new-request", "in-progress","provider-selection" ,"completed", "rejected").optional()})


export const AssignProviderByAdmin = Joi.object({
    requestId: Joi.string().custom(isValidObjectId).required(),
    providerIds: Joi.array().items(Joi.string().custom(isValidObjectId)).min(1).required(),
}).required();


export const GetTeamServices=Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required()
})

export const getSpecificService=Joi.object({
    serviceId:Joi.string().custom(isValidObjectId).required()
})



export const SetProviderPrice=Joi.object({
    providerId:Joi.string().custom(isValidObjectId).required(),
    requestId:Joi.string().custom(isValidObjectId).required(),
    price:Joi.string().required(),
    implementationtime: Joi.date().required()

}).required()

export const GetAllProviderRequests=Joi.object({
    providerId:Joi.string().custom(isValidObjectId).required(),
})

export const getprovidersAssigned=Joi.object({
    serviceId:Joi.string().custom(isValidObjectId).required(),
})

