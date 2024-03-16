import { HttpError, ctrlWrapper } from "../helpers/index.js";
import contactsServices from "../services/contactsServices.js";

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
    const result = await contactsServices.addContact({ ...req.body, owner });
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
