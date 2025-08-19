import Joi from 'joi';



export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/).required(),
  favorite: Joi.boolean()
});



export const updateContactSchema = Joi.object({
  favorite: Joi.boolean().required()
  });