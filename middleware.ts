import { NextRequest, NextResponse } from "next/server";

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "diving-vision-enterprise-security-secret-key-2026";

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [data, signature] = parts;
    if (!data || !signature) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
    const expectedSig = Buffer.from(sigBuffer).toString("base64url");

    if (expectedSig !== signature) return false;

    // Decode base64url payload
    const decodedStr = Buffer.from(data, "base64url").toString("utf-8");
    const payload = JSON.parse(decodedStr);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return false; // Expired session
    }

    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = req.cookies.get("admin_session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isValid = await verifyToken(sessionCookie, AUTH_SECRET);
    if (!isValid) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("error", "session_expired");
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
