
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  name?: string;
  senderEmail?: string;
  senderName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Email request received:", payload);
    
    // Validate payload
    if (!payload.to || !payload.subject || !payload.html) {
      throw new Error("Missing required email fields");
    }

    const { to, subject, html, replyTo, name, senderEmail, senderName } = payload as EmailPayload;
    
    // Get Brevo API configuration
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    
    if (!brevoApiKey) {
      console.error("Missing Brevo API key");
      throw new Error("Server configuration error: Missing Brevo API key");
    }

    // Use provided sender or default to LynixDevs
    const fromEmail = senderEmail || "noreply@lynixdevs.us";
    const fromName = senderName || "LynixDevs";

    // Prepare the email data for Brevo API
    const brevoPayload = {
      sender: {
        name: fromName,
        email: fromEmail,
      },
      to: [
        {
          email: to,
          name: name || to,
        },
      ],
      subject: subject,
      htmlContent: html,
    };
    
    // Add reply-to header if provided
    if (replyTo) {
      brevoPayload.replyTo = {
        email: replyTo,
        name: name || replyTo,
      };
    }
    
    console.log("Sending email via Brevo API...");
    
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify(brevoPayload),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo API error:", response.status, errorData);
      throw new Error(`Failed to send email: ${response.status} ${errorData}`);
    }
    
    const result = await response.json();
    console.log("Email sent successfully via Brevo API:", result);
    
    return new Response(JSON.stringify({ success: true, messageId: result.messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
