const nodemailer = require("nodemailer");
const { supabase, supabaseAdmin } = require("./supabase");

let cachedTransporter = null;
let lastConfigUpdate = null;

// Get SMTP configuration from database
async function getSmtpConfig() {
  try {
    // Use service role client for admin operations to bypass RLS
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from("admin_settings")
      .select(
        "smtp_host, smtp_port, smtp_username, smtp_password, smtp_use_tls, smtp_reply_to, from_email, from_name"
      )
      .single();

    if (error) {
      console.error("Error fetching SMTP config:", error);
      // Fallback to environment variables
      return {
        smtp_host: process.env.SMTP_HOST || "",
        smtp_port: parseInt(process.env.SMTP_PORT) || 587,
        smtp_username: process.env.SMTP_USER || "",
        smtp_password: process.env.SMTP_PASSWORD || "",
        smtp_use_tls: true,
        smtp_reply_to: "",
        from_email: process.env.SMTP_FROM_EMAIL || "noreply@lynixdevs.us",
        from_name: "LynixDevs",
      };
    }

    return data;
  } catch (error) {
    console.error("Error in getSmtpConfig:", error);
    // Fallback to environment variables
    return {
      smtp_host: process.env.SMTP_HOST || "",
      smtp_port: parseInt(process.env.SMTP_PORT) || 587,
      smtp_username: process.env.SMTP_USER || "",
      smtp_password: process.env.SMTP_PASSWORD || "",
      smtp_use_tls: true,
      smtp_reply_to: "",
      from_email: process.env.SMTP_FROM_EMAIL || "noreply@lynixdevs.us",
      from_name: "LynixDevs",
    };
  }
}

// Create transporter with current SMTP config
async function createTransporter() {
  const config = await getSmtpConfig();

  if (!config.smtp_host || !config.smtp_username) {
    throw new Error("SMTP configuration is incomplete");
  }

  return nodemailer.createTransport({
    host: config.smtp_host,
    port: config.smtp_port,
    secure: config.smtp_port === 465, // true for 465, false for other ports
    auth: {
      user: config.smtp_username,
      pass: config.smtp_password,
    },
    tls: config.smtp_use_tls
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
  });
}

// Get or create cached transporter (refresh every 5 minutes)
async function getTransporter() {
  const now = Date.now();

  if (
    !cachedTransporter ||
    !lastConfigUpdate ||
    now - lastConfigUpdate > 300000
  ) {
    try {
      cachedTransporter = await createTransporter();
      lastConfigUpdate = now;
      console.log("SMTP transporter updated with latest config");
    } catch (error) {
      console.error("Failed to create SMTP transporter:", error);
      throw error;
    }
  }

  return cachedTransporter;
}

// Send email function
async function sendEmail({ to, subject, html, text, replyTo }) {
  try {
    const transporter = await getTransporter();
    const config = await getSmtpConfig();

    const mailOptions = {
      from: `${config.from_name} <${config.from_email}>`,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || config.smtp_reply_to || config.from_email,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Clear cached transporter (useful when settings are updated)
function clearTransporterCache() {
  cachedTransporter = null;
  lastConfigUpdate = null;
  console.log("SMTP transporter cache cleared");
}

module.exports = {
  sendEmail,
  getSmtpConfig,
  clearTransporterCache,
};
