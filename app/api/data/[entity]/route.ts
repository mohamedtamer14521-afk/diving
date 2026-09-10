import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { entity: string } }
) {
  const { entity } = params;

  try {
    if (isSupabaseConfigured()) {
      try {
        const supabaseAdmin = getSupabaseAdmin();
        const tableName = getTableName(entity);

        const { data, error } = await supabaseAdmin.from(tableName).select("*");
        if (!error && data) {
          return NextResponse.json({ success: true, data });
        }
      } catch (err) {
        console.warn(`Supabase query notice for ${entity}:`, err);
      }
    }

    return NextResponse.json({ success: true, data: null, message: "Local fallback mode active" });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: null, message: error.message || "Fallback" });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { entity: string } }
) {
  const { entity } = params;

  try {
    const payload = await request.json().catch(() => ({}));

    if (isSupabaseConfigured()) {
      try {
        const supabaseAdmin = getSupabaseAdmin();
        const tableName = getTableName(entity);

        const { data, error } = await supabaseAdmin
          .from(tableName)
          .upsert(payload)
          .select();

        if (!error && data) {
          return NextResponse.json({ success: true, data });
        }
      } catch (err) {
        console.warn(`Supabase upsert notice for ${entity}:`, err);
      }
    }

    return NextResponse.json({ success: true, data: payload });
  } catch (error: any) {
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
