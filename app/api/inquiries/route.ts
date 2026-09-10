import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { BookingInquiry } from "@/lib/types";

function generateBookingReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DV-${code}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      interest_type = "Activity",
      item_title,
      preferred_date,
      participants_count = 1,
      diver_level = "Beginner",
      special_requests = "",
    } = body;

    if (!customer_name || !customer_email || !customer_phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required fields." },
        { status: 400 }
      );
    }

    const reference_code = generateBookingReference();
    const id = `inq-${Date.now()}`;
    const created_at = new Date().toISOString();

    const inquiryRecord: BookingInquiry & { reference_code?: string } = {
      id,
      customer_name,
      customer_email,
      customer_phone,
      interest_type,
      item_title: item_title || `${interest_type} Inquiry`,
      preferred_date: preferred_date || created_at.split("T")[0],
      participants_count: Number(participants_count) || 1,
      diver_level,
      special_requests,
      status: "New",
      admin_notes: `Direct inquiry from website. Reference: ${reference_code}`,
      created_at,
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: dbError } = await supabase.from("booking_inquiries").insert({
          id,
          customer_name,
          customer_email,
          customer_phone,
          interest_type,
          item_title: inquiryRecord.item_title,
          preferred_date: inquiryRecord.preferred_date,
          participants_count: inquiryRecord.participants_count,
          diver_level,
          special_requests,
          status: "New",
          admin_notes: inquiryRecord.admin_notes,
          created_at,
        });

        if (dbError) {
          console.warn("Could not insert into Supabase booking_inquiries:", dbError);
        }
      } catch (e) {
        console.warn("Supabase booking insert exception:", e);
      }
    }

    return NextResponse.json(
      {
        success: true,
        reference_code,
        inquiry: {
          ...inquiryRecord,
          reference_code,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process inquiry" },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("booking_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return NextResponse.json({ inquiries: data });
      }
    } catch (e) {
      console.warn("Supabase fetch inquiries error:", e);
    }
  }

  return NextResponse.json({ inquiries: [] });
}
