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
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';

const router = new Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', 
  isValidId, 
  ctrlWrapper(getContactByIdController)
);

router.post('/', 
  upload.single('photo'),
  validateBody(createContactSchema), 
  ctrlWrapper(createContactController)
);

router.patch('/:contactId', 
  isValidId, 
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController) 
);

router.delete('/:contactId', 
  isValidId, 
  ctrlWrapper(deleteContactController)
);

export default router;