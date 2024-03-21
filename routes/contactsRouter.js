import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import {
    validateBody,
    isValidId,
    authenticate,
    upload,
} from "../middlewares/index.js";
import {
    createContactSchema,
    updateContactSchema,
    updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.post(
    "/",
    upload.single("avatar"),
    validateBody(createContactSchema),
    contactsControllers.createContact
);

contactsRouter.put(
    "/:id",
    isValidId,
    validateBody(updateContactSchema),
    contactsControllers.updateContact
);

contactsRouter.patch(
    "/:id/favorite",
    isValidId,
    validateBody(updateFavoriteSchema),
    contactsControllers.updateContact
);

export default contactsRouter;
