const express = require("express");
const router = express.Router();
const { supabase, supabaseAdmin } = require("../config/supabase");

// GET all client projects with joined info
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("client_projects")
      .select(
        "*, profiles:profiles!client_user_id(full_name), projects(title, description)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    // Map to expected keys for frontend
    const mapped = (data || []).map((item) => ({
      ...item,
      project_info: item.projects,
      client_profile: item.profiles,
    }));

    res.json({ projects: mapped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.log("[POST /api/clientProjects] Creating:", data);
    const { error, data: created } = await supabaseAdmin
      .from("client_projects")
      .insert(data)
      .select()
      .single();
    if (error) {
      console.error("[POST /api/clientProjects] Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }
    console.log("[POST /api/clientProjects] Created:", created);
    res.json({ project: created });
  } catch (err) {
    console.error("[POST /api/clientProjects] Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error." });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(
      "[PUT /api/clientProjects] Updating id:",
      id,
      "with:",
      updateData
    );
    const { error, data } = await supabaseAdmin
      .from("client_projects")
      .update(updateData)
      .eq("id", id)
      .select("*, profiles:profiles!client_user_id(full_name), projects(title)")
      .single();
    if (error) {
      console.error("[PUT /api/clientProjects] Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }
    console.log("[PUT /api/clientProjects] Updated:", data);
    res.json({ project: data });
  } catch (err) {
    console.error("[PUT /api/clientProjects] Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error." });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("[DELETE /api/clientProjects] Deleting id:", id);
    const { error } = await supabaseAdmin
      .from("client_projects")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("[DELETE /api/clientProjects] Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }
    console.log("[DELETE /api/clientProjects] Deleted id:", id);
    res.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/clientProjects] Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error." });
  }
});

module.exports = router;
