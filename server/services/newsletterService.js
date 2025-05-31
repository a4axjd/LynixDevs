
const databaseService = require('../config/database');
const { sendEmail } = require('../config/dynamicEmail');

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
      const { data: existingSubscriber, error: fetchError } = await this.supabase
        .from("subscribers")
        .select("*")
        .eq("email", email)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") { 
        // PGRST116 means no rows returned, which is expected if the email isn't subscribed yet
        throw new Error(`Database error: ${fetchError.message}`);
      }

      if (existingSubscriber) {
        return {
          success: true,
          message: "You're already subscribed to our newsletter!"
        };
      }

      // Add new subscriber to the database
      const { error: insertError } = await this.supabase
        .from("subscribers")
        .insert([
          { 
            email,
            subscribed_at: new Date().toISOString(),
            status: "active"
          }
        ]);

      if (insertError) {
        throw new Error(`Database error: ${insertError.message}`);
      }

      // Send welcome email
      try {
        const welcomeHtml = `
          <h1>Welcome to LynixDevs Newsletter!</h1>
          <p>Thank you for subscribing to our newsletter. You'll now receive updates on our latest news, projects, and offers.</p>
          <p>If you didn't subscribe or wish to unsubscribe, please <a href="https://lynixdevs.com/unsubscribe?email=${encodeURIComponent(email)}">click here</a>.</p>
          <p>Best regards,<br>The LynixDevs Team</p>
        `;

        await sendEmail({
          to: email,
          subject: "Welcome to LynixDevs Newsletter!",
          html: welcomeHtml,
        });

        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Continue execution - don't fail the request just because email failed
      }

      return {
        success: true,
        message: "Thank you for subscribing to our newsletter!"
      };
    } catch (error) {
      console.error('Error processing subscription:', error);
      throw error;
    }
  }

  async getSubscribers() {
    try {
      const { data, error } = await this.supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      throw error;
    }
  }

  async unsubscribe(email) {
    try {
      const { data, error } = await this.supabase
        .from('subscribers')
        .update({ status: 'unsubscribed', subscribed: false })
        .eq('email', email)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "You have been unsubscribed successfully."
      };
    } catch (error) {
      console.error('Error unsubscribing:', error);
      throw error;
    }
  }
}

module.exports = new NewsletterService();
