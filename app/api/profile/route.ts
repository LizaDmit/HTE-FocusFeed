import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "user-1";

  const { prisma } = await import("@/lib/prisma");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, avatarUrl: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [courses, videos, friendships] = await Promise.all([
    prisma.course.findMany({
      where: { userId },
      include: { topics: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: { requester: true, addressee: true },
    }),
  ]);

  const friends = friendships.map((f) => {
    const friend = f.requesterId === userId ? f.addressee : f.requester;
    return { id: friend.id, username: friend.username, avatarUrl: friend.avatarUrl };
  });

  const coursesWithTopics = courses.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description || "",
    userId: c.userId,
    topics: c.topics.map((t) => t.name),
  }));

  return NextResponse.json({ user, courses: coursesWithTopics, videos, friends });
}
