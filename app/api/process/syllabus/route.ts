import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { syllabusKey } = body;

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({
      topics: [
        "Introduction and Overview",
        "Core Concepts and Fundamentals",
        "Advanced Theory",
        "Practical Applications",
        "Review and Assessment",
      ],
      syllabusKey,
    });
  }

  try {
    const { extractTopicsFromPdf } = await import("@/lib/api/aws-bedrock");
    const topics = await extractTopicsFromPdf(syllabusKey);
    return NextResponse.json({ topics, syllabusKey });
  } catch {
    return NextResponse.json({ error: "Failed to extract topics" }, { status: 500 });
  }
}
