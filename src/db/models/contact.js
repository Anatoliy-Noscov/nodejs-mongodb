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
  }
}, {
  timestamps: true, 
  versionKey: false,
});

export const ContactsCollection = model('Contacts', contactsSchema);


// const userSchema = new Schema({
//   name: { type: String, required: true },
//   email: { 
//     type: String, 
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: { type: String, required: true }
// }, {
//   timestamps: true,
//   versionKey: false
// });
// userSchema.methods.toJSON = function() {
//   const obj = this.toObject();
//   delete obj.password;
//   return obj;
// }

// export const User = model("User", userSchema);

const sessionSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  accessTokenValidUntil: { type: Date, required: true },
  refreshTokenValidUntil: { type: Date, required: true }
}, {
  timestamps: true,
  versionKey: false
});

export const Session = model('Session', sessionSchema);