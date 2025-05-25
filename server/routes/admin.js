
const express = require('express');
const { supabase, supabaseAdmin } = require('../config/supabase');

const router = express.Router();

// Middleware to verify authentication
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No Authorization header provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
  try {
    const { data: isAdmin, error } = await supabase.rpc('has_role', {
      _user_id: req.user.id,
      _role: 'admin',
    });

    if (error || !isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(403).json({ error: 'Admin privileges required' });
  }
};

// Get users (admin only)
router.get('/users', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    if (!supabaseAdmin) {
      throw new Error('Service role key not configured');
    }

    // Fetch users using admin client
    const response = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/admin/users`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch users: ${response.statusText} (${errorText})`);
    }

    const users = await response.json();

    // Check admin status for each user
    for (const user of users) {
      const { data, error } = await supabaseAdmin.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });

      if (error) {
        console.warn(`Error checking admin status for user ${user.id}:`, error.message);
      }

      user.isAdmin = !!data;
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
