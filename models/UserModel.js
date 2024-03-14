import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";
import { emailPattern } from "../constants/userConstants.js";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        password: {
            type: String,
            minlength: 6,
            required: [true, "Password is required"],
            unique: true,
        },
        email: {
            type: String,
            match: emailPattern,
            required: [true, "Email is required"],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter",
        },
        token: {
            type: String,
            default: null,
        },
    },
    { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

export default User;
