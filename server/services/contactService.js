
const databaseService = require('../config/database');
const { sendEmail } = require('../config/dynamicEmail');

class ContactService {
  constructor() {
    this.supabase = databaseService.getAdminClient();
  }

  async submitContactForm(contactData) {
    const { name, email, subject, message } = contactData;

    try {
      // Validate required fields
      if (!name || !email || !subject || !message) {
        throw new Error('Please fill in all required fields.');
      }

      // Insert contact submission into database
      const { data, error } = await this.supabase
        .from('contact_submissions')
        .insert([
          { 
            name,
            email,
            subject,
            message,
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      // Send confirmation email to the user
      try {
        const confirmationHtml = `
          <h1>Thank you for contacting us, ${name}!</h1>
          <p>We have received your message regarding "${subject}" and will get back to you as soon as possible.</p>
          <p>Here's a copy of your message:</p>
          <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 10px;">
            ${message.replace(/\n/g, "<br>")}
          </blockquote>
          <p>Best regards,<br>The LynixDevs Team</p>
        `;

        await sendEmail({
          to: email,
          subject: "We've received your message",
          html: confirmationHtml,
          replyTo: "info@lynixdevs.com",
        });

        console.log('Confirmation email sent successfully');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Continue execution - don't fail the request just because email failed
      }

      // Send notification email to admin
      try {
        const adminEmailHtml = `
          <h1>New Contact Form Submission</h1>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 10px;">
            ${message.replace(/\n/g, "<br>")}
          </blockquote>
          <p>You can reply directly to this email to respond to the customer.</p>
        `;

        await sendEmail({
          to: "info@lynixdevs.com",
          subject: `New Contact: ${subject}`,
          html: adminEmailHtml,
          replyTo: email,
        });

        console.log('Admin notification email sent successfully');
      } catch (adminEmailError) {
        console.error('Error sending admin notification email:', adminEmailError);
      }

      return {
        success: true,
        message: "Thank you for your message. We'll get back to you soon!",
        data: data
      };
    } catch (error) {
      console.error('Error processing contact submission:', error);
      throw error;
    }
  }

  async getContactSubmissions() {
    try {
      const { data, error } = await this.supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      throw error;
    }
  }

  async markAsRead(submissionId) {
    try {
      const { data, error } = await this.supabase
        .from('contact_submissions')
        .update({ read: true })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error marking submission as read:', error);
      throw error;
    }
  }
}

module.exports = new ContactService();
