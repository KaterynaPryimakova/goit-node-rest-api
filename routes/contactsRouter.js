import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import { validateBody } from "../helpers/validateBody.js";
import { isValidId } from "../helpers/validateId.js";
import {
    createContactSchema,
    updateContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

// contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.post(
    "/",
    validateBody(createContactSchema),
    contactsControllers.createContact
);

contactsRouter.put(
    "/:id",
    isValidId,
    validateBody(updateContactSchema),
    contactsControllers.updateContact
);

export default contactsRouter;
