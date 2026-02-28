import { NextResponse } from "next/server";
import { getMockConversations } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "user-1";

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json(getMockConversations(userId));
  }

  return NextResponse.json([]);
}
