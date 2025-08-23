import { model, Schema } from 'mongoose';
import { ROLES } from '../../constants/index.js';


const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [ROLES.TEACHER, ROLES.PARENT],
      default: ROLES.PARENT,
    },
  },
  
  { 
    timestamps: {
      createdAt: 'createdAt', 
      updatedAt: 'updatedAt' 
    }, 
    versionKey: false 
  }
);

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

export const User = model('User', userSchema);


