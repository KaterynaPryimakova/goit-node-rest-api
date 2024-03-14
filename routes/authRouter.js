import express from "express";
import { validateBody } from "../helpers/index.js";
import { signUpSchema } from "../schemas/usersSchemas.js";
import authControllers from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post(
    "/register",
    validateBody(signUpSchema),
    authControllers.signUp
);

export default authRouter;
