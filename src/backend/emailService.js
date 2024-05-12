import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configures SendGrid mail service with the API key and sets up the email sending function.
 * This module provides functionality to send emails using SendGrid's email service.
 */

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
  const msg = {
    to,
    from: process.env.SENDER_EMAIL, 
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Email sending error:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};
