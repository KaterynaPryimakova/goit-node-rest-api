import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import contactsServices from "../services/contactsServices.js";

const getAllContacts = async (req, res, next) => {
    const result = await contactsServices.listContacts();
    res.json(result);
};

const getOneContact = async (req, res, next) => {
    const { id } = req.params;
    const result = await contactsServices.getContactById(id);
    if (!result) {
        throw HttpError(404);
    }
    res.json(result);
};

const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    const result = await contactsServices.removeContact(id);
    if (!result) {
        throw HttpError(404);
    }
    res.json(result);
};

const createContact = async (req, res, next) => {
    const result = await contactsServices.addContact(req.body);
    res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
        throw HttpError(400, "Body must have at least one field");
    }
    const { id } = req.params;
    const result = await contactsServices.updateContactById(id, data);
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
