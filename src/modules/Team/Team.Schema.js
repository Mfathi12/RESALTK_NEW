import Joi from "joi";
import {isValidObjectId } from "../../MiddleWare/Validation.js";


export const AddTeamSchema = Joi.object({
    teamName: Joi.string().required(),
    teamFormation: Joi.string().valid("I Have My Team", "I Need to Hire Members").required(),
    description: Joi.string().optional(),
    teamLeaderRole: Joi.string().optional(),
    fieldOfResearch: Joi.string().optional(),
    jobTitle: Joi.string().optional(),
    requiredSkills: Joi.string().optional(),
    members: Joi.array().items(
        Joi.object({
            user: Joi.string().custom(isValidObjectId).required(),
            role: Joi.string().optional()
        })
    ).min(0).max(10).optional(),
    image: Joi.string().optional()
}).required();


export const GetTeamSchema=Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required()
}).required();


export const GetMemberTeamsSchema=Joi.object({
    userId:Joi.string().custom(isValidObjectId).required()
}).required();

export const UpdateTeamSchema = Joi.object({
    teamId: Joi.string().custom(isValidObjectId).required(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    members: Joi.array().items(Joi.string().custom(isValidObjectId)).optional(),
    projects: Joi.array().items(Joi.string().custom(isValidObjectId)).optional()
}).required();

export const sendJoinRequestSchema=Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required(),
    userId:Joi.string().custom(isValidObjectId).required(), 
    name:Joi.string().required(),
    university:Joi.string().required(),
    educationLevel:Joi.string().required(),
    major:Joi.string().required(),
    //cv:Joi.string().required(),
    degree:Joi.string().required(),
}).required();
export const handleJoinRequestSchema=Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required(),
    requestId:Joi.string().custom(isValidObjectId).required(),
    action:Joi.string().valid("accept","deney").required(),
}).required();

export const DeleteTeamSchema=Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required(),
}).required();

export const LeaveTeamSchema=Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required(),
    userId:Joi.string().custom(isValidObjectId).required(),
}).required();