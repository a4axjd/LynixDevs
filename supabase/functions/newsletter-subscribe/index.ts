
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
    // Get Supabase configuration from environment
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    // Validate Supabase configuration
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const { email }: SubscribePayload = await req.json();
    
    console.log("Newsletter subscription request received for:", email);

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
    const { data: existingSubscriber, error: selectError } = await supabase
      .from("subscribers")
      .select("*")
      .eq("email", email)
      .maybeSingle();
      
    if (selectError) {
      console.error("Error checking for existing subscriber:", selectError);
      throw new Error(`Database error: ${selectError.message}`);
    }

    if (existingSubscriber) {
      console.log("Email already subscribed:", email);
      // Already subscribed - send confirmation anyway
      try {
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
          const errorData = await emailResponse.text();
          console.error("Error sending confirmation email:", errorData);
          // Continue execution even if email fails
        } else {
          console.log("Already subscribed email sent successfully");
        }
      } catch (emailError) {
        console.error("Error sending already subscribed email:", emailError);
        // Continue execution even if email fails
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
      console.error("Error inserting new subscriber:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log("New subscriber added to database:", email);

    // Send welcome email
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

      const responseText = await emailResponse.text();
      if (!emailResponse.ok) {
        console.error("Error sending welcome email. Status:", emailResponse.status, "Response:", responseText);
        // Continue execution even if welcome email fails
      } else {
        console.log("Welcome email sent successfully");
      }
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Continue execution even if welcome email fails
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
        error: error.message || "An error occurred while processing your subscription",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
