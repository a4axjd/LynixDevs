
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase URL or anon key");
    }

    if (!supabaseServiceRoleKey) {
      console.error("SUPABASE_SERVICE_ROLE_KEY is not set");
      throw new Error("Missing service role key - check your edge function secrets configuration");
    }

    console.log("Creating authenticated Supabase client");
    // Create a Supabase client with the Auth context of the logged-in user
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Check authentication
    const {
      data: { user },
      error: authError
    } = await supabaseClient.auth.getUser();

    if (authError) {
      console.error("Authentication error:", authError.message);
      throw new Error("Authentication failed: " + authError.message);
    }

    if (!user) {
      console.error("User not authenticated");
      throw new Error("Authentication required");
    }

    console.log("Authenticated user:", user.id);

    // Check if the user is an admin
    const { data: isAdmin, error: roleError } = await supabaseClient.rpc(
      "has_role",
      {
        _user_id: user.id,
        _role: "admin",
      }
    );

    if (roleError) {
      console.error("Role check error:", roleError.message);
      throw new Error("Error checking admin role: " + roleError.message);
    }

    if (!isAdmin) {
      console.error("User is not an admin:", user.id);
      throw new Error("Admin privileges required");
    }

    console.log("Admin check passed for user:", user.id);

    // Create a service role client to fetch user data
    // Service role bypasses RLS policies
    console.log("Creating service role client");
    const serviceRoleClient = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    );

    // Use admin API to get users
    console.log("Fetching users from Auth API");
    const authResponse = await fetch(
      `${supabaseUrl}/auth/v1/admin/users`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
          apikey: supabaseServiceRoleKey,
        },
      }
    );

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error("Failed to fetch users:", authResponse.status, errorText);
      throw new Error(`Failed to fetch users: ${authResponse.statusText} (${errorText})`);
    }

    const users = await authResponse.json();
    console.log("Successfully fetched users, count:", users.length);

    // Check admin status for each user
    for (const user of users) {
      const { data, error } = await serviceRoleClient.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      
      if (error) {
        console.warn(`Error checking admin status for user ${user.id}:`, error.message);
      }
      
      user.isAdmin = !!data;
    }

    return new Response(JSON.stringify(users), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
