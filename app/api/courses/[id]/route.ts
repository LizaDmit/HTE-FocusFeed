import { NextResponse } from "next/server";
import { mockCourses } from "@/lib/mock-data";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  if (process.env.USE_MOCK_DATA === "true") {
    const course = mockCourses.find((c) => c.id === params.id);
    if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(course);
  }

  const { prisma } = await import("@/lib/prisma");
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: { topics: { orderBy: { order: "asc" } }, user: true },
  });
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(course);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ id: params.id, ...body });
  }

  const { prisma } = await import("@/lib/prisma");
  const course = await prisma.course.update({ where: { id: params.id }, data: body });
  return NextResponse.json(course);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ deleted: true });
  }

  const { prisma } = await import("@/lib/prisma");
  await prisma.course.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}
