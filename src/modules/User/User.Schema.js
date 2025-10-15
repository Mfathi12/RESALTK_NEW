import Joi from "joi";
import { isValidObjectId } from "../../MiddleWare/Validation.js";

export const UserIdSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
}).required();


export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(30),
    confirmPassword: Joi.string().valid(Joi.ref("password")).when("password", {
        is: Joi.exist(),
        then: Joi.required(),
    }),
    phone: Joi.string(),
    accountType: Joi.string().valid("Researcher", "Service Provider", "admin"),


    university: Joi.string(),
    degree: Joi.string(),
    major: Joi.string(),
    currentYear: Joi.string(),
    educationLevel: Joi.string(),

    cv: Joi.string(),
    companyName: Joi.string(),
    address: Joi.string(),
    commercialRegistration: Joi.string(),
    logo: Joi.string(),
    service: Joi.string(),
}).required();

export const AddDoctor = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  degree: Joi.string().required(),
  biography: Joi.string().optional(),
  expertise: Joi.array().items(Joi.string()).min(1).required(),
  image: Joi.string().optional(),
}).required();
