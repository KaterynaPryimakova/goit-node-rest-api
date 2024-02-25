import fs from "fs/promises";
import path from "path";
import DetectFileEncodingAndLanguage from "detect-file-encoding-and-language";
import { nanoid } from "nanoid";

const contactPath = path.resolve("db", "contacts.json");
const updateContacts = (contacts) =>
    fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));

export async function listContacts() {
    const fileCode = await DetectFileEncodingAndLanguage(contactPath);
    const contacts = JSON.parse(await fs.readFile(contactPath, fileCode));
    return contacts;
}

export async function getContactById(contactId) {
    const contacts = await listContacts();
    const result = contacts.find((contact) => contact.id === contactId);
    return result || null;
}

export async function addContact(data) {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        ...data,
    };
    contacts.push(newContact);
    await updateContacts(contacts);
    return newContact;
}

export async function updateContactById(contactId, data) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    contacts[index] = { ...contacts[index], ...data };
    await updateContacts(contacts);
    return contacts[index];
}

export async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    const [result] = contacts.splice(index, 1);
    await updateContacts(contacts);
    return result;
}