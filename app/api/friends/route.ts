import { NextResponse } from "next/server";
import { getMockFriends } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "user-1";

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json(getMockFriends(userId));
  }

  const { prisma } = await import("@/lib/prisma");
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    include: { requester: true, addressee: true },
  });

  const friends = friendships.map((f) =>
    f.requesterId === userId ? f.addressee : f.requester
  );
  return NextResponse.json(friends);
}

export async function POST(request: Request) {
  const { requesterId, addresseeId } = await request.json();

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ requesterId, addresseeId, status: "PENDING" }, { status: 201 });
  }

  const { prisma } = await import("@/lib/prisma");

  const reverse = await prisma.friendship.findFirst({
    where: { requesterId: addresseeId, addresseeId: requesterId, status: "PENDING" },
  });

  if (reverse) {
    const updated = await prisma.friendship.update({
      where: { id: reverse.id },
      data: { status: "ACCEPTED" },
    });
    return NextResponse.json(updated, { status: 200 });
  }

  const existing = await prisma.friendship.findFirst({
    where: { requesterId, addresseeId },
  });
  if (existing) {
    return NextResponse.json(existing, { status: 200 });
  }

  const friendship = await prisma.friendship.create({
    data: { requesterId, addresseeId },
  });
  return NextResponse.json(friendship, { status: 201 });
}
