const databaseService = require("../config/database");
const { sendEmail } = require("../config/dynamicEmail");

class NewsletterService {
  constructor() {
    this.supabase = databaseService.getAdminClient();
  }

  async subscribeToNewsletter(email) {
    try {
      if (!email || !email.includes("@")) {
        throw new Error("Please provide a valid email address");
      }

      // Check if email is already subscribed
      const { data: existingSubscriber, error: fetchError } =
        await this.supabase
          .from("subscribers")
          .select("*")
          .eq("email", email)
          .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error(`Database error: ${fetchError.message}`);
      }

      if (existingSubscriber) {
        return {
          success: true,
          message: "You're already subscribed to our newsletter!",
        };
      }

      // Add new subscriber to the database
      const { error: insertError } = await this.supabase
        .from("subscribers")
        .insert([
          {
            email,
            subscribed_at: new Date().toISOString(),
            status: "active",
          },
        ]);

      if (insertError) {
        throw new Error(`Database error: ${insertError.message}`);
      }

      // Fetch the welcome newsletter template from email_templates
      let template;
      try {
        const { data: templateData, error: templateError } = await this.supabase
          .from("email_templates")
          .select("*")
          .eq("name", "newsletter_confirmation") // Use the correct name or unique identifier of the template
          .single();

        if (templateError) throw templateError;
        template = templateData;
      } catch (templateFetchError) {
        console.error("Error fetching welcome template:", templateFetchError);
      }

      // Prepare template variables (add more as needed)
      const templateVariables = {
        email,
        unsubscribe_link: `https://lynixdevs.com/unsubscribe?email=${encodeURIComponent(
          email
        )}`,
      };

      let subject, html;

      if (template) {
        subject = template.subject;
        html = template.content;

        // Replace template variables in subject and html
        Object.keys(templateVariables).forEach((key) => {
          const placeholder = `{{${key}}}`;
          subject = subject.replace(
            new RegExp(placeholder, "g"),
            templateVariables[key]
          );
          html = html.replace(
            new RegExp(placeholder, "g"),
            templateVariables[key]
          );
        });
      } else {
        // Fallback to hardcoded template (as before)
        subject = "This is from newsletterService.js";
        html = `
          <h1>This is from newsletterService.js</h1>
          <p>Thank you for subscribing to our newsletter. You'll now receive updates on our latest news, projects, and offers.</p>
          <p>If you didn't subscribe or wish to unsubscribe, please <a href="https://lynixdevs.com/unsubscribe?email=${encodeURIComponent(
            email
          )}">click here</a>.</p>
          <p>Best regards,<br>The LynixDevs Team</p>
        `;
      }

      // Send welcome email
      try {
        await sendEmail({
          to: email,
          subject: subject,
          html: html,
        });

        console.log("Welcome email sent successfully newsletterService");
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Continue execution - don't fail the request just because email failed
      }

      return {
        success: true,
        message: "Thank you for subscribing to our newsletter!",
      };
    } catch (error) {
      console.error("Error processing subscription:", error);
      throw error;
    }
  }

  async getSubscribers() {
    try {
      const { data, error } = await this.supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      throw error;
    }
  }

  async unsubscribe(email) {
    try {
      const { data, error } = await this.supabase
        .from("subscribers")
        .update({ status: "unsubscribed", subscribed: false })
        .eq("email", email)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "You have been unsubscribed successfully.",
      };
    } catch (error) {
      console.error("Error unsubscribing:", error);
      throw error;
    }
  }
}

module.exports = new NewsletterService();
