import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { entity: string } }
) {
  const { entity } = params;

  try {
    if (isSupabaseConfigured()) {
      const supabaseAdmin = getSupabaseAdmin();
      const tableName = getTableName(entity);

      const { data, error } = await supabaseAdmin.from(tableName).select("*");
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: true, message: "Local fallback mode active" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { entity: string } }
) {
  const { entity } = params;

  try {
    const payload = await request.json();

    if (isSupabaseConfigured()) {
      const supabaseAdmin = getSupabaseAdmin();
      const tableName = getTableName(entity);

      const { data, error } = await supabaseAdmin
        .from(tableName)
        .upsert(payload)
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: true, data: payload });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    gallery: "gallery",
    reviews: "reviews",
    faqs: "faqs",
    inquiries: "inquiries",
    media: "media",
    audit_logs: "audit_logs",
  };
  return map[entity] || entity;
}
