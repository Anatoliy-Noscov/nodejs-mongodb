import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^(\+38|8|380)\d{10}$/).required(),
  isFavorite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').default('personal') 
},
{
  timestamps: true,
  versionKey: false,
}
);

export const updateContactSchema = Joi.object({
  isFavorite: Joi.boolean().required() 
});
