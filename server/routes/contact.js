const express = require("express");
const { supabase, supabaseAdmin } = require("../config/supabase");
const emailAutomationService = require("../services/emailAutomationService");
const router = express.Router();

// Submit contact form
router.post("/submit", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    console.log("Processing contact form submission:", {
      name,
      email,
      subject,
    });

    // Use service role client for admin operations to bypass RLS
    const client = supabaseAdmin || supabase;

    // Save contact submission to database
    const { data: submission, error: dbError } = await client
      .from("contact_submissions")
      .insert({
        name,
        email,
        subject,
        message,
        read: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save contact submission");
    }

    console.log("Contact submission saved:", submission.id);

    // Trigger automated email reply
    try {
      const automationResult =
        await emailAutomationService.sendContactFormAutoReply(
          email,
          name,
          message
        );

      if (automationResult.success) {
        console.log("Auto-reply email sent successfully");
      } else {
        console.log(
          "Auto-reply email failed or no automation rule found:",
          automationResult.error
        );
      }
    } catch (automationError) {
      console.error("Error in email automation:", automationError);
      // Don't fail the contact form submission if email automation fails
    }

    res.json({
      success: true,
      message: "Contact form submitted successfully",
      submission_id: submission.id,
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit contact form",
    });
  }
});

module.exports = router;
