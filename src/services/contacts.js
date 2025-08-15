import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await ContactsCollection.findById(id);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export async function updateContact(id, payload) {
  const contact = await ContactsCollection.findByIdAndUpdate(id, payload, {
    new: true, 
  });
  return contact;
}

export const deleteContact = async (id) => {
  const contact = await ContactsCollection.findOneAndDelete(id);
  return contact;
}