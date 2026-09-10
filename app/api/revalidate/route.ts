import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "/";
    const tag = searchParams.get("tag");

    if (tag) {
      revalidateTag(tag);
    } else {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      path,
      tag: tag || null,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
