const nodemailer = require('nodemailer');

let fetchFn;
async function getFetch() {
  if (fetchFn) return fetchFn;
  const mod = await import('node-fetch');
  fetchFn = mod.default;
  return fetchFn;
}

const DEFAULT_HOST = 'smtp-relay.brevo.com';
const DEFAULT_PORT = 587;
const DEFAULT_FROM_NAME = 'JerseyCulture';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

function getMailerConfig() {
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_PASSWORD;

  const fromEmail = process.env.BREVO_FROM_EMAIL || user;
  const fromName = process.env.BREVO_FROM_NAME || DEFAULT_FROM_NAME;
  const host = process.env.BREVO_SMTP_HOST || DEFAULT_HOST;
  const port = Number(process.env.BREVO_SMTP_PORT) || DEFAULT_PORT;
  const secure = port === 465;
  const apiKey = process.env.BREVO_API_KEY;

  return {
    user,
    pass,
    fromEmail,
    fromName,
    host,
    port,
    secure,
    apiKey,
  };
}

let transporter;
let verifyPromise;

function createTransporter() {
  const { user, pass, host, port, secure } = getMailerConfig();

  if (!user || !pass) {
    throw new Error('Brevo SMTP credentials are not configured');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

async function ensureTransporterReady() {
  if (!verifyPromise) {
    verifyPromise = getTransporter().verify();
  }
  return verifyPromise;
}

function buildFromAddress() {
  const { fromEmail, fromName } = getMailerConfig();
  return fromName ? `${fromName} <${fromEmail}>` : fromEmail;
}

async function sendViaBrevoApi({ toEmail, name, subject, text, html }) {
  const { apiKey, fromEmail, fromName } = getMailerConfig();
  if (!apiKey) {
    throw new Error('Brevo API key is not configured');
  }
  if (!fromEmail) {
    throw new Error('Brevo from email is not configured');
  }

  const fetch = await getFetch();
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: fromEmail, name: fromName || DEFAULT_FROM_NAME },
      to: [{ email: toEmail, name: name || toEmail }],
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Brevo API error: ${response.status} ${body}`.trim());
  }
}

async function sendEmail({ toEmail, name, subject, text, html }) {
  const { apiKey } = getMailerConfig();

  if (apiKey) {
    try {
      await sendViaBrevoApi({ toEmail, name, subject, text, html });
      return;
    } catch (error) {
      console.warn('Brevo API send failed, falling back to SMTP', error?.message);
    }
  }

  const transport = getTransporter();
  await ensureTransporterReady();
  await transport.sendMail({
    from: buildFromAddress(),
    to: toEmail,
    subject,
    text,
    html,
  });
}

async function sendSignupOtpEmail({ toEmail, name, otp }) {
  await sendEmail({
    toEmail,
    name,
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
  await sendEmail({
    toEmail,
    name,
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
