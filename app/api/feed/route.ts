import { NextResponse } from "next/server";
import { getMockFeed } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  if (process.env.USE_MOCK_DATA === "true") {
    const feed = getMockFeed();
    const start = (page - 1) * limit;
    const items = feed.slice(start, start + limit);
    return NextResponse.json({ items, page, totalItems: feed.length });
  }

  return NextResponse.json({ items: [], page, totalItems: 0 });
}
