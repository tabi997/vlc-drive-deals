import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = await req.json();
    if (!id || typeof id !== "string") {
      return new Response(JSON.stringify({ error: "ID-ul anunțului este obligatoriu" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Delete listing function missing credentials");
      return new Response(JSON.stringify({ error: "Supabase environment not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authorization = req.headers.get("Authorization") ?? "";
    const token = authorization.replace("Bearer ", "").trim();

    if (!token) {
      return new Response(JSON.stringify({ error: "Autentificare necesară" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Autentificare invalidă" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: adminEntry, error: adminError } = await supabaseAdmin
      .from("admin_users")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError) {
      console.error("Failed to fetch admin role", adminError);
      return new Response(JSON.stringify({ error: "Nu am putut verifica rolul utilizatorului" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!adminEntry || adminEntry.role !== "admin") {
      return new Response(JSON.stringify({ error: "Acces restricționat" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: deleteError } = await supabaseAdmin.from("autovit_listings").delete().eq("id", id);

    if (deleteError) {
      console.error("Failed to delete listing", deleteError);
      return new Response(JSON.stringify({ error: "Ștergerea anunțului a eșuat" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Ștergerea anunțului a eșuat" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

