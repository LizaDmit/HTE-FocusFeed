import { NextResponse } from "next/server";
import { mockCourses } from "@/lib/mock-data";

export async function GET() {
  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json(mockCourses);
  }

  const { prisma } = await import("@/lib/prisma");
  const courses = await prisma.course.findMany({
    include: { topics: { orderBy: { order: "asc" } }, user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  const { name, description, topics, userId } = await request.json();

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ id: `course-mock-${Date.now()}`, name, description, topics }, { status: 201 });
  }

  const { prisma } = await import("@/lib/prisma");
  const course = await prisma.course.create({
    data: {
      name,
      description,
      userId,
      topics: {
        create: (topics as string[]).map((t: string, i: number) => ({ name: t, order: i })),
      },
    },
    include: { topics: true },
  });

  await prisma.userCourse.create({
    data: { userId, courseId: course.id },
  });

  return NextResponse.json(course, { status: 201 });
}
