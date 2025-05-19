
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
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const { to, subject, html, replyTo, name } = payload;
    
    // Log the request for debugging
    console.log("Email request received:", { to, subject, replyTo, name });

    // Get SMTP configuration from environment variables
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Number(Deno.env.get("SMTP_PORT"));
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL");

    // Validate SMTP configuration
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !fromEmail) {
      console.error("Missing SMTP configuration:", { 
        host: !!smtpHost, 
        port: !!smtpPort, 
        user: !!smtpUser, 
        password: !!smtpPassword,
        fromEmail: !!fromEmail
      });
      throw new Error("SMTP configuration is incomplete");
    }

    // Initialize SMTP client
    const client = new SmtpClient();
    
    try {
      await client.connect({
        hostname: smtpHost,
        port: smtpPort,
        username: smtpUser,
        password: smtpPassword,
        tls: true,
      });
      
      console.log("SMTP connection established successfully");
    } catch (connError) {
      console.error("SMTP connection error:", connError);
      throw new Error(`Failed to connect to SMTP server: ${connError.message}`);
    }

    // Set up email data
    const fromName = "LynixDevs";
    
    // Prepare email data
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

    try {
      console.log("Attempting to send email with config:", sendConfig);
      await client.send(sendConfig);
      console.log("Email sent successfully to:", to);
    } catch (sendError) {
      console.error("Email sending error:", sendError);
      throw new Error(`Failed to send email: ${sendError.message}`);
    } finally {
      try {
        await client.close();
        console.log("SMTP connection closed");
      } catch (closeError) {
        console.error("Error closing SMTP connection:", closeError);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error sending email:", error);
    
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
