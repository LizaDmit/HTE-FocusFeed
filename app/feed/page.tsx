"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FeedContainer from "@/components/feed/FeedContainer";
import TopBar from "@/components/layout/TopBar";
import { FeedItem } from "@/lib/mock-data";

function FeedContent() {
  const searchParams = useSearchParams();
  const startVideoId = searchParams.get("videoId") || searchParams.get("startVideo");

  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feed?limit=50")
      .then((res) => res.json())
      .then((data) => setFeed(data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-[100dvh] bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-moonDust-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const startIndex = startVideoId
    ? Math.max(0, feed.findIndex((item) => item.type === "video" && item.data.id === startVideoId))
    : 0;

  return <FeedContainer items={feed} startIndex={startIndex} />;
}

export default function FeedPage() {
  return (
    <div className="relative h-[100dvh] overflow-hidden">
      <TopBar />
      <Suspense fallback={<div className="h-[100dvh] bg-dark flex items-center justify-center"><div className="w-8 h-8 border-2 border-moonDust-blue border-t-transparent rounded-full animate-spin" /></div>}>
        <FeedContent />
      </Suspense>
    </div>
  );
}
