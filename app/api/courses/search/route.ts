import { NextResponse } from "next/server";
import { mockCourses } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (process.env.USE_MOCK_DATA === "true") {
    const results = query
      ? mockCourses.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      : mockCourses;
    return NextResponse.json(results);
  }

  const { prisma } = await import("@/lib/prisma");
  const courses = await prisma.course.findMany({
    where: { name: { contains: query, mode: "insensitive" } },
    include: { topics: { orderBy: { order: "asc" } } },
    take: 20,
  });
  return NextResponse.json(courses);
}
