
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
    // Get Supabase configuration
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
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

    // Check if already subscribed
    console.log("Checking if email is already subscribed...");
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
      
      return new Response(
        JSON.stringify({ success: true, message: "Already subscribed" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Insert new subscriber
    console.log("Adding new subscriber to database...");
    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({ email });

    if (insertError) {
      console.error("Error inserting new subscriber:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log("New subscriber added successfully");
    
    // Don't send welcome email for now to isolate potential issues
    console.log("Bypassing email sending to diagnose issues");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully subscribed" 
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
