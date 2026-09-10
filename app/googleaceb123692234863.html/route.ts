import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("google-site-verification: googleaceb123692234863.html", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
