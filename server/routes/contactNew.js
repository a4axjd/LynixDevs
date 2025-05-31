
const express = require('express');
const router = express.Router();
const contactService = require('../services/contactService');

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const result = await contactService.submitContactForm({
      name,
      email,
      subject,
      message
    });
    res.json(result);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'An error occurred while processing your submission' 
    });
  }
});

// Get all contact submissions (admin only)
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await contactService.getContactSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while fetching submissions' 
    });
  }
});

// Mark submission as read
router.patch('/submissions/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactService.markAsRead(id);
    res.json(result);
  } catch (error) {
    console.error('Error marking submission as read:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while updating submission' 
    });
  }
});

module.exports = router;
