import { HttpError } from "../helpers/index.js";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const { SECRET_KEY } = process.env;

export const authenticate = async (req, _, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
        next(HttpError(401, "Bearer not found"));
    }

    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);

        if (!user || !user.token || user.token !== token) {
            next(HttpError(401));
        }

        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401, error.message));
    }
};
