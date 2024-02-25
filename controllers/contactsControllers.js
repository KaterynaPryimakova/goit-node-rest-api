import HttpError from "../helpers/HttpError.js";
import { listContacts, getContactById, addContact, updateContactById, removeContact } from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const result = await listContacts();
        res.json(result);
    } catch (error) {
        next(error)
        // res.status(500).json({
        //     message: "Server error"
        // })
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await getContactById(id);
        if(!result){
            throw HttpError(404)
        //    return res.status(404).json({
        //         message: "Not found"
        //     })
        }
        res.json(result);
    } catch (error) {
        next(error)
        // res.status(500).json({
        //     message: "Server error"
        // })
    }
};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};
