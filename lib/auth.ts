import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "diving-vision-enterprise-security-secret-key-2026";

export interface SessionPayload {
  email: string;
  role: "Super Admin" | "Content Manager";
  exp: number; // Unix timestamp in seconds
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token
 */
export function signSessionToken(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Verifies the HMAC-SHA256 session token and returns the payload if valid & unexpired
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(data)
      .digest("base64url");

    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
