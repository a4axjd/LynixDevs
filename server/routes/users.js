
const express = require("express");
const router = express.Router();
const databaseService = require("../config/database");

// GET all users (for admin purposes)
router.get("/", async (req, res) => {
  try {
    const supabaseAdmin = databaseService.getAdminClient();
    
    if (!supabaseAdmin) {
      return res.status(500).json({ error: "Admin client not available" });
    }

    // Get all profiles with user data
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: error.message });
    }

    // Transform to match expected format
    const users = (profiles || []).map(profile => ({
      id: profile.id,
      full_name: profile.full_name || "Unnamed User"
    }));

    res.json({ users });
  } catch (error) {
    console.error("Error in users route:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred while fetching users" 
    });
  }
});

module.exports = router;