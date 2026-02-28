import { NextResponse } from "next/server";
import { mockMessages } from "@/lib/mock-data";

export async function GET(request: Request, { params }: { params: { friendId: string } }) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "user-1";

  if (process.env.USE_MOCK_DATA === "true") {
    const messages = mockMessages.filter(
      (m) =>
        (m.senderId === userId && m.receiverId === params.friendId) ||
        (m.senderId === params.friendId && m.receiverId === userId)
    );
    return NextResponse.json(messages);
  }

  const { prisma } = await import("@/lib/prisma");
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: params.friendId },
        { senderId: params.friendId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: { sharedVideo: true },
  });
  return NextResponse.json(messages);
}

export async function POST(request: Request, { params }: { params: { friendId: string } }) {
  const { userId, text, sharedVideoId } = await request.json();

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json(
      { id: `msg-mock-${Date.now()}`, senderId: userId, receiverId: params.friendId, text, sharedVideoId },
      { status: 201 }
    );
  }

  const { prisma } = await import("@/lib/prisma");
  const message = await prisma.message.create({
    data: { senderId: userId, receiverId: params.friendId, text, sharedVideoId },
  });
  return NextResponse.json(message, { status: 201 });
}
