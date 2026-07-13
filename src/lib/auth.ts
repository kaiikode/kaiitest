import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "couple" | "staff" | "administrator";

export async function requireRole(roles: AppRole[]) {
  const supabase = await createClient();
  if (!supabase) {
    return {
      id: "demo-admin",
      role: "administrator" as const,
      fullName: "Padua Demo Administrator",
    };
  }

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", authData.user.id)
    .single();

  if (!profile || !roles.includes(profile.role as AppRole))
    redirect("/planning/overview");
  return {
    id: profile.id,
    role: profile.role as AppRole,
    fullName: profile.full_name,
  };
}
