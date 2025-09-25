import Joi from "joi";
import { isValidObjectId } from "../../MiddleWare/Validation.js";

export const addProjectSchema = Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required(),
    projectTitle: Joi.string().required(),
    projectDescription: Joi.string().required(),
    fieldOfResearch: Joi.string().required(),
    projectType: Joi.string().valid("Thesis", "Research Paper", "Experiment", "Case Study", "Other").required(),
}).required();

export const addAchievement = Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required(),
    achievementTitle: Joi.string().required(),
    achievementDescription: Joi.string().required(),
    fieldOfResearch: Joi.string().required(),
}).required();

export const getProjects=Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required(),
}).required();

export const getAchievement=Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required(),
    AchievementId:Joi.string().custom(isValidObjectId).required(),
}).required();
export const getProject=Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required(),
    projectId:Joi.string().custom(isValidObjectId).required(),
}).required();
