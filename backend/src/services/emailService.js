const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: parseInt(config.smtpPort) || 587,
  secure: parseInt(config.smtpPort) === 465,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
});

module.exports = {
  async sendWelcomeEmail(email, firstName) {
    const coursesUrl = `${config.frontendUrl}/courses/courses-list`;
    const loginUrl = `${config.frontendUrl}/auth/login`;
    try {
      await transporter.sendMail({
        from: config.smtpFrom,
        to: email,
        subject: 'Welcome to Al-Kahaf LMS',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2c3e50;">Welcome ${firstName}!</h1>
            <p>Your account has been created successfully. We're excited to have you on board.</p>

            <p>Start your learning journey by exploring our courses:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${coursesUrl}"
                style="background-color: #3498db; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                Explore Courses
              </a>
            </div>

            <p>Already know what you want to learn? <a href="${loginUrl}" style="color: #3498db;">Log in to your account</a></p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px;">Al-Kahaf Online Academy &mdash; Empowering learners across Pakistan.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  },

  async sendOtpEmail(email, firstName, otp) {
    try {
      await transporter.sendMail({
        from: config.smtpFrom,
        to: email,
        subject: 'Your Al-Kahaf Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Email Verification</h2>
            <p>Hi ${firstName},</p>
            <p>Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #f4f4f4; border: 2px dashed #3498db; border-radius: 8px; padding: 20px 40px;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #2c3e50;">${otp}</span>
              </div>
            </div>
            <p style="color: #e74c3c;">Do not share this code with anyone.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">Al-Kahaf Online Academy &mdash; If you did not create an account, ignore this email.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('OTP email sending failed:', error);
      return false;
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
