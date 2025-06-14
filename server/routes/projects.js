const express = require("express");
const router = express.Router();
const databaseService = require("../config/database");

// Get all projects (public endpoint)
router.get("/public", async (req, res) => {
  try {
    const supabase = databaseService.getClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return res.json([]); // Return empty array instead of throwing to allow graceful handling
    }

    res.json(data || []);
  } catch (error) {
    console.error("Error fetching public projects:", error);
    res.status(500).json({
      error: error.message || "An error occurred while fetching projects",
    });
  }
});

// Get all projects (admin endpoint)
router.get("/", async (req, res) => {
  try {
    const supabase = databaseService.getClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ projects: data || [] });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      error: error.message || "An error occurred while fetching projects",
    });
  }
});

// Get project by ID (public endpoint)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = databaseService.getClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching project: ${error.message}`);
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({
      error: error.message || "An error occurred while fetching the project",
    });
  }
});

module.exports = router;
