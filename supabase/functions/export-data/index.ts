import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";
import { corsHeaders } from "../_shared/cors.ts";

interface ExportRequest {
  format: "csv" | "json";
  company_id?: string | null;
  department_id?: string | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Verify the caller is an authenticated admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: caller }, error: authError } = await callerClient.auth.getUser();
    if (authError || !caller) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Check caller role
    const { data: callerProfile } = await callerClient
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (!callerProfile || callerProfile.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Only admins can export data" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2. Parse request body
    const body: ExportRequest = await req.json();
    const format = body.format || "csv";

    // 3. Query data using service_role to bypass RLS (full access)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get filtered profile IDs if company/department filter is set
    let userIdFilter: string[] | null = null;
    if (body.company_id) {
      let profileQuery = adminClient.from("profiles").select("id").eq("company_id", body.company_id);
      if (body.department_id) {
        profileQuery = profileQuery.eq("department_id", body.department_id);
      }
      const { data: filteredProfiles } = await profileQuery;
      userIdFilter = (filteredProfiles ?? []).map((p) => p.id);

      if (userIdFilter.length === 0) {
        return new Response(
          JSON.stringify({ error: "ไม่มีข้อมูลสำหรับส่งออก", data: [], count: 0 }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // Fetch user_missions
    let query = adminClient.from("user_missions").select("*");
    if (userIdFilter && userIdFilter.length > 0) {
      query = query.in("user_id", userIdFilter);
    }
    const { data: userMissions, error: queryError } = await query;
    if (queryError) throw queryError;

    const rows = userMissions ?? [];

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ data: [], count: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Fetch related data
    const missionIds = [...new Set(rows.map((r) => r.mission_id))];
    const userIds = [...new Set(rows.map((r) => r.user_id))];

    const [missionsRes, profilesRes] = await Promise.all([
      adminClient.from("missions").select("id, title").in("id", missionIds),
      adminClient.from("profiles").select("id, full_name, email, role").in("id", userIds),
    ]);

    const missionMap = new Map((missionsRes.data ?? []).map((m) => [m.id, m]));
    const profileMap = new Map((profilesRes.data ?? []).map((p) => [p.id, p]));

    // Build export rows
    const exportRows = rows.map((row) => {
      const mission = missionMap.get(row.mission_id);
      const profile = profileMap.get(row.user_id);
      return {
        mission_title: mission?.title ?? "",
        user_name: profile?.full_name ?? "",
        user_email: profile?.email ?? "",
        user_role: profile?.role ?? "",
        status: row.status,
        feedback_score: row.feedback_score,
        started_at: row.started_at,
        submitted_at: row.submitted_at,
        reviewed_at: row.reviewed_at,
      };
    });

    // 4. Return based on format
    if (format === "csv") {
      const headers = Object.keys(exportRows[0]);
      const csvLines = [
        headers.join(","),
        ...exportRows.map((row) =>
          headers
            .map((h) => {
              const val = row[h as keyof typeof row];
              const str = val === null || val === undefined ? "" : String(val);
              return `"${str.replace(/"/g, '""')}"`;
            })
            .join(",")
        ),
      ];
      // BOM for Thai character support in Excel
      const csvContent = "\uFEFF" + csvLines.join("\n");

      return new Response(csvContent, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="culturepassport-export-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // JSON format
    return new Response(
      JSON.stringify({ data: exportRows, count: exportRows.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
