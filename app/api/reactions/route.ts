import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId, videoId, type, reason } = await request.json();

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ userId, videoId, type, reason }, { status: 201 });
  }

  const { prisma } = await import("@/lib/prisma");
  const reaction = await prisma.reaction.upsert({
    where: { userId_videoId: { userId, videoId } },
    update: { type, reason },
    create: { userId, videoId, type, reason },
  });
  return NextResponse.json(reaction, { status: 201 });
}
