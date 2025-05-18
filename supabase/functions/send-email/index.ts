
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

    // Configure SMTP client
    const client = new SmtpClient();
    
    await client.connect({
      hostname: Deno.env.get("SMTP_HOST") || "",
      port: Number(Deno.env.get("SMTP_PORT")) || 587,
      tls: true,
      username: Deno.env.get("SMTP_USER") || "",
      password: Deno.env.get("SMTP_PASSWORD") || "",
    });

    // Set up email data
    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || "noreply@example.com";
    const fromName = "LynixDevs";
    
    // Send email
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

    await client.send(sendConfig);
    await client.close();
    
    console.log("Email sent successfully to:", to);

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
