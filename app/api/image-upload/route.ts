import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { request } from "http";
import { error } from "console";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINRY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "UnAuthorized" }, { status: 401 });
    }
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINRY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary Credentails not found" },
        { status: 500 }
      );
    }
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File Not Found" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "next-clodinary-upload" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
        uploadStream.end(buffer);
      }
    );

    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    console.log("upload imgae failed-------------->", error);
    return NextResponse.json(
      { error: "Error in uploading image" },
      { status: 500 }
    );
  }
}
