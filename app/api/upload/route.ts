import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadToR2 } from "@/lib/r2/client";

export async function POST(request: Request) {
  try {
    // 1. Check Authentication
    // Only authenticated users (admins) should be able to upload files.
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Prepare file for R2
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const contentType = file.type || "application/octet-stream";

    // 4. Generate a safe unique key
    const timestamp = Date.now();
    const sanitizedFilename = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");
      
    const key = `${folder}/${timestamp}-${sanitizedFilename}`;

    // 5. Upload to Cloudflare R2
    const publicUrl = await uploadToR2(key, buffer, contentType);

    // 6. Return the URL
    return NextResponse.json({ url: publicUrl, key }, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/upload:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
