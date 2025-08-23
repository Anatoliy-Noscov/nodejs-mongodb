import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';



export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,

}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;


  const contactsQuery = ContactsCollection.find({userId});

  if(filter.gender) {
    contactsQuery.where('gender').equals(filter.gender);
  }
  if(filter.maxAge) {
    contactsQuery.where('age').lte(filter.maxAge);
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

export const getContactById = async (id, userId) => {
  const contact = await ContactsCollection.findById({_id: id, userId});
  return contact;
};

export const createContact = async (payload, userId) => {
  const contact = await ContactsCollection.create({...payload, userId});
  return contact;
};

export async function updateContact(id, payload, userId) {
  const contact = await ContactsCollection.findByIdAndUpdate({_id: id, payload, userId}, {
    new: true, 
  });
  return contact;
}

export const deleteContact = async (id, userId) => {
  const contact = await ContactsCollection.findById({_id: id, userId});
  if (!contact) return null;

  await ContactsCollection.deleteOne({ _id: id, userId });
  return contact;
};




