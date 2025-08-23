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
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';
import { isValidId } from '../middlewares/isValidId.js';


const router = new Router();

router.use(authenticate);

router.get('/', 
  checkRoles(ROLES.TEACHER, ROLES.PARENT), 
  ctrlWrapper(getContactsController)
);

router.get('/:contactId', 
  checkRoles(ROLES.TEACHER, ROLES.PARENT), 
  isValidId, 
  ctrlWrapper(getContactByIdController)
);

router.post('/', 
  checkRoles(ROLES.TEACHER), 
  validateBody(createContactSchema), 
  ctrlWrapper(createContactController)
);

router.patch('/:contactId', 
  checkRoles(ROLES.TEACHER), 
  isValidId, 
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController) 
);

router.delete('/:contactId', 
  checkRoles(ROLES.TEACHER), 
  isValidId, 
  ctrlWrapper(deleteContactController)
);

export default router;