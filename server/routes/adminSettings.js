
const express = require('express');
const { supabase } = require('../config/supabase');
const { clearTransporterCache } = require('../config/dynamicEmail');
const nodemailer = require('nodemailer');
const router = express.Router();

// Get admin settings
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Return default settings if none exist
    const defaultSettings = {
      email_verification_expiry_hours: 24,
      password_reset_expiry_hours: 1,
      session_timeout_hours: 168, // 7 days
      max_login_attempts: 5,
      account_lockout_duration_minutes: 30,
      smtp_host: '',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      smtp_use_tls: true,
      from_email: 'noreply@lynixdevs.us',
      from_name: 'LynixDevs',
      maintenance_mode: false,
      user_registration_enabled: true,
      email_notifications_enabled: true,
      newsletter_enabled: true,
      contact_form_enabled: true,
      file_upload_max_size_mb: 10,
      allowed_file_types: 'jpg,jpeg,png,gif,pdf,doc,docx,txt',
    };

    res.json({
      success: true,
      settings: data || defaultSettings
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch admin settings'
    });
  }
});

// Update admin settings
router.put('/', async (req, res) => {
  try {
    const settings = req.body;

    // Validate required fields
    if (!settings.email_verification_expiry_hours || !settings.password_reset_expiry_hours) {
      return res.status(400).json({
        success: false,
        error: 'Required fields missing'
      });
    }

    // Add updated_at timestamp
    settings.updated_at = new Date().toISOString();

    // First check if any settings exist
    const { data: existingData } = await supabase
      .from('admin_settings')
      .select('id')
      .single();

    let result;
    if (existingData) {
      // Update existing settings
      const { data, error } = await supabase
        .from('admin_settings')
        .update(settings)
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('admin_settings')
        .insert(settings)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    // Clear email transporter cache when SMTP settings are updated
    clearTransporterCache();

    res.json({
      success: true,
      settings: result
    });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update admin settings'
    });
  }
});

// Test SMTP connection
router.post('/test-smtp', async (req, res) => {
  try {
    const { smtp_host, smtp_port, smtp_username, smtp_password, smtp_use_tls, from_email } = req.body;
    
    if (!smtp_host || !smtp_port || !smtp_username) {
      return res.status(400).json({
        success: false,
        error: 'SMTP configuration incomplete'
      });
    }

    // Create test transporter with correct nodemailer syntax
    const testTransporter = nodemailer.createTransport({
      host: smtp_host,
      port: parseInt(smtp_port),
      secure: parseInt(smtp_port) === 465,
      auth: {
        user: smtp_username,
        pass: smtp_password,
      },
      tls: smtp_use_tls ? {
        rejectUnauthorized: false
      } : undefined
    });

    // Verify connection
    await testTransporter.verify();

    res.json({
      success: true,
      message: 'SMTP connection test successful'
    });

  } catch (error) {
    console.error('Error testing SMTP:', error);
    res.status(500).json({
      success: false,
      error: `SMTP connection test failed: ${error.message}`
    });
  }
});

module.exports = router;
