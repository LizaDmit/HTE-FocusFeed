import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || "upload.mp4";
  const contentType = searchParams.get("contentType") || "video/mp4";

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({
      uploadUrl: `https://mock-s3-bucket.s3.amazonaws.com/${filename}?mock=true`,
      key: filename,
      contentType,
    });
  }

  try {
    const { getPresignedUploadUrl } = await import("@/lib/api/aws-s3");
    const result = await getPresignedUploadUrl(filename, contentType);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 });
  }
}
