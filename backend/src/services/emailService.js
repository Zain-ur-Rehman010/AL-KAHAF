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
    const coursesUrl = `${config.frontendUrl}/courses/course-grid`;
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

  async sendAdminEnrollmentEmail(adminEmails, studentName, studentEmail, courseTitle, amount, txnRef) {
    const dashboardUrl = `${config.frontendUrl}/admin/enrollments-list`;
    try {
      await transporter.sendMail({
        from: config.smtpFrom,
        to: adminEmails.join(','),
        subject: `New Enrollment via JazzCash — ${courseTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <div style="background: #d8ac27; padding: 16px 24px; border-radius: 6px 6px 0 0;">
              <h2 style="color: #fff; margin: 0;">New Enrollment Received</h2>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 16px; color: #333;">A student has successfully enrolled via <strong>JazzCash</strong>.</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: #f9f9f9;">
                  <td style="padding: 10px 14px; font-weight: bold; color: #555; width: 40%;">Student</td>
                  <td style="padding: 10px 14px; color: #333;">${studentName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-weight: bold; color: #555;">Email</td>
                  <td style="padding: 10px 14px; color: #333;">${studentEmail}</td>
                </tr>
                <tr style="background: #f9f9f9;">
                  <td style="padding: 10px 14px; font-weight: bold; color: #555;">Course</td>
                  <td style="padding: 10px 14px; color: #333;">${courseTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-weight: bold; color: #555;">Amount Paid</td>
                  <td style="padding: 10px 14px; color: #159F46; font-weight: bold;">PKR ${amount}</td>
                </tr>
                <tr style="background: #f9f9f9;">
                  <td style="padding: 10px 14px; font-weight: bold; color: #555;">Transaction Ref</td>
                  <td style="padding: 10px 14px; color: #333; font-family: monospace;">${txnRef}</td>
                </tr>
              </table>
              <div style="text-align: center; margin-top: 24px;">
                <a href="${dashboardUrl}" style="background: #d8ac27; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">
                  View in Dashboard
                </a>
              </div>
            </div>
            <div style="padding: 12px 24px; background: #f5f5f5; border-radius: 0 0 6px 6px;">
              <p style="color: #999; font-size: 12px; margin: 0;">Al-Kahaf Online Academy — Automated enrollment notification</p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Admin enrollment email failed:', error);
    }
  },

  async sendTrialReminderEmail(email, firstName, emailType, courseUrl) {
    const variants = {
      day1: {
        subject: 'Your Free Trial at Al-Kahaf Has Started!',
        heading: 'Welcome to Your Free Trial!',
        body: 'Your 3-day free trial has officially started. You now have full access to your assigned course. Dive in and explore — we\'re excited to have you learning with us.',
        ctaText: 'Start Learning Now',
        urgencyNote: '',
      },
      day2: {
        subject: 'Reminder: 1 Day Left in Your Free Trial — Al-Kahaf',
        heading: 'Only 1 Day Left in Your Trial',
        body: 'Your free trial expires tomorrow. Don\'t let your learning momentum stop here! Enroll now and continue your journey without any interruption.',
        ctaText: 'Enroll Now — Don\'t Miss Out',
        urgencyNote: '<p style="color:#e74c3c;font-weight:bold;text-align:center;font-size:15px;">Your trial expires in 24 hours</p>',
      },
      day3: {
        subject: 'Last Day of Your Free Trial — Enroll Before It Ends',
        heading: 'Today Is Your Last Day',
        body: 'This is your final reminder — your free trial ends today. Enroll now to keep your progress, retain course access, and continue learning without interruption.',
        ctaText: 'Enroll Now',
        urgencyNote: '<p style="color:#e74c3c;font-weight:bold;text-align:center;font-size:15px;">Trial expires today — act now</p>',
      },
    };

    const v = variants[emailType];
    if (!v) return;

    try {
      await transporter.sendMail({
        from: config.smtpFrom,
        to: email,
        subject: v.subject,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:8px;">
            <div style="background:linear-gradient(135deg,#2c1506,#522811);padding:20px 24px;border-radius:6px 6px 0 0;text-align:center;">
              <h2 style="color:#d8ac27;margin:0;">${v.heading}</h2>
            </div>
            <div style="padding:24px;">
              <p style="font-size:16px;color:#333;">Assalamu Alaikum <strong>${firstName}</strong>,</p>
              <p style="color:#555;line-height:1.7;">${v.body}</p>
              ${v.urgencyNote}
              <div style="text-align:center;margin:28px 0;">
                <a href="${courseUrl}" style="background:#d8ac27;color:#fff;padding:14px 36px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:16px;display:inline-block;">
                  ${v.ctaText}
                </a>
              </div>
              <p style="color:#999;font-size:13px;text-align:center;">
                Button not working? <a href="${courseUrl}" style="color:#d8ac27;">${courseUrl}</a>
              </p>
            </div>
            <div style="padding:12px 24px;background:#f5f5f5;border-radius:0 0 6px 6px;">
              <p style="color:#999;font-size:12px;margin:0;">Al-Kahaf Online Academy &mdash; Empowering learners across Pakistan.</p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error(`Trial reminder email (${emailType}) failed:`, error);
    }
  },

  async sendFreeTrialApprovedEmail(email, fullName, courseInterest, loginUrl, password = null) {
    try {
      const credentialsBlock = password
        ? `
          <div style="background:#f9f6ed;border:1px solid #d8ac27;border-radius:8px;padding:20px;margin:20px 0;">
            <p style="margin:0 0 8px;font-weight:bold;color:#2c3e50;">Your Login Credentials:</p>
            <table style="width:100%;">
              <tr><td style="padding:4px 0;color:#555;width:40%;">Email</td><td style="color:#333;font-family:monospace;">${email}</td></tr>
              <tr><td style="padding:4px 0;color:#555;">Password</td><td style="color:#333;font-family:monospace;">${password}</td></tr>
            </table>
            <p style="margin:12px 0 0;color:#e74c3c;font-size:13px;">Please change your password after first login.</p>
          </div>`
        : `<p>You can log in using your existing account credentials.</p>`;

      await transporter.sendMail({
        from: config.smtpFrom,
        to: email,
        subject: 'Your Free Trial Request Has Been Approved — Al-Kahaf Online Academy',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:8px;">
            <div style="background:linear-gradient(135deg,#2c1506,#522811);padding:20px 24px;border-radius:6px 6px 0 0;text-align:center;">
              <h2 style="color:#d8ac27;margin:0;">Free Trial Approved!</h2>
            </div>
            <div style="padding:24px;">
              <p style="font-size:16px;color:#333;">Assalamu Alaikum <strong>${fullName}</strong>,</p>
              <p style="color:#555;">We are pleased to inform you that your free trial request for <strong>${courseInterest}</strong> has been <span style="color:#27ae60;font-weight:bold;">approved</span>.</p>
              <p style="color:#555;">An instructor has been assigned and will contact you shortly to schedule your trial session.</p>
              ${credentialsBlock}
              <div style="text-align:center;margin:28px 0;">
                <a href="${loginUrl}" style="background:#d8ac27;color:#fff;padding:13px 32px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px;">
                  Login to Your Account
                </a>
              </div>
              <p style="color:#777;font-size:13px;">If you have any questions, feel free to reply to this email.</p>
            </div>
            <div style="padding:12px 24px;background:#f5f5f5;border-radius:0 0 6px 6px;">
              <p style="color:#999;font-size:12px;margin:0;">Al-Kahaf Online Academy &mdash; Empowering learners across Pakistan.</p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Free trial approval email failed:', error);
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

  async sendContactFormEmail({ name, email, phone, subject, message }) {
    const adminEmail = config.smtpFrom;
    await transporter.sendMail({
      from: config.smtpFrom,
      to: adminEmail,
      replyTo: email,
      subject: `Contact Us: ${subject || 'New Message'} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:8px; font-weight:bold;">Name</td><td style="padding:8px;">${name}</td></tr>
            <tr><td style="padding:8px; font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>
            <tr><td style="padding:8px; font-weight:bold;">Phone</td><td style="padding:8px;">${phone || '—'}</td></tr>
            <tr><td style="padding:8px; font-weight:bold;">Subject</td><td style="padding:8px;">${subject || '—'}</td></tr>
          </table>
          <h3 style="color: #2c3e50; margin-top: 20px;">Message</h3>
          <p style="background:#f9f9f9; padding:15px; border-radius:4px;">${message}</p>
        </div>
      `,
    });
  },
};
