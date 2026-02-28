import { NextResponse } from "next/server";
import { getMockCommentsByVideo } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) return NextResponse.json({ error: "videoId required" }, { status: 400 });

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json(getMockCommentsByVideo(videoId));
  }

  const { prisma } = await import("@/lib/prisma");
  const comments = await prisma.comment.findMany({
    where: { videoId },
    include: { user: true },
    orderBy: { likesCount: "desc" },
  });
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const { userId, videoId, text } = await request.json();

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ id: `comment-mock-${Date.now()}`, userId, videoId, text, likesCount: 0 }, { status: 201 });
  }

  const { prisma } = await import("@/lib/prisma");
  const comment = await prisma.comment.create({
    data: { userId, videoId, text },
    include: { user: true },
  });
  return NextResponse.json(comment, { status: 201 });
}
