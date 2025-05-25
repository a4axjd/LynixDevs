
const express = require('express');
const { supabase } = require('../config/supabase');
const { sendEmail } = require('../config/email');

const router = express.Router();

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log('Received contact submission:', { name, email, subject, message });

    // Validate form data
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields.'
      });
    }

    // Insert contact submission into database
    console.log('Inserting contact submission into database...');
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{
        name,
        email,
        subject,
        message,
      }]);

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    // Send confirmation email to the user
    try {
      console.log('Sending confirmation email...');

      const emailHtml = `
        <h1>Thank you for contacting us, ${name}!</h1>
        <p>We have received your message regarding "${subject}" and will get back to you as soon as possible.</p>
        <p>Here's a copy of your message:</p>
        <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 10px;">
          ${message.replace(/\n/g, "<br>")}
        </blockquote>
        <p>Best regards,<br>The LynixDevs Team</p>
      `;

      await sendEmail({
        to: email,
        subject: "We've received your message",
        html: emailHtml,
        replyTo: "info@lynixdevs.com",
        name: name
      });

      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue execution - don't fail the request just because email failed
    }

    // Send notification email to admin
    try {
      console.log('Sending notification email to admin...');

      const adminEmailHtml = `
        <h1>New Contact Form Submission</h1>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 10px;">
          ${message.replace(/\n/g, "<br>")}
        </blockquote>
        <p>You can reply directly to this email to respond to the customer.</p>
      `;

      await sendEmail({
        to: "info@lynixdevs.com",
        subject: `New Contact: ${subject}`,
        html: adminEmailHtml,
        replyTo: email,
        name: name
      });

      console.log('Admin notification email sent successfully');
    } catch (adminEmailError) {
      console.error('Error sending admin notification email:', adminEmailError);
    }

    res.json({
      success: true,
      message: "Thank you for your message. We'll get back to you soon!"
    });

  } catch (error) {
    console.error('Error processing contact submission:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your submission'
    });
  }
});

module.exports = router;
