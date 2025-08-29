import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const contactsSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  isFavourite: { type: Boolean, default: false },
  contactType: { 
    type: String, 
    enum: ['work', 'home', 'personal'], 
    default: 'personal'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photo: {type: String},
}, {
  timestamps: true, 
  versionKey: false,
});

export const ContactsCollection = model('Contacts', contactsSchema);

