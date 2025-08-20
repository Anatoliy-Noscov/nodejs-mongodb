import mongoose from 'mongoose';
const { Schema, model } = mongoose;


export const contactsSchema = new Schema(
    {
    name: {
        type: String, 
        required: true,
    },

    phone: {
        type: String, 
        required: true,
    },

    email: {
        type: String,
    },

    favorite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String, 
        enum: ['work', 'home', 'personal'],
        required: true, 
            default: 'personal',
        },
        },
        {
            timestamps: true,
            versionKey: false,
        },
);

export const ContactsCollection = model('Contacts', contactsSchema);
