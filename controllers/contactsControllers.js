import { HttpError, ctrlWrapper } from "../helpers/index.js";
import contactsServices from "../services/contactsServices.js";
import fs from "fs/promises";
import path from "path";
// import Jimp from "jimp";

const avatarPath = path.resolve("public", "avatars");

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;
    const result = await contactsServices.listContacts(
        { owner },
        { skip, limit }
    );

    const filteredContacts = result.filter(
        (contact) => contact.favorite === Boolean(favorite)
    );
    res.json(filteredContacts);
};

const getOneContact = async (req, res) => {
    const { id } = req.params;
    const result = await contactsServices.getContactById(id);
    if (!result) {
        throw HttpError(404);
    }
    res.json(result);
};

const deleteContact = async (req, res) => {
    const { id } = req.params;
    const result = await contactsServices.removeContact(id);
    if (!result) {
        throw HttpError(404);
    }
    res.json(result);
};

const createContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { path: oldPath, filename } = req.file;

    // Jimp.read(filename)
    //     .then((name) => {
    //         return name
    //             .resize(250, 250) // resize
    //             .quality(60) // set JPEG quality
    //             .greyscale() // set greyscale
    //             .write("lena-small-bw.jpg"); // save
    //     })
    //     .catch((err) => {
    //         HttpError(400, `Error Jimp>>>${err.message}`);
    //     });

    const newPath = path.join(avatarPath, filename);
    fs.rename(oldPath, newPath);
    const avatar = path.join("public", "avatars", filename);
    const result = await contactsServices.addContact({
        ...req.body,
        avatar,
        owner,
    });
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    const result = await contactsServices.updateContactById(id, req.body);
    if (!result) {
        throw HttpError(404);
    }
    res.json(result);
};

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
};
