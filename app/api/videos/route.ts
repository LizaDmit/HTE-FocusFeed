import { NextResponse } from "next/server";
import { mockVideos } from "@/lib/mock-data";

export async function GET() {
  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json(mockVideos);
  }

  const { prisma } = await import("@/lib/prisma");
  const videos = await prisma.video.findMany({
    include: { user: true, course: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ id: `video-mock-${Date.now()}`, ...body }, { status: 201 });
  }

  const { prisma } = await import("@/lib/prisma");
  const video = await prisma.video.create({ data: body });
  return NextResponse.json(video, { status: 201 });
}
