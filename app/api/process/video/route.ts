import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { videoKey, options } = body;

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({
      jobId: `job-mock-${Date.now()}`,
      status: "processing",
      videoKey,
      options,
    });
  }

  try {
    return NextResponse.json({
      jobId: `job-${Date.now()}`,
      status: "queued",
      message: "Video processing job has been queued",
    });
  } catch {
    return NextResponse.json({ error: "Failed to start processing" }, { status: 500 });
  }
}
