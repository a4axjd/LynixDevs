const express = require("express");
const { supabase, supabaseAdmin } = require("../config/supabase");
const { sendEmail } = require("../config/dynamicEmail");
const router = express.Router();

// Get all automation rules
router.get("/rules", async (req, res) => {
  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from("email_automation_rules")
      .select("*, email_templates(*)") // <-- FIXED: join with template!
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      rules: data || [],
    });
  } catch (error) {
    console.error("Error fetching automation rules:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch automation rules",
    });
  }
});

// Create new automation rule
router.post("/rules", async (req, res) => {
  try {
    const {
      event_type,
      template_id,
      is_active = true,
      conditions = {},
    } = req.body;

    if (!event_type || !template_id) {
      return res.status(400).json({
        success: false,
        error: "Event type and template ID are required",
      });
    }

    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from("email_automation_rules")
      .insert({
        event_type,
        template_id,
        is_active,
        conditions,
      })
      .select("*, email_templates(*)")
      .single();

    if (error) throw error;

    res.json({
      success: true,
      rule: data,
    });
  } catch (error) {
    console.error("Error creating automation rule:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create automation rule",
    });
  }
});

// Update automation rule
router.put("/rules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from("email_automation_rules")
      .update(updateData)
      .eq("id", id)
      .select("*, email_templates(*)") // <-- Also join template on update
      .single();

    if (error) throw error;

    res.json({
      success: true,
      rule: data,
    });
  } catch (error) {
    console.error("Error updating automation rule:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update automation rule",
    });
  }
});

// Delete automation rule
router.delete("/rules/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const client = supabaseAdmin || supabase;
    const { error } = await client
      .from("email_automation_rules")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Automation rule deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting automation rule:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete automation rule",
    });
  }
});

// Trigger automated email
router.post("/trigger", async (req, res) => {
  try {
    const {
      event_type,
      recipient_email,
      template_variables = {},
      user_id,
    } = req.body;

    if (!event_type || !recipient_email) {
      return res.status(400).json({
        success: false,
        error: "Event type and recipient email are required",
      });
    }

    console.log("Triggering automated email:", { event_type, recipient_email });

    // Find matching automation rule
    const client = supabaseAdmin || supabase;
    const { data: rules, error: rulesError } = await client
      .from("email_automation_rules")
      .select("*, email_templates(*)")
      .eq("event_type", event_type)
      .eq("is_active", true)
      .limit(1);

    if (rulesError) throw rulesError;

    if (!rules || rules.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No active automation rule found for event: ${event_type}`,
      });
    }

    const rule = rules[0];
    const template = rule.email_templates;

    if (!template) {
      return res.status(404).json({
        success: false,
        error: "Template not found for automation rule",
      });
    }

    // Process template variables
    let subject = template.subject;
    let content = template.content;

    // Replace template variables in subject and content
    Object.keys(template_variables).forEach((key) => {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(
        new RegExp(placeholder, "g"),
        template_variables[key] || ""
      );
      content = content.replace(
        new RegExp(placeholder, "g"),
        template_variables[key] || ""
      );
    });

    // Create email automation job
    const { data: job, error: jobError } = await client
      .from("email_automation_jobs")
      .insert({
        rule_id: rule.id,
        recipient_email,
        template_variables,
        status: "pending",
        user_id,
      })
      .select()
      .single();

    if (jobError) throw jobError;

    try {
      // Send the email
      await sendEmail({
        to: recipient_email,
        subject: subject,
        html: content,
        text: content.replace(/<[^>]*>/g, ""), // Strip HTML for text version
      });

      // Update job status to completed
      await client
        .from("email_automation_jobs")
        .update({
          status: "completed",
          sent_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", job.id);

      console.log("Automated email sent successfully:", {
        job_id: job.id,
        recipient_email,
      });

      res.json({
        success: true,
        message: "Automated email sent successfully",
        job_id: job.id,
      });
    } catch (emailError) {
      console.error("Error sending automated email:", emailError);

      // Update job status to failed
      await client
        .from("email_automation_jobs")
        .update({
          status: "failed",
          error_message: emailError.message,
        })
        .eq("id", job.id);

      throw emailError;
    }
  } catch (error) {
    console.error("Error in email automation trigger:", error);
    res.status(500).json({
      success: false,
      error: "Failed to trigger automated email",
    });
  }
});

// Get automation jobs with pagination
router.get("/jobs", async (req, res) => {
  try {
    const { page = 1, limit = 20, status, rule_id } = req.query;
    const offset = (page - 1) * limit;

    const client = supabaseAdmin || supabase;
    let query = client
      .from("email_automation_jobs")
      .select(
        `
        *,
        email_automation_rules (
          event_type,
          email_templates (
            name,
            subject
          )
        )
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (rule_id) {
      query = query.eq("rule_id", rule_id);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      jobs: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
      },
    });
  } catch (error) {
    console.error("Error fetching automation jobs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch automation jobs",
    });
  }
});

// Retry failed job
router.post("/jobs/:id/retry", async (req, res) => {
  try {
    const { id } = req.params;

    const client = supabaseAdmin || supabase;

    // Get the job details
    const { data: job, error: jobError } = await client
      .from("email_automation_jobs")
      .select(
        `
        *,
        email_automation_rules (
          *,
          email_templates (*)
        )
      `
      )
      .eq("id", id)
      .single();

    if (jobError) throw jobError;

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    if (job.status !== "failed") {
      return res.status(400).json({
        success: false,
        error: "Only failed jobs can be retried",
      });
    }

    const template = job.email_automation_rules.email_templates;
    const template_variables = job.template_variables || {};

    // Process template variables
    let subject = template.subject;
    let content = template.content;

    Object.keys(template_variables).forEach((key) => {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(
        new RegExp(placeholder, "g"),
        template_variables[key] || ""
      );
      content = content.replace(
        new RegExp(placeholder, "g"),
        template_variables[key] || ""
      );
    });

    try {
      // Retry sending the email
      await sendEmail({
        to: job.recipient_email,
        subject: subject,
        html: content,
        text: content.replace(/<[^>]*>/g, ""),
      });

      // Update job status to completed
      await client
        .from("email_automation_jobs")
        .update({
          status: "completed",
          sent_at: new Date().toISOString(),
          error_message: null,
          retry_count: (job.retry_count || 0) + 1,
        })
        .eq("id", id);

      res.json({
        success: true,
        message: "Email retry successful",
      });
    } catch (emailError) {
      // Update retry count and error message
      await client
        .from("email_automation_jobs")
        .update({
          error_message: emailError.message,
          retry_count: (job.retry_count || 0) + 1,
        })
        .eq("id", id);

      throw emailError;
    }
  } catch (error) {
    console.error("Error retrying email job:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retry email job",
    });
  }
});

module.exports = router;
