import { Schema, model } from "mongoose";
import { phonePattern } from "../constants/contactConstants.js";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Set name for contact"],
        },
        email: {
            type: String,
            required: [true, "Set email for contact"],
        },
        phone: {
            type: String,
            match: phonePattern,
            required: [true, "Set phone for contact"],
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

export default Contact;
