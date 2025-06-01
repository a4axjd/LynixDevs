
const express = require('express');
const { supabase, supabaseAdmin } = require('../config/supabase');
const emailAutomationService = require('../services/emailAutomationService');
const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, first_name, last_name } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    console.log('Processing newsletter subscription:', { email, first_name, last_name });

    // Use service role client for admin operations to bypass RLS
    const client = supabaseAdmin || supabase;

    // Check if email already exists
    const { data: existingSubscriber } = await client
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.subscribed) {
        return res.status(200).json({
          success: true,
          message: 'Already subscribed to newsletter'
        });
      } else {
        // Reactivate subscription
        const { error: updateError } = await client
          .from('subscribers')
          .update({
            subscribed: true,
            status: 'active',
            first_name: first_name || existingSubscriber.first_name,
            last_name: last_name || existingSubscriber.last_name,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id);

        if (updateError) throw updateError;

        console.log('Newsletter subscription reactivated:', existingSubscriber.id);
      }
    } else {
      // Create new subscriber
      const { data: newSubscriber, error: insertError } = await client
        .from('subscribers')
        .insert({
          email,
          first_name: first_name || null,
          last_name: last_name || null,
          subscribed: true,
          status: 'active'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Database error:', insertError);
        throw new Error('Failed to create subscription');
      }

      console.log('New newsletter subscriber created:', newSubscriber.id);
    }

    // Trigger welcome email automation
    try {
      const welcomeName = first_name || 'Subscriber';
      const automationResult = await emailAutomationService.sendWelcomeEmail(
        email,
        welcomeName
      );

      if (automationResult.success) {
        console.log('Welcome email sent successfully');
      } else {
        console.log('Welcome email failed or no automation rule found:', automationResult.error);
      }
    } catch (automationError) {
      console.error('Error in welcome email automation:', automationError);
      // Don't fail the subscription if email automation fails
    }

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe to newsletter'
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const client = supabaseAdmin || supabase;

    const { error } = await client
      .from('subscribers')
      .update({
        subscribed: false,
        status: 'unsubscribed',
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Error processing newsletter unsubscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unsubscribe from newsletter'
    });
  }
});

module.exports = router;
