
const express = require('express');
const router = express.Router();
const databaseService = require('../config/database');

// Get admin dashboard counts
router.get('/counts', async (req, res) => {
  try {
    const supabaseAdmin = databaseService.getAdminClient();
    
    const { data, error } = await supabaseAdmin.rpc('get_admin_counts');
    
    if (error) {
      throw new Error(`Error fetching admin counts: ${error.message}`);
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching admin counts:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while fetching admin counts' 
    });
  }
});

module.exports = router;
