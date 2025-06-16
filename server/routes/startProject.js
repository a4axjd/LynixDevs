const express = require("express");
const multer = require("multer");
const path = require("path");
const { supabase, supabaseAdmin } = require("../config/supabase");
const emailAutomationService = require("../services/emailAutomationService");
const router = express.Router();

// Multer config for file uploads (in-memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

// Helper: Upload file buffer to Supabase Storage and return the public URL
async function uploadFileToSupabase(file, inquiryId) {
  const ext = path.extname(file.originalname);
  const filename = `${inquiryId}/${Date.now()}-${file.originalname}`;
  const { data, error } = await supabaseAdmin.storage
    .from("project-inquiries")
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  if (error) throw error;
  // Get public URL
  const { data: publicUrlData } = supabaseAdmin.storage
    .from("project-inquiries")
    .getPublicUrl(filename);
  return publicUrlData.publicUrl;
}

// POST /api/start-project
router.post("/", upload.array("files", 10), async (req, res) => {
  try {
    const {
      name,
      email,
      title,
      description,
      goals,
      timeline,
      budget,
      phone,
      company,
      audience,
      competitors,
      references, // <-- plural
    } = req.body;

    // Validate required fields
    if (!name || !email || !title || !description) {
      return res.status(400).json({
        success: false,
        error: "Name, email, title, and description are required.",
      });
    }

    // Insert a new inquiry (without files first, get the ID)
    const client = supabaseAdmin || supabase;
    const { data: submission, error: dbError } = await client
      .from("project_inquiries")
      .insert({
        name,
        email,
        title,
        description,
        goals,
        timeline,
        budget,
        phone,
        company,
        audience,
        competitors,
        references,
        status: "new",
        read: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save project inquiry");
    }

    // Handle file uploads (if any)
    let filesUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const url = await uploadFileToSupabase(file, submission.id);
          filesUrls.push(url);
        } catch (fileError) {
          console.error("File upload error:", fileError);
        }
      }
      // Update row with file URLs
      await client
        .from("project_inquiries")
        .update({ files: filesUrls })
        .eq("id", submission.id);
    }

    // Email automation: to user (auto-reply)
    try {
      await emailAutomationService.sendProjectInquiryAutoReply(
        email,
        name,
        title
      );
    } catch (automationError) {
      console.error("Error in user email automation:", automationError);
    }

    // Email automation: to admin/notification (include file links as HTML)
    try {
      // Format file URLs as HTML links for admin template
      const filesHtml =
        filesUrls.length > 0
          ? filesUrls.map((url) => `<a href="${url}">${url}</a>`).join("<br>")
          : "";

      await emailAutomationService.sendProjectInquiryAdminNotification(
        process.env.ADMIN_EMAIL, // Set this in your .env
        name,
        email,
        title,
        filesHtml
      );
    } catch (adminAutomationError) {
      console.error("Error in admin email automation:", adminAutomationError);
    }

    res.json({
      success: true,
      message: "Project inquiry submitted successfully",
      inquiry_id: submission.id,
      files: filesUrls,
    });
  } catch (error) {
    console.error("Error processing start project form:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit project inquiry",
    });
  }
});

// --- ADMIN: GET /api/admin/start-projects ---
// Returns all project inquiries for the admin dashboard
router.get("/admin/list", async (req, res) => {
  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from("project_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // If files are stored as JSON string, parse them
    const result = data.map((inq) => ({
      ...inq,
      files:
        typeof inq.files === "string"
          ? JSON.parse(inq.files)
          : Array.isArray(inq.files)
          ? inq.files
          : [],
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching admin project inquiries:", err);
    res.status(500).json({ error: "Failed to fetch project inquiries" });
  }
});

module.exports = router;
