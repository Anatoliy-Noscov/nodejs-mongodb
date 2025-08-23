
import { Router } from 'express';
import {
  getContactsController,
  createContactController,
  getContactByIdController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contacts.js';
import { updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = new Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post('/', 
  validateBody(createContactSchema),
ctrlWrapper(createContactController));

router.delete('/:contactId', 
  isValidId,  ctrlWrapper(deleteContactController));

router.patch('/:contactId', 
  isValidId,
  validateBody(updateContactSchema),ctrlWrapper(patchContactController));

export default router;
