import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import {randomBytes} from 'crypto';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import jwt from 'jsonwebtoken';
import {SMTP} from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';



export const registerUser = async (payload) => {

  const existingUser = await User.findOne({email: payload.email});
  if(existingUser) throw createHttpError(409,'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await User.create({
    ...payload,
    password: encryptedPassword
  });


  const userWithoutPassword =  {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };

  return userWithoutPassword;
};


export const loginUser = async (payload) => {
  const user = await User.findOne({email: payload.email});
  if(!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if(!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({userId: user._id});

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
 } );
}

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({_id: sessionId});
}

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  
  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  try {
    console.log('Looking for user with email:', email);
    const user = await User.findOne({email});
    
    if(!user) {
      console.log('User not found:', email);
      throw createHttpError(404, 'User not found');
    }

    console.log('User found, generating token...');
    const resetToken = jwt.sign(
      {
        sub: user._id,
        email,
      }, 
      getEnvVar('JWT_SECRET'), 
      {
        expiresIn: '5m',
      },
    );

    const resetUrl = `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`;
    console.log('Generated reset URL:', resetUrl);

    console.log('Sending email to:', email);
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
        <p>This link will expire in 5 minutes.</p>
      `,
    });

    console.log('Email sent successfully');
    
  } catch (error) {
    console.error('Error in requestResetToken:', error);
    throw error;
  }
};