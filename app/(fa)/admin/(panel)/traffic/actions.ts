"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { query } from "@/lib/db";
import { runAudit } from "@/lib/seo-audit";
import { trafficPhones } from "@/lib/traffic";

export async function runSeoAudit() {
  const phone = await requireAdmin();
  if (!trafficPhones().has(phone)) notFound();
  const results = await runAudit();
  await query("INSERT INTO analytics_audits (actor, results) VALUES ($1, $2)", [phone, JSON.stringify(results)]);
  revalidatePath("/admin/traffic");
}
