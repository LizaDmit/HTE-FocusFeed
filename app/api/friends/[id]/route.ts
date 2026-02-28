import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { status } = await request.json();

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ id: params.id, status });
  }

  const { prisma } = await import("@/lib/prisma");
  const friendship = await prisma.friendship.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json(friendship);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({ deleted: true });
  }

  const { prisma } = await import("@/lib/prisma");
  await prisma.friendship.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}
