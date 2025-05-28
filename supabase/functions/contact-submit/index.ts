
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase configuration
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const { name, email, subject, message } = await req.json();
    console.log("Received contact submission:", { name, email, subject, message });

    // Validate form data
    if (!name || !email || !subject || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Please fill in all required fields." 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get default email sender from database
    console.log("Fetching default email sender...");
    const { data: defaultSender, error: senderError } = await supabase
      .from("email_senders")
      .select("email, name")
      .eq("is_default", true)
      .single();

    if (senderError) {
      console.error("Error fetching default sender:", senderError);
    }

    // Use default sender or fallback
    const senderEmail = defaultSender?.email || "noreply@lynixdevs.us";
    const senderName = defaultSender?.name || "LynixDevs";

    console.log("Using sender:", { senderEmail, senderName });

    // Insert contact submission into database
    console.log("Inserting contact submission into database...");
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([
        { 
          name,
          email,
          subject,
          message,
        }
      ]);

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    // Try to send confirmation email to the user
    try {
      console.log("Sending confirmation email...");
      
      // Prepare email content
      const emailHtml = `
        <h1>Thank you for contacting us, ${name}!</h1>
        <p>We have received your message regarding "${subject}" and will get back to you as soon as possible.</p>
        <p>Here's a copy of your message:</p>
        <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 10px;">
          ${message.replace(/\n/g, "<br>")}
        </blockquote>
        <p>Best regards,<br>The ${senderName} Team</p>
      `;
      
      // Send email using the send-email function
      const emailResponse = await supabase.functions.invoke("send-email", {
        body: {
          to: email,
          subject: "We've received your message",
          html: emailHtml,
          replyTo: "info@lynixdevs.com",
          name: name,
          senderEmail: senderEmail,
          senderName: senderName
        },
      });

      if (emailResponse.error) {
        console.error("Error sending confirmation email:", emailResponse.error);
        // Continue execution - don't fail the request just because email failed
      } else {
        console.log("Confirmation email sent successfully");
      }
    } catch (emailError) {
      console.error("Error in email sending process:", emailError);
      // Continue execution - we've saved the contact form to database
    }

    // Also try to send notification email to admin
    try {
      console.log("Sending notification email to admin...");
      
      // Prepare admin notification email content
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
      
      // Send email to admin
      const adminEmailResponse = await supabase.functions.invoke("send-email", {
        body: {
          to: "info@lynixdevs.com", // Admin email address
          subject: `New Contact: ${subject}`,
          html: adminEmailHtml,
          replyTo: email,
          name: name,
          senderEmail: senderEmail,
          senderName: senderName
        },
      });

      if (adminEmailResponse.error) {
        console.error("Error sending admin notification email:", adminEmailResponse.error);
      } else {
        console.log("Admin notification email sent successfully");
      }
    } catch (adminEmailError) {
      console.error("Error in admin email sending process:", adminEmailError);
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
        error: error.message || "An error occurred while processing your submission",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
