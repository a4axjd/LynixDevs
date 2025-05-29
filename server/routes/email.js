
const express = require('express');
const { sendEmail, clearTransporterCache } = require('../config/dynamicEmail');
const { supabase } = require('../config/supabase');
const router = express.Router();

// Send email endpoint
router.post('/send', async (req, res) => {
  try {
    const { to, subject, html, text, template_id } = req.body;

    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, and html or text'
      });
    }

    const result = await sendEmail({ to, subject, html, text });

    // Log email event if template_id is provided
    if (template_id) {
      await supabase.from('email_events').insert({
        template_id,
        recipient_email: to,
        subject,
        status: 'sent',
        sent_at: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      messageId: result.messageId,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Log failed email event if template_id is provided
    if (req.body.template_id) {
      await supabase.from('email_events').insert({
        template_id: req.body.template_id,
        recipient_email: req.body.to,
        subject: req.body.subject,
        status: 'failed',
        error_message: error.message,
        sent_at: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear email cache (useful when SMTP settings are updated)
router.post('/clear-cache', async (req, res) => {
  try {
    clearTransporterCache();
    res.json({
      success: true,
      message: 'Email transporter cache cleared'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache'
    });
  }
});

module.exports = router;
