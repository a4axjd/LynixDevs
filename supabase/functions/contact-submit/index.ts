
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
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
    const contactData: ContactPayload = await req.json();
    console.log("Received contact submission:", contactData);

    // Validate payload
    const { name, email, subject = "Contact Form Submission", message, phone = "" } = contactData;
    
    if (!name || !email || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Insert into database
    console.log("Inserting contact submission into database...");
    const { error: insertError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        message,
        subject,
        phone,
      });

    if (insertError) {
      console.error("Database error:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }
    
    console.log("Contact submission saved successfully");

    // Don't send confirmation email for now to isolate potential issues
    console.log("Bypassing email sending to diagnose issues");
    
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
