import jwt from "jsonwebtoken";
import * as authServices from "../services/authServices.js";
import { HttpError, ctrlWrapper, sendEmail } from "../helpers/index.js";
import Jimp from "jimp";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const { SECRET_KEY, BASE_URL } = process.env;
const avatarPath = path.resolve("public", "avatars");

const signUp = async (req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({ email });

    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const verificationCode = nanoid();

    const newUser = await authServices.signup({
        ...req.body,
        verificationCode,
    });

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a href="${BASE_URL}/api/users/verify/${verificationCode}" target="_blank">Click here to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: { email: newUser.email, subscription: newUser.subscription },
    });
};

const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
        throw HttpError(401, "Email is not verified");
    }

    const passwordCompare = await authServices.validatePassword(
        password,
        user.password
    );

    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const { _id: id } = user;

    const payload = {
        id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await authServices.updateUser({ _id: id }, { token });

    res.json({
        token,
        user: { email: user.email, subscription: user.subscription },
    });
};

const verify = async (req, res) => {
    const { verificationCode } = req.params;
    const user = await authServices.findUser({ verificationCode });

    if (!user) {
        throw HttpError(404, "User not found");
    }

    await authServices.updateUser(
        { _id: user._id },
        { verify: true, verificationCode: "" }
    );

    res.json({
        message: "Verification successful",
    });
};

const resendVerify = async (req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({ email });

    if (!user) {
        throw HttpError(404);
    }

    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a href="${BASE_URL}/api/users/verify/${user.verificationCode}" target="_blank">Click here to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Email successfully sent",
    });
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await authServices.updateUser({ _id }, { token: "" });

    res.status(204).json({
        message: "Logout success",
    });
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;

    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);

    const image = await Jimp.read(newPath);
    await image.resize(250, 250).quality(80).writeAsync(newPath);

    const avatarURL = path.join("avatars", filename);

    await authServices.updateUser({ _id }, { avatarURL });
    res.json({
        avatarURL,
    });
};

export default {
    signUp: ctrlWrapper(signUp),
    signIn: ctrlWrapper(signIn),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerify: ctrlWrapper(resendVerify),
};
