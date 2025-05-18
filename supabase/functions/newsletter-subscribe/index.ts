
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribePayload {
  email: string;
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
    const { email }: SubscribePayload = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email address" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("subscribers")
      .select("*")
      .eq("email", email)
      .single();

    if (existingSubscriber) {
      // Already subscribed - send confirmation anyway
      // Call the send-email function
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
            subject: "Newsletter Subscription Confirmed",
            html: `
              <h1>You're Already Subscribed!</h1>
              <p>Thanks for your continued interest in LynixDevs! You're already subscribed to our newsletter.</p>
              <p>We'll keep you updated with our latest news, insights and offers.</p>
              <p>Best regards,<br>The LynixDevs Team</p>
            `,
          }),
        }
      );

      if (!emailResponse.ok) {
        throw new Error("Failed to send confirmation email");
      }

      return new Response(
        JSON.stringify({ success: true, message: "Already subscribed" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({ email });

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    // Send welcome email
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
          subject: "Welcome to LynixDevs Newsletter",
          html: `
            <h1>Thanks for Subscribing!</h1>
            <p>Welcome to the LynixDevs newsletter! You've successfully subscribed to our updates.</p>
            <p>We're excited to share our latest news, insights and offers with you.</p>
            <p>Best regards,<br>The LynixDevs Team</p>
          `,
        }),
      }
    );

    if (!emailResponse.ok) {
      throw new Error("Failed to send welcome email");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully subscribed and welcome email sent" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error processing subscription:", error);
    
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
