const { supabase, supabaseAdmin } = require("../config/supabase");
const { sendEmail } = require("../config/dynamicEmail");

class EmailAutomationService {
  constructor() {
    this.client = supabaseAdmin || supabase;
  }

  // Trigger automation based on event
  async triggerAutomation(
    eventType,
    recipientEmail,
    templateVariables = {},
    userId = null
  ) {
    try {
      console.log(`Triggering automation for event: ${eventType}`);

      // Find active automation rule for this event
      const { data: rules, error: rulesError } = await this.client
        .from("email_automation_rules")
        .select("*, email_templates(*)")
        .eq("event_type", eventType)
        .eq("is_active", true)
        .limit(1);

      if (rulesError) {
        console.error("Error fetching automation rules:", rulesError);
        return { success: false, error: rulesError.message };
      }

      if (!rules || rules.length === 0) {
        console.log(`No active automation rule found for event: ${eventType}`);
        return {
          success: false,
          error: `No automation rule found for event: ${eventType}`,
        };
      }

      const rule = rules[0];
      const template = rule.email_templates;

      if (!template) {
        return {
          success: false,
          error: "Template not found for automation rule",
        };
      }

      // Create automation job
      const jobResult = await this.createAutomationJob(
        rule.id,
        recipientEmail,
        templateVariables,
        userId
      );

      if (!jobResult.success) {
        return jobResult;
      }

      // Process and send email
      const emailResult = await this.processAndSendEmail(
        jobResult.job,
        template,
        templateVariables
      );

      return emailResult;
    } catch (error) {
      console.error("Error in email automation trigger:", error);
      return { success: false, error: error.message };
    }
  }

  // Create automation job record
  async createAutomationJob(ruleId, recipientEmail, templateVariables, userId) {
    try {
      const { data: job, error } = await this.client
        .from("email_automation_jobs")
        .insert({
          rule_id: ruleId,
          recipient_email: recipientEmail,
          template_variables: templateVariables,
          status: "pending",
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating automation job:", error);
        return { success: false, error: error.message };
      }

      return { success: true, job };
    } catch (error) {
      console.error("Error creating automation job:", error);
      return { success: false, error: error.message };
    }
  }

  // Process template and send email
  async processAndSendEmail(job, template, templateVariables) {
    try {
      // Process template variables
      let subject = this.processTemplate(template.subject, templateVariables);
      let content = this.processTemplate(template.content, templateVariables);

      // Send email
      await sendEmail({
        to: job.recipient_email,
        subject: subject,
        html: content,
        text: content.replace(/<[^>]*>/g, ""), // Strip HTML for text version
      });

      // Update job status to completed
      await this.client
        .from("email_automation_jobs")
        .update({
          status: "completed",
          sent_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", job.id);

      console.log("Automated email sent successfully:", {
        job_id: job.id,
        recipient: job.recipient_email,
      });

      return {
        success: true,
        message: "Email sent successfully",
        job_id: job.id,
      };
    } catch (error) {
      console.error("Error sending automated email:", error);

      // Update job status to failed
      await this.client
        .from("email_automation_jobs")
        .update({
          status: "failed",
          error_message: error.message,
        })
        .eq("id", job.id);

      return { success: false, error: error.message };
    }
  }

  // Process template with variables
  processTemplate(template, variables) {
    let processed = template;

    Object.keys(variables).forEach((key) => {
      const placeholder = new RegExp(`{{${key}}}`, "g");
      processed = processed.replace(placeholder, variables[key] || "");
    });

    return processed;
  }

  // Helper methods for common automation events
  async sendWelcomeEmail(userEmail, userName) {
    return await this.triggerAutomation("user_welcome", userEmail, {
      user_name: userName,
      site_url: process.env.SITE_URL,
    });
  }

  async sendProjectUpdateEmail(
    clientEmail,
    projectTitle,
    updateDetails,
    clientName
  ) {
    return await this.triggerAutomation("project_update", clientEmail, {
      client_name: clientName,
      project_title: projectTitle,
      update_details: updateDetails,
      site_url: process.env.SITE_URL,
    });
  }

  async sendContactFormAutoReply(userEmail, userName, originalMessage) {
    return await this.triggerAutomation("contact_form_reply", userEmail, {
      user_name: userName,
      original_message: originalMessage,
      company_name: "LynixDevs",
      site_url: process.env.SITE_URL || "https://lynixdevs.us",
    });
  }

  // Helper method: Send auto-reply to the user after project inquiry submission
  async sendProjectInquiryAutoReply(userEmail, userName, projectTitle) {
    return await this.triggerAutomation("project_inquiry_reply", userEmail, {
      user_name: userName,
      project_title: projectTitle,
      company_name: "LynixDevs",
      site_url: process.env.SITE_URL,
    });
  }

  // Helper method: Notify admin/team about a new project inquiry
  async sendProjectInquiryAdminNotification(
    adminEmail,
    userName,
    userEmailValue,
    projectTitle
  ) {
    return await this.triggerAutomation("project_inquiry_admin", adminEmail, {
      user_name: userName,
      user_email: userEmailValue,
      project_title: projectTitle,
      company_name: "LynixDevs",
      site_url: process.env.SITE_URL,
    });
  }

  // Get automation statistics
  async getAutomationStats() {
    try {
      const { data: stats, error } = await this.client
        .from("email_automation_jobs")
        .select("status")
        .gte(
          "created_at",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        ); // Last 30 days

      if (error) throw error;

      const summary = {
        total: stats.length,
        completed: stats.filter((s) => s.status === "completed").length,
        failed: stats.filter((s) => s.status === "failed").length,
        pending: stats.filter((s) => s.status === "pending").length,
      };

      return { success: true, stats: summary };
    } catch (error) {
      console.error("Error fetching automation stats:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailAutomationService();
