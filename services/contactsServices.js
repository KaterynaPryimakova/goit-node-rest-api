import ContactModel from "../models/ContactModel.js";

const listContacts = () => ContactModel.find();

const addContact = (data) => ContactModel.create(data);

const getContactById = (id) => ContactModel.findById(id);

const updateContactById = (id, data) =>
    ContactModel.findByIdAndUpdate(id, data, { new: true });

const removeContact = (id) => ContactModel.findByIdAndDelete(id);

export default {
    listContacts,
    getContactById,
    addContact,
    updateContactById,
    removeContact,
};
