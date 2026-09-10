import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const customAlt = (formData.get("alt_text") as string) || "";
    const customCaption = (formData.get("caption") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided in form data" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedBaseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const uniqueFileName = `${sanitizedBaseName}-${timestamp}-${randomSuffix}.${fileExt}`;
    const storagePath = `uploads/${uniqueFileName}`;

    let publicUrl = "";

    // 1. If real Supabase is configured, upload directly to Supabase Storage Bucket
    if (isSupabaseConfigured()) {
      const supabaseAdmin = getSupabaseAdmin();
      const { data, error } = await supabaseAdmin.storage
        .from("media")
        .upload(storagePath, fileBuffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        throw new Error(`Supabase Storage: ${error.message}`);
      }

      const { data: urlData } = supabaseAdmin.storage.from("media").getPublicUrl(storagePath);
      publicUrl = urlData.publicUrl;
    } else {
      // 2. Resilient local filesystem upload under public/uploads/ for development/offline
      const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(publicUploadsDir, { recursive: true });
      const localFilePath = path.join(publicUploadsDir, uniqueFileName);
      await writeFile(localFilePath, fileBuffer);
      publicUrl = `/uploads/${uniqueFileName}`;
    }

    const mediaRecord = {
      id: `med-${timestamp}`,
      name: file.name,
      url: publicUrl,
      file_size: file.size,
      file_type: file.type,
      alt_text: customAlt || file.name,
      caption: customCaption || "",
      storage_path: storagePath,
      bucket_name: "media",
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      media: mediaRecord,
      message: "File uploaded and registered successfully",
    });
  } catch (error: any) {
    console.error("Upload API route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file to storage" },
      { status: 500 }
    );
  }
}
