import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { entity, entityId, all = false } = body;

    const publishedAt = new Date().toISOString();

    // Trigger Next.js on-demand ISR Cache Revalidation
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      published_at: publishedAt,
      entity: entity || "all",
      entity_id: entityId || null,
      message: "Content successfully published and cache revalidated for all public visitors.",
    });
  } catch (error: any) {
    console.error("Publish API route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to publish content changes" },
      { status: 500 }
    );
  }
}
