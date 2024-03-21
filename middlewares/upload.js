import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/index.js";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
    destination,
    filename: (req, file, callback) => {
        const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileName = `${uniquePrefix}-${file.originalname}`;
        callback(null, fileName);
    },
});

const limits = {
    fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
    const extention = file.originalname.split(".").pop();
    if (extention === "exe") {
        return callback(HttpError(400, ".exe is unvalid extention format"));
    }
    callback(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits,
});
