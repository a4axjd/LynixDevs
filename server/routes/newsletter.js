const express = require("express");
const { supabase, supabaseAdmin } = require("../config/supabase");
const { sendEmail } = require("../config/dynamicEmail");

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

    // Send welcome email
    try {
      const welcomeHtml = `
        <h1>Welcome to LynixDevs Newsletter!</h1>
        <p>Thank you for subscribing to our newsletter. You'll now receive updates on our latest news, projects, and offers.</p>
        <p>If you didn't subscribe or wish to unsubscribe, please <a href="https://lynixdevs.us/unsubscribe?email=${encodeURIComponent(
          email
        )}">click here</a>.</p>
        <p>Best regards,<br>The LynixDevs Team</p>
      `;

      await sendEmail({
        to: email,
        subject: "Welcome to LynixDevs Newsletter!",
        html: welcomeHtml,
      });

      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
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

// Send newsletter to all subscribers
router.post("/send", async (req, res) => {
  try {
    const { subject, html, text, newsletter_id } = req.body;

    if (!subject || (!html && !text)) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: subject, and html or text",
      });
    }

    // Use supabaseAdmin for reading subscribers
    const { data: subscribers, error: subError } = await (
      supabaseAdmin || supabase
    )
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

    // Optionally update the newsletter row as sent
    if (newsletter_id) {
      await (supabaseAdmin || supabase)
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
