import Joi from 'joi';


export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  age: Joi.number().integer().min(6).max(16).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  avgMark: Joi.number().min(2).max(12).required(),
  onDuty: Joi.boolean(),
});



export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    email: Joi.string().email(),
    age: Joi.number().integer().min(6).max(16).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    avgMark: Joi.number().min(2).max(12),
    onDuty: Joi.boolean(),
  });