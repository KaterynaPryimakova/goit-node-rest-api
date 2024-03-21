import { Schema, model } from "mongoose";
import { phonePattern } from "../constants/contactConstants.js";
import { handleMongooseError } from "../helpers/handleMongooseError.js";
import { setUpdateSettings } from "../helpers/setUpdateSettings.js";

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
        avatar: {
            type: String,
            default: null,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "user",
            require: true,
        },
    },
    { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

contactSchema.pre("findOneAndUpdate", setUpdateSettings);

contactSchema.post("findOneAndUpdate", handleMongooseError);

const Contact = model("contact", contactSchema);

export default Contact;
