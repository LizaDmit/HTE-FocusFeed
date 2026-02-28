import { NextResponse } from "next/server";
import { mockVideos } from "@/lib/mock-data";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  if (process.env.USE_MOCK_DATA === "true") {
    const video = mockVideos.find((v) => v.id === params.id);
    if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(video);
  }

  const { prisma } = await import("@/lib/prisma");
  const video = await prisma.video.findUnique({
    where: { id: params.id },
    include: { user: true, course: true, quizzes: true },
  });
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(video);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ id: params.id, ...body });
  }

  const { prisma } = await import("@/lib/prisma");
  const video = await prisma.video.update({ where: { id: params.id }, data: body });
  return NextResponse.json(video);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ deleted: true });
  }

  const { prisma } = await import("@/lib/prisma");
  await prisma.video.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}
