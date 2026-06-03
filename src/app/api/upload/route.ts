import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to base64 data URI for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "application/octet-stream";
    const dataUri = `data:${mimeType};base64,${base64}`;

    // Determine resource type based on file MIME type
    const resourceType = mimeType.startsWith("video/") ? "video" : "image";

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "prettychi-hairs",
      resource_type: resourceType,
      // Apply auto-quality and format for images
      ...(resourceType === "image" && {
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      }),
    });

    // Return the secure Cloudinary URL
    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
