
const express = require('express');
const { sendEmail } = require('../config/email');

const router = express.Router();

// Send email endpoint
router.post('/send', async (req, res) => {
  try {
    const { to, subject, html, replyTo, name } = req.body;

    // Validate required fields
    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        error: 'Missing required email fields (to, subject, html)'
      });
    }

    console.log('Sending email to:', to);

    const result = await sendEmail({
      to,
      subject,
      html,
      replyTo,
      name
    });

    console.log('Email sent successfully:', result);

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId || result.id
    });

  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
});

module.exports = router;
