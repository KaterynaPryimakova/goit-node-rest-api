import { HttpError, ctrlWrapper } from "../helpers/index.js";
import User from "../models/UserModel.js";

const signUp = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email already in use");
    }
    const newUser = await User.create(req.body);

    res.status(201).json({
        user: { email: newUser.email, name: newUser.name },
    });
};

export default {
    signUp: ctrlWrapper(signUp),
};
