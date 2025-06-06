const express = require("express");
const { supabase, supabaseAdmin } = require("../config/supabase");
const { sendEmail } = require("../config/dynamicEmail");
// Adjust the path below to where your EmailAutomationService is located
const emailAutomationService = require("../services/EmailAutomationService");

const router = express.Router();

// Newsletter subscription
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Newsletter subscription request received for:", email);

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    // Check if email is already subscribed
    console.log("Checking if email is already subscribed...");
    const { data: existingSubscriber, error: fetchError } = await supabase
      .from("subscribers")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking existing subscriber:", fetchError);
      throw new Error(`Database error: ${fetchError.message}`);
    }

    if (existingSubscriber) {
      console.log("Email is already subscribed");
      return res.json({
        success: true,
        message: "You're already subscribed to our newsletter!",
      });
    }

    // Add new subscriber to the database
    console.log("Adding new subscriber to database...");
    const { error: insertError } = await supabase.from("subscribers").insert([
      {
        email,
        subscribed_at: new Date().toISOString(),
        status: "active",
      },
    ]);

    if (insertError) {
      // Check if it's a duplicate key error
      if (insertError.code === "23505") {
        console.log("Email already exists (caught duplicate key error)");
        return res.json({
          success: true,
          message: "You're already subscribed to our newsletter!",
        });
      }

      console.error("Error inserting new subscriber:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    // Trigger the welcome email automation
    try {
      const automationResult = await emailAutomationService.triggerAutomation(
        "newsletter_confirmation", // eventType in your automation_rules table
        email,
        {
          email,
          unsubscribe_link: `https://lynixdevs.us/unsubscribe?email=${encodeURIComponent(
            email
          )}`,
        }
      );
      if (!automationResult.success) {
        console.error("Automation service error:", automationResult.error);
      } else {
        console.log("Welcome email sent via automation service");
      }
    } catch (emailError) {
      console.error(
        "Error sending welcome email via automation service:",
        emailError
      );
      // Continue execution - we've saved the subscription to database
    }

    res.json({
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    });
  } catch (error) {
    console.error("Error processing subscription:", error);
    res.status(500).json({
      success: false,
      error:
        error.message || "An error occurred while processing your subscription",
    });
  }
});

// Send newsletter to all subscribers (unchanged)
router.post("/send", async (req, res) => {
  try {
    const { subject, html, text, newsletter_id } = req.body;

    if (!subject || (!html && !text)) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: subject, and html or text",
      });
    }

    const { data: subscribers, error: subError } = await supabaseAdmin
      .from("subscribers")
      .select("email")
      .eq("status", "active");

    console.log("Fetched subscribers:", subscribers);

    if (subError) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch subscribers",
      });
    }

    let sentCount = 0;
    let failedCount = 0;
    let failedEmails = [];

    for (const sub of subscribers) {
      try {
        await sendEmail({ to: sub.email, subject, html, text });
        sentCount++;
      } catch (err) {
        failedCount++;
        failedEmails.push(sub.email);
      }
    }

    if (newsletter_id) {
      await supabaseAdmin
        .from("newsletters")
        .update({
          sent_at: new Date().toISOString(),
          recipient_count: sentCount,
        })
        .eq("id", newsletter_id);
    }

    res.json({
      success: true,
      sentCount,
      failedCount,
      failedEmails,
      message: `Newsletter sent to ${sentCount} subscribers.${
        failedCount ? ` Failed for ${failedCount}.` : ""
      }`,
    });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
