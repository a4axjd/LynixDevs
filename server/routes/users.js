
const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while fetching users' 
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while fetching user' 
    });
  }
});

// Make user admin
router.post('/:id/make-admin', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.makeUserAdmin(id);
    res.json(result);
  } catch (error) {
    console.error('Error making user admin:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while making user admin' 
    });
  }
});

module.exports = router;
