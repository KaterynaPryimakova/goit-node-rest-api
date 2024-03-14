import express from "express";
import { validateBody } from "../helpers/index.js";
import { signInSchema, signUpSchema } from "../schemas/usersSchemas.js";
import authControllers from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post(
    "/register",
    validateBody(signUpSchema),
    authControllers.signUp
);

authRouter.post("/login", validateBody(signInSchema), authControllers.signIn);

export default authRouter;
