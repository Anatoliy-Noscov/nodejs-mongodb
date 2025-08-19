import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';



export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},

}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;


  const contactsQuery = ContactsCollection.find();

  if(filter.gender) {
    contactsQuery.where('gender').equals(filter.gender);
  }
  if(filter.maxAge) {
    contacts.Query.where('age').lte(filter.maxAge);
  }
  if(filter.minAge) {
    contactsQuery.where('age').gte(filter.minAge);
  }
  if(filter.maxAvgMark) {
    contactsQuery.where('avgMark').lte
  }
  if(filter.minAvgMark) {
    contactsQuery.where('avgMark').gte(filter.minAvgMark);
  }




  // const contactsCount = await ContactsCollection.find()
  // .merge(contactsQuery)
  // .countDocuments();

  // const contacts = await contactsQuery
  // .skip(skip)
  // .limit(limit)
  // .sort({[sortBy]: sortOrder})
  // .exec();
  
  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);


  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  }
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
  const contact = await ContactsCollection.findById(id);
  if (!contact) return null;

  await ContactsCollection.deleteOne({ _id: id });
  return contact;
};




