
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase configuration
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const contactData: ContactPayload = await req.json();
    console.log("Received contact submission:", contactData);

    // Validate payload
    const { name, email, subject = "Contact Form Submission", message, phone = "" } = contactData;
    
    if (!name || !email || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Insert into database
    console.log("Inserting contact submission into database...");
    const { error: insertError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        message,
        subject,
        phone,
      });

    if (insertError) {
      console.error("Database error:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }
    
    console.log("Contact submission saved successfully");

    // Send confirmation email to user
    try {
      // Prepare confirmation email
      const confirmationHtml = `
        <h1>Thank you for contacting us, ${name}!</h1>
        <p>We have received your message regarding "${subject}" and will get back to you soon.</p>
        <p>Here's a copy of your message:</p>
        <blockquote>${message}</blockquote>
        <p>Best regards,<br>The LynixDevs Team</p>
      `;

      // Call the send-email function
      const emailResponse = await supabase.functions.invoke("send-email", {
        body: {
          to: email,
          subject: "We've received your message - LynixDevs",
          html: confirmationHtml,
        },
      });

      if (emailResponse.error) {
        console.error("Error sending confirmation email:", emailResponse.error);
        // Continue execution - don't fail the request just because email failed
      } else {
        console.log("Confirmation email sent successfully");
      }

      // Notify admin about new contact submission
      const adminHtml = `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote>${message}</blockquote>
      `;

      const adminEmailResponse = await supabase.functions.invoke("send-email", {
        body: {
          to: "admin@lynixdevs.com", // Change to your admin email
          subject: `New Contact: ${subject}`,
          html: adminHtml,
          replyTo: email,
          name: name,
        },
      });

      if (adminEmailResponse.error) {
        console.error("Error sending admin notification email:", adminEmailResponse.error);
        // Continue execution - don't fail the request just because email failed
      } else {
        console.log("Admin notification email sent successfully");
      }
    } catch (emailError) {
      console.error("Error in email sending process:", emailError);
      // Continue execution - we've saved the contact submission to database
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Thank you for your message. We'll get back to you soon!" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing contact submission:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred while processing your request",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
