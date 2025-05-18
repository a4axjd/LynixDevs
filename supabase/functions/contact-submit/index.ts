
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
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
    const payload: ContactPayload = await req.json();
    const { name, email, phone, subject, message } = payload;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Store contact submission in database
    const { error: insertError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        phone,
        subject,
        message,
      });

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    // Send confirmation email to the user
    const userEmailResponse = await fetch(
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
            <h1>Thanks for Contacting Us, ${name}!</h1>
            <p>We've received your message regarding "${subject}".</p>
            <p>Our team will review your inquiry and get back to you as soon as possible.</p>
            <p>For your reference, here's a copy of your message:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="font-style: italic;">${message}</p>
            </div>
            <p>Best regards,<br>The LynixDevs Team</p>
          `,
        }),
      }
    );

    if (!userEmailResponse.ok) {
      console.error("Failed to send user confirmation email");
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
          to: Deno.env.get("SMTP_FROM_EMAIL") || "",
          subject: `New Contact Form Submission: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
              <p>${message}</p>
            </div>
          `,
          replyTo: email,
          name: name
        }),
      }
    );

    if (!adminEmailResponse.ok) {
      console.error("Failed to send admin notification email");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact form submitted successfully" 
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
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
