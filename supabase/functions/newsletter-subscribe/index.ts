
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
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const { email } = await req.json();
    console.log("Newsletter subscription request received for:", email);

    if (!email || !email.includes("@")) {
      console.error("Invalid email address");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Please provide a valid email address" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Check if email is already subscribed
    console.log("Checking if email is already subscribed...");
    const { data: existingSubscriber, error: fetchError } = await supabase
      .from("subscribers")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") { 
      // PGRST116 means no rows returned, which is expected if the email isn't subscribed yet
      console.error("Error checking existing subscriber:", fetchError);
      throw new Error(`Database error: ${fetchError.message}`);
    }

    if (existingSubscriber) {
      console.log("Email is already subscribed");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "You're already subscribed to our newsletter!" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Add new subscriber to the database
    console.log("Adding new subscriber to database...");
    const { error: insertError } = await supabase
      .from("subscribers")
      .insert([
        { 
          email,
          subscribed_at: new Date().toISOString(),
          status: "active"
        }
      ]);

    if (insertError) {
      console.error("Error inserting new subscriber:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    // Send welcome email
    try {
      // Prepare welcome email
      const welcomeHtml = `
        <h1>Welcome to LynixDevs Newsletter!</h1>
        <p>Thank you for subscribing to our newsletter. You'll now receive updates on our latest news, projects, and offers.</p>
        <p>If you didn't subscribe or wish to unsubscribe, please <a href="https://lynixdevs.com/unsubscribe?email=${encodeURIComponent(email)}">click here</a>.</p>
        <p>Best regards,<br>The LynixDevs Team</p>
      `;

      // Call the send-email function
      const emailResponse = await supabase.functions.invoke("send-email", {
        body: {
          to: email,
          subject: "Welcome to LynixDevs Newsletter!",
          html: welcomeHtml,
        },
      });

      if (emailResponse.error) {
        console.error("Error sending welcome email:", emailResponse.error);
        // Continue execution - don't fail the request just because email failed
      } else {
        console.log("Welcome email sent successfully");
      }
    } catch (emailError) {
      console.error("Error in email sending process:", emailError);
      // Continue execution - we've saved the subscription to database
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Thank you for subscribing to our newsletter!" 
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
