const express = require("express");
const router = express.Router();
const { supabaseAdmin } = require("../config/supabase");

// GET /api/admin/start-projects
router.get("/", async (req, res) => {
  try {
    // Optional: Add admin authentication here!
    const { data, error } = await supabaseAdmin
      .from("project_inquiries")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    // If files are stored as JSON string, parse them
    const result = data.map((inq) => ({
      ...inq,
      files: typeof inq.files === "string" ? JSON.parse(inq.files) : inq.files,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch project inquiries" });
  }
});

module.exports = router;
