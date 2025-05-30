
const express = require('express');
const { supabase } = require('../config/supabase');
const { sendEmail } = require('../config/dynamicEmail');
const router = express.Router();

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Save to database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          subject,
          message,
          submitted_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Send confirmation email to user
    const userEmailHtml = `
      <h2>Thank you for contacting us!</h2>
      <p>Dear ${name},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p><strong>Your message:</strong></p>
      <p>${message}</p>
      <p>Best regards,<br>LynixDevs Team</p>
    `;

    // Send notification email to admin
    const adminEmailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
    `;

    try {
      // Send confirmation to user
      await sendEmail({
        to: email,
        subject: 'Thank you for contacting us',
        html: userEmailHtml,
        text: `Thank you for contacting us, ${name}! We have received your message and will get back to you as soon as possible.`
      });

      // Send notification to admin (you can configure this email in your settings)
      await sendEmail({
        to: 'admin@lynixdevs.us', // You might want to make this configurable
        subject: `New Contact: ${subject}`,
        html: adminEmailHtml,
        text: `New contact form submission from ${name} (${email}): ${message}`,
        replyTo: email
      });

      console.log('Contact form emails sent successfully');
    } catch (emailError) {
      console.error('Error sending contact emails:', emailError);
      // Don't fail the whole request if email fails
    }

    res.json({
      success: true,
      message: 'Contact form submitted successfully',
      submission: data
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form'
    });
  }
});

// Get contact submissions (admin only)
router.get('/submissions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      submissions: data
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact submissions'
    });
  }
});

module.exports = router;
