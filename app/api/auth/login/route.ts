import { NextRequest, NextResponse } from "next/server";
import { signSessionToken } from "@/lib/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role = "Super Admin" } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const inputEmail = String(email).trim().toLowerCase();
    const inputPassword = String(password).trim();

    // 1. Check Server Environment Variables (Encrypted server-side master credentials)
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || "admin@divingvisioncenter.com").trim().toLowerCase();
    const configuredAdminPassword = (process.env.ADMIN_PASSWORD || "DivingVision@2026").trim();

    let isAuthenticated = false;
    let authSource = "master_env";

    // Direct match with Server-Configured Admin Credentials
    if (inputEmail === configuredAdminEmail && inputPassword === configuredAdminPassword) {
      isAuthenticated = true;
    }

    // 2. Alternatively, verify with Supabase Auth if configured
    if (!isAuthenticated && isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: inputEmail,
          password: inputPassword,
        });

        if (!error && data?.user) {
          isAuthenticated = true;
          authSource = "supabase_auth";
        }
      } catch (err) {
        console.warn("Supabase Auth check skipped or failed:", err);
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Invalid email or password. Access denied." },
        { status: 401 }
      );
    }

    // Generate cryptographically signed session token (valid for 7 days)
    const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    const sessionToken = signSessionToken({
      email: inputEmail,
      role: role === "Content Manager" ? "Content Manager" : "Super Admin",
      exp,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        email: inputEmail,
        role,
        authSource,
      },
    });

    // Set secure HttpOnly cookie
    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication service error. Please try again." },
      { status: 500 }
    );
  }
}
