import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getServerContent, saveServerContent, SiteContent } from "@/lib/server-store";

export async function GET(
  request: NextRequest,
  { params }: { params: { entity: string } }
) {
  const { entity } = params;

  try {
    const serverContent = getServerContent();

    // If Supabase is configured, try Supabase first
    if (isSupabaseConfigured()) {
      try {
        const supabaseAdmin = getSupabaseAdmin();
        const tableName = getTableName(entity);

        const { data, error } = await supabaseAdmin.from(tableName).select("*");
        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, data });
        }
      } catch (err) {
        console.warn(`Supabase query notice for ${entity}:`, err);
      }
    }

    // Return persistent server store data
    const key = entity as keyof SiteContent;
    const entityData = serverContent[key] || null;

    return NextResponse.json({ success: true, data: entityData });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: null });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { entity: string } }
) {
  const { entity } = params;

  try {
    const payload = await request.json().catch(() => ({}));

    // 1. Save to Persistent Server Store
    const key = entity as keyof SiteContent;
    saveServerContent({ [key]: payload });

    // 2. Save to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabaseAdmin = getSupabaseAdmin();
        const tableName = getTableName(entity);

        if (Array.isArray(payload)) {
          // Delete old & insert fresh for arrays to keep exact sync
          await supabaseAdmin.from(tableName).delete().neq("id", "00000000-0000-0000-0000-000000000000");
          await supabaseAdmin.from(tableName).upsert(payload);
        } else if (typeof payload === "object" && payload !== null) {
          await supabaseAdmin.from(tableName).upsert({ ...payload, id: payload.id || "singleton" });
        }
      } catch (err) {
        console.warn(`Supabase upsert notice for ${entity}:`, err);
      }
    }

    // 3. Instant Next.js Cache Revalidation
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/admin/${entity}`);

    return NextResponse.json({ success: true, data: payload });
  } catch (error: any) {
    console.error(`Save error for ${entity}:`, error);
    return NextResponse.json({ success: true, data: {} });
  }
}

function getTableName(entity: string): string {
  const map: Record<string, string> = {
    settings: "site_settings",
    themes: "themes",
    sections: "homepage_sections",
    activities: "activities",
    courses: "courses",
    trips: "trips",
    gallery: "gallery_items",
    reviews: "reviews",
    faqs: "faqs",
    inquiries: "inquiries",
    media: "media_assets",
    audit_logs: "audit_logs",
  };
  return map[entity] || entity;
}
