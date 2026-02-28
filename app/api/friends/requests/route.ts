import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const { prisma } = await import("@/lib/prisma");
  const requests = await prisma.friendship.findMany({
    where: { addresseeId: userId, status: "PENDING" },
    include: {
      requester: { select: { id: true, username: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    requests.map((r) => ({
      id: r.id,
      user: r.requester,
      createdAt: r.createdAt,
    }))
  );
}
