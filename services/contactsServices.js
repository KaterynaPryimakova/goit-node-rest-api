import ContactModel from "../models/ContactModel.js";

const listContacts = (filter = {}, query = {}) =>
    ContactModel.find(filter, "-createdAt -updatedAt", query).populate(
        "owner",
        "name email"
    );

const addContact = (data) => ContactModel.create(data);

const getContactById = (id) => ContactModel.findById(id);

const updateContactById = (id, data) =>
    ContactModel.findByIdAndUpdate(id, data);

const removeContact = (id) => ContactModel.findByIdAndDelete(id);

export default {
    listContacts,
    getContactById,
    addContact,
    updateContactById,
    removeContact,
};
