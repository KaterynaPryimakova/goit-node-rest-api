import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HttpError, ctrlWrapper } from "../helpers/index.js";
import User from "../models/UserModel.js";

const { SECRET_KEY } = process.env;

const signUp = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
        user: { email: newUser.email, name: newUser.name },
    });
};

const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    res.json({
        token,
        user: { email: user.email, subscription: user.subscription },
    });
};

export default {
    signUp: ctrlWrapper(signUp),
    signIn: ctrlWrapper(signIn),
};
