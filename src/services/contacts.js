import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';



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
  const contact = await ContactsCollection.findById(id);
  if (!contact) return null;

  await ContactsCollection.deleteOne({ _id: id });
  return contact;
};

export const getAllContacts = async ({page, perPage}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;


  const contactsQuery = ContactsCollection.find();
  const contactsCount = await ContactsCollection.find()
  .merge(contactsQuery)
  .countDocuments();

  const contacts = await ContactsCollection.skip(skip).limit(limit).exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  }
};


