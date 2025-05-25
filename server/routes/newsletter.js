
const express = require('express');
const { supabase } = require('../config/supabase');
const { sendEmail } = require('../config/email');

const router = express.Router();

// Newsletter subscription
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('Newsletter subscription request received for:', email);

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Check if email is already subscribed
    console.log('Checking if email is already subscribed...');
    const { data: existingSubscriber, error: fetchError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing subscriber:', fetchError);
      throw new Error(`Database error: ${fetchError.message}`);
    }

    if (existingSubscriber) {
      console.log('Email is already subscribed');
      return res.json({
        success: true,
        message: "You're already subscribed to our newsletter!"
      });
    }

    // Add new subscriber to the database
    console.log('Adding new subscriber to database...');
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert([{
        email,
        subscribed_at: new Date().toISOString(),
        status: 'active'
      }]);

    if (insertError) {
      console.error('Error inserting new subscriber:', insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    // Send welcome email
    try {
      const welcomeHtml = `
        <h1>Welcome to LynixDevs Newsletter!</h1>
        <p>Thank you for subscribing to our newsletter. You'll now receive updates on our latest news, projects, and offers.</p>
        <p>If you didn't subscribe or wish to unsubscribe, please <a href="https://lynixdevs.com/unsubscribe?email=${encodeURIComponent(email)}">click here</a>.</p>
        <p>Best regards,<br>The LynixDevs Team</p>
      `;

      await sendEmail({
        to: email,
        subject: "Welcome to LynixDevs Newsletter!",
        html: welcomeHtml,
      });

      console.log('Welcome email sent successfully');
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue execution - we've saved the subscription to database
    }

    res.json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    });

  } catch (error) {
    console.error('Error processing subscription:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your subscription'
    });
  }
});

module.exports = router;
