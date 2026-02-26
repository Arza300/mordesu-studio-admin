import { NextResponse } from "next/server";
import { uploadPlatformImage } from "@/lib/r2";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { url } = await uploadPlatformImage({
      buffer,
      contentType: file.type || "application/octet-stream",
      fileName: file.name || "platform-image",
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("R2 upload error", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}

