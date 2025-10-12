import Joi from "joi";
import { isValidObjectId } from "../../MiddleWare/Validation.js";

export const addEventSchema = Joi.object({
    teamId: Joi.string().custom(isValidObjectId).required(),
    eventTitle: Joi.string().required(),
    eventDescription: Joi.string().required(),
    eventDate: Joi.date().required(),
    location: Joi.string().required(),
    totalPositionNeeded: Joi.number().required()
}).required();

export const addNewsSchema = Joi.object({
    newsTitle: Joi.string().required(),
    newsDescription: Joi.string().required(),
    image: Joi.string().optional()
}).required();

export const getEventSchema = Joi.object({
    eventId: Joi.string().custom(isValidObjectId).required()
}).required();

export const updateNewSchema = Joi.object({
    newId: Joi.string().custom(isValidObjectId).required(),
    newsTitle: Joi.string().optional(),
    newsDescription: Joi.string().optional(),
    image: Joi.string().optional()
}).required();
export const deleteNewSchema = Joi.object({
    newId: Joi.string().custom(isValidObjectId).required()
})
export const deleteEventSchema = Joi.object({
    eventId: Joi.string().custom(isValidObjectId).required()
})

export const ApplyForEvent=Joi.object({
    eventId:Joi.string().custom(isValidObjectId).required()
})
