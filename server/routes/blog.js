
const express = require('express');
const router = express.Router();
const databaseService = require('../config/database');

// Get all published blog posts (public endpoint)
router.get('/published', async (req, res) => {
  try {
    const supabase = databaseService.getClient();
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching blog posts: ${error.message}`);
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while fetching blog posts' 
    });
  }
});

// Get blog post by slug (public endpoint)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const supabase = databaseService.getClient();
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      throw new Error(`Error fetching blog post: ${error.message}`);
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while fetching the blog post' 
    });
  }
});

module.exports = router;
