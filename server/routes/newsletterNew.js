
const express = require('express');
const router = express.Router();
const newsletterService = require('../services/newsletterService');

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await newsletterService.subscribeToNewsletter(email);
    res.json(result);
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'An error occurred while processing your subscription' 
    });
  }
});

// Get all subscribers (admin only)
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await newsletterService.getSubscribers();
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while fetching subscribers' 
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await newsletterService.unsubscribe(email);
    res.json(result);
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'An error occurred while unsubscribing' 
    });
  }
});

module.exports = router;
