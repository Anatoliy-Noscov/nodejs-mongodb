import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const contactsSchema = new Schema({
  name: { type: String, required: true },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'],
  },
  avgMark: {
    type: Number,
    required: true,
  },
  onDuty: {
    type: Boolean,
    required: true,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },  
  phoneNumber: { type: String, required: true },
  email: { type: String },
  isFavourite: { type: Boolean, default: false },
  contactType: { 
    type: String, 
    enum: ['work', 'home', 'personal'], 
    default: 'personal'
  }
}, {
  timestamps: true, 
  versionKey: false,
});

export const ContactsCollection = model('Contacts', contactsSchema);

