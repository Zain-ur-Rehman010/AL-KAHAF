const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: true,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
});

module.exports = {
  async sendWelcomeEmail(email, firstName) {
    try {
      await transporter.sendMail({
        from: config.smtpFrom,
        to: email,
        subject: 'Welcome to Al-Kahaf LMS',
        html: `
          <h1>Welcome ${firstName}!</h1>
          <p>Your account has been created successfully.</p>
          <p>Start learning with us today!</p>
        `,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  },

  async sendEnrollmentConfirmation(email, firstName, courseTitle) {
    try {
      await transporter.sendMail({
        from: config.smtpFrom,
        to: email,
        subject: `Enrollment Confirmation: ${courseTitle}`,
        html: `
          <h1>Welcome to ${courseTitle}!</h1>
          <p>Hi ${firstName},</p>
          <p>You have been successfully enrolled in ${courseTitle}.</p>
          <p>Happy learning!</p>
        `,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  },

  async sendCertificateEmail(email, firstName, courseTitle, certificateUrl) {
    try {
      await transporter.sendMail({
        from: config.smtpFrom,
        to: email,
        subject: `Certificate Issued: ${courseTitle}`,
        html: `
          <h1>Congratulations ${firstName}!</h1>
          <p>You have successfully completed ${courseTitle}.</p>
          <p><a href="${certificateUrl}">Download Your Certificate</a></p>
        `,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  },
};
