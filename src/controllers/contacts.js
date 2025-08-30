import {
    getAllContacts,
    getContactById,
    createContact,
    deleteContact,
    updateContact,
  } from '../services/contacts.js';
  import createHttpError from 'http-errors';
  import { parsePaginationParams } from '../utils/parsePaginationParams.js';
  import { parseSortParams } from '../utils/parseSortParams.js';
  import { parseFilterParams } from '../utils/parseFilterParams.js';
  import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
  import { saveFileToCloudinary} from '../utils/saveFileToCloudinary.js';
  import { getEnvVar } from '../utils/getEnvVar.js';
  
  export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
  
    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });
  
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  };
  
  export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);
  
    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }
  
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  };
  
  export const createContactController = async (req, res) => {
    console.log('User ID from request:', req.user._id);
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file); 
  
    let photoUrl;
    if (req.file) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(req.file);
      } else {
        photoUrl = await saveFileToUploadDir(req.file);
      }
    }
  
    const contact = await createContact(
      { ...req.body, photo: photoUrl },
      req.user._id                      
    );
    
    console.log('Created contact:', contact);
  
    res.status(201).json({
      status: 201,
      message: 'Successfully created contact!',
      data: contact,
    });
  };
  
  export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId, req.user._id);
  
    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }
  
    res.status(204).send();
  };
  
  export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const photo = req.file;
  
    let photoUrl;
  
    if (photo) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }
  
    const result = await updateContact(
      contactId, 
      { ...req.body, photo: photoUrl },
      req.user._id 
    );
      
    if(!result) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }
  
    res.json({
      status: 200, 
      message: `Successfully patched a contact!`,
      data: result, 
    });
  };
  