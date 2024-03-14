import bcrypt from "bcrypt";
import { HttpError, ctrlWrapper } from "../helpers/index.js";
import User from "../models/UserModel.js";

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

export default {
    signUp: ctrlWrapper(signUp),
};
