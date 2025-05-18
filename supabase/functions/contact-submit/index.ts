
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const { name, email, message }: ContactPayload = await req.json();

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
      .insert({ name, email, message });

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    // Send confirmation email
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

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Error sending email:", errorData);
      throw new Error("Failed to send confirmation email");
    }

    // Send notification to admin
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
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
          replyTo: email,
          name: name
        }),
      }
    );

    if (!adminEmailResponse.ok) {
      console.error("Error sending admin notification:", await adminEmailResponse.text());
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
