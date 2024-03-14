import Joi from "joi";
import { emailPattern } from "../constants/userConstants.js";

export const signUpSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().pattern(emailPattern).required(),
    password: Joi.string().min(6).required(),
});

export const signInSchema = Joi.object({
    email: Joi.string().pattern(emailPattern).required(),
    password: Joi.string().min(6).required(),
});
