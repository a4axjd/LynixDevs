
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
    // Get Supabase configuration from environment
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    // Validate Supabase configuration
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const contactData: ContactPayload = await req.json();
    const { name, email, subject = "Contact Form Submission", message, phone = "" } = contactData;

    console.log("Received contact submission:", { name, email, subject, phone });

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Insert contact submission into database
    const { error: insertError } = await supabase
      .from("contact_submissions")
      .insert({ name, email, message, subject, phone });

    if (insertError) {
      console.error("Database error:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log("Contact submission saved to database");

    // Send confirmation email
    try {
      const emailResponse = await fetch(
        `${supabaseUrl}/functions/v1/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            to: email,
            subject: "We've Received Your Message",
            html: `
              <h1>Thank You for Contacting LynixDevs!</h1>
              <p>Hello ${name},</p>
              <p>We've received your message and appreciate you taking the time to reach out to us. Our team will review your inquiry and get back to you as soon as possible.</p>
              <p>For your reference, here's a copy of your message:</p>
              <blockquote>${message}</blockquote>
              <p>Best regards,<br>The LynixDevs Team</p>
            `,
            replyTo: "info@lynixdevs.com",
            name: "LynixDevs Support"
          }),
        }
      );

      const responseText = await emailResponse.text();
      if (!emailResponse.ok) {
        console.error("Error sending confirmation email. Status:", emailResponse.status, "Response:", responseText);
        // Continue execution even if confirmation email fails
      } else {
        console.log("Confirmation email sent successfully");
      }
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Continue execution even if confirmation email fails
    }

    // Send notification to admin
    try {
      const adminEmailResponse = await fetch(
        `${supabaseUrl}/functions/v1/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            to: "info@lynixdevs.com", // Admin email
            subject: "New Contact Form Submission",
            html: `
              <h1>New Contact Form Submission</h1>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            `,
            replyTo: email,
            name: name
          }),
        }
      );

      const adminResponseText = await adminEmailResponse.text();
      if (!adminEmailResponse.ok) {
        console.error("Error sending admin notification. Status:", adminEmailResponse.status, "Response:", adminResponseText);
        // Continue execution even if admin email fails
      } else {
        console.log("Admin notification email sent successfully");
      }
    } catch (adminEmailError) {
      console.error("Error sending admin notification:", adminEmailError);
      // Continue execution even if admin email fails
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
