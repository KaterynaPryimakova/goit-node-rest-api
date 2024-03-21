import express from "express";
import { authenticate, validateBody, upload } from "../middlewares/index.js";
import { signInSchema, signUpSchema } from "../schemas/usersSchemas.js";
import authControllers from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post(
    "/register",
    validateBody(signUpSchema),
    authControllers.signUp
);

authRouter.post("/login", validateBody(signInSchema), authControllers.signIn);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
    "/avatars",
    authenticate,
    upload.single("avatar"),
    authControllers.updateAvatar
);

export default authRouter;
