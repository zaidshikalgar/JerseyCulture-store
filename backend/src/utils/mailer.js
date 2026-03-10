const nodemailer = require('nodemailer');

function getMailerConfig() {
  const user = process.env.GMAIL_SMTP_USER;
  const pass = process.env.GMAIL_SMTP_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('Gmail SMTP credentials are not configured');
  }

  return {
    user,
    pass,
    from: process.env.GMAIL_FROM_EMAIL || user,
  };
}

let transporter;
function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const { user, pass } = getMailerConfig();
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  return transporter;
}

async function sendSignupOtpEmail({ toEmail, name, otp }) {
  const { from } = getMailerConfig();
  const transport = getTransporter();

  await transport.sendMail({
    from,
    to: toEmail,
    subject: 'Your JerseyCulture signup OTP',
    text: `Hi ${name}, your OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="margin-bottom: 8px;">Verify your JerseyCulture account</h2>
        <p style="margin-top: 0;">Hi ${name}, use this OTP to complete sign up:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 16px 0;">${otp}</p>
        <p style="color: #555;">This OTP expires in 10 minutes.</p>
      </div>
    `,
  });
}

async function sendPasswordResetOtpEmail({ toEmail, name, otp }) {
  const { from } = getMailerConfig();
  const transport = getTransporter();

  await transport.sendMail({
    from,
    to: toEmail,
    subject: 'Your JerseyCulture password reset OTP',
    text: `Hi ${name}, your password reset OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="margin-bottom: 8px;">Reset your JerseyCulture password</h2>
        <p style="margin-top: 0;">Hi ${name}, use this OTP to reset your password:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 16px 0;">${otp}</p>
        <p style="color: #555;">This OTP expires in 10 minutes.</p>
      </div>
    `,
  });
}

module.exports = {
  sendSignupOtpEmail,
  sendPasswordResetOtpEmail,
};
