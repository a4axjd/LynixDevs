
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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

    const { to, subject, html, replyTo, name } = payload as EmailPayload;
    
    // Get SMTP configuration
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Number(Deno.env.get("SMTP_PORT"));
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL");
    
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !fromEmail) {
      console.error("Missing SMTP configuration");
      throw new Error("Server configuration error: Missing SMTP settings");
    }

    // Create a new SMTP client
    const client = new SmtpClient();
    
    try {
      console.log("Connecting to SMTP server...");
      await client.connect({
        hostname: smtpHost,
        port: smtpPort,
        username: smtpUser,
        password: smtpPassword,
        tls: true,
      });
      console.log("Connected to SMTP server");
      
      const fromName = "LynixDevs";
      
      // Set up email data
      const sendConfig: any = {
        from: `${fromName} <${fromEmail}>`,
        to: to,
        subject: subject,
        content: html,
        html: html,
      };
      
      // Add reply-to header if provided
      if (replyTo && name) {
        sendConfig.replyTo = `${name} <${replyTo}>`;
      }
      
      console.log("Sending email...");
      await client.send(sendConfig);
      console.log("Email sent");
      
      await client.close();
      console.log("SMTP connection closed");
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Error in email sending process:", error);
      // Ensure client is closed even if an error occurs
      try {
        await client.close();
        console.log("SMTP connection closed after error");
      } catch (closeError) {
        console.error("Error closing SMTP connection:", closeError);
      }
      throw error;
    }
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
