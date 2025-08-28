import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
    host: getEnvVar(SMTP.SMTP_HOST),
    port: Number(getEnvVar(SMTP.SMTP_PORT)),
    secure: false,
    auth: {
        user: getEnvVar(SMTP.SMTP_USER),
        pass: getEnvVar(SMTP.SMTP_PASSWORD),
    },
});

transporter.verify(function(error, success) {
    if (error) {
        console.log('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

export const sendEmail = async (options) => {
    try {
        const result = await transporter.sendMail(options);
        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
};