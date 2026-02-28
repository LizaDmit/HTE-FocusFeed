import { NextResponse } from "next/server";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ id: params.id, liked: true });
  }

  const { prisma } = await import("@/lib/prisma");
  const comment = await prisma.comment.update({
    where: { id: params.id },
    data: { likesCount: { increment: 1 } },
  });
  return NextResponse.json(comment);
}
