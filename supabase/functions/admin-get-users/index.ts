
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
    // Create a Supabase client with the Auth context of the logged-in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Check if the user is an admin
    const { data: isAdmin, error: roleError } = await supabaseClient.rpc(
      "has_role",
      {
        _user_id: user.id,
        _role: "admin",
      }
    );

    if (roleError) {
      throw new Error(roleError.message);
    }

    if (!isAdmin) {
      throw new Error("Not authorized");
    }

    // Create a service role client to fetch user data
    // Service role bypasses RLS policies
    const serviceRoleClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Use admin API to get users
    const authResponse = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/auth/v1/admin/users`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          apikey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
        },
      }
    );

    if (!authResponse.ok) {
      throw new Error(`Failed to fetch users: ${authResponse.statusText}`);
    }

    const users = await authResponse.json();

    // Check admin status for each user
    for (const user of users) {
      const { data } = await serviceRoleClient.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      user.isAdmin = data;
    }

    return new Response(JSON.stringify(users), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
