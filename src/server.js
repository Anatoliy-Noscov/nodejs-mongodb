import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts } from './services/contacts.js';
import { getContactById } from './services/contacts.js';

const PORT = Number(getEnvVar('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(pino());

  app.get('/contacts', async (req, res, next) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      data: contacts,
      message: 'Successfully found contacts!',
    });
  });

  app.get('/contacts/:id', async (req, res, next) => {
    const { id } = req.params;
    const contact = await getContactById(id);

    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.status(200).json({
      data: contact,
      message: `Successfully found contact with id ${id}!`,
    });
  });

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};