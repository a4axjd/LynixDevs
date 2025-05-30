const express = require("express");
const { supabase } = require("../config/supabase");
const { sendEmail, getSmtpConfig } = require("../config/dynamicEmail");
const router = express.Router();

// Get current user
router.get("/user", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) throw error;

    res.json({ user });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: error.message });
  }
});

// Send password reset email
router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Get settings for email expiry
    const config = await getSmtpConfig();
    const resetExpiryHours = config.password_reset_expiry_hours || 1;

    // Generate reset token (in a real app, you'd generate a secure token)
    const resetToken = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + resetExpiryHours * 60 * 60 * 1000);

    // Save reset token to database (you'd need a password_resets table)
    // For now, just send the email

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const emailHtml = `
      <h2>Password Reset Request</h2>
      <p>You have requested to reset your password. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>This link will expire in ${resetExpiryHours} hour(s).</p>
      <p>If you didn't request this reset, please ignore this email.</p>
      <p>Best regards,<br>LynixDevs Team</p>
    `;

    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: emailHtml,
      text: `You have requested to reset your password. Visit this link to reset: ${resetUrl}`,
    });

    res.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send password reset email",
    });
  }
});

// Send email verification
router.post("/send-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Get settings for email expiry
    const config = await getSmtpConfig();
    const verificationExpiryHours =
      config.email_verification_expiry_hours || 24;

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(
      Date.now() + verificationExpiryHours * 60 * 60 * 1000
    );

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const emailHtml = `
      <h2>Email Verification</h2>
      <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
      <p>This link will expire in ${verificationExpiryHours} hour(s).</p>
      <p>If you didn't create an account, please ignore this email.</p>
      <p>Welcome to LynixDevs!</p>
    `;

    await sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      html: emailHtml,
      text: `Thank you for signing up! Please verify your email address by visiting: ${verificationUrl}`,
    });

    res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send verification email",
    });
  }
});

module.exports = router;
