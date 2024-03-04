import Joi from "joi";
import { phonePattern } from "../constants/contactConstants.js";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(phonePattern).required(),
    favorite: Joi.boolean().default(false),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(phonePattern),
    favorite: Joi.boolean().default(false),
}).min(1);
