import { NextResponse } from "next/server";
import { getMockConversations } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "user-1";

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json(getMockConversations(userId));
  }

  const { prisma } = await import("@/lib/prisma");

  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    include: {
      requester: { select: { id: true, username: true, avatarUrl: true } },
      addressee: { select: { id: true, username: true, avatarUrl: true } },
    },
  });

  const friendIds = friendships.map((f) =>
    f.requesterId === userId ? f.addresseeId : f.requesterId
  );

  const conversations: {
    friend: { id: string; username: string; avatarUrl: string | null };
    lastMessage: { text: string | null; sharedVideoId: string | null; createdAt: Date } | null;
  }[] = [];

  for (const friendId of friendIds) {
    const lastMessage = await prisma.message.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: { text: true, sharedVideoId: true, createdAt: true },
    });

    const friendUser = friendships.find(
      (f) => f.requesterId === friendId || f.addresseeId === friendId
    );
    const friend =
      friendUser?.requesterId === friendId
        ? friendUser.requester
        : friendUser?.addressee;

    if (friend) {
      conversations.push({
        friend,
        lastMessage: lastMessage
          ? {
              text: lastMessage.text,
              sharedVideoId: lastMessage.sharedVideoId,
              createdAt: lastMessage.createdAt,
            }
          : null,
      });
    }
  }

  conversations.sort((a, b) => {
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return (
      new Date(b.lastMessage.createdAt).getTime() -
      new Date(a.lastMessage.createdAt).getTime()
    );
  });

  return NextResponse.json(conversations);
}
