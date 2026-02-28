"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import FeedContainer from "@/components/feed/FeedContainer";
import TopBar from "@/components/layout/TopBar";
import { getMockFeed, mockUsers, mockCourses, FeedItem } from "@/lib/mock-data";
import { useFeedStore } from "@/lib/stores/feed-store";

function FeedContent() {
  const searchParams = useSearchParams();
  const startVideoId = searchParams.get("videoId") || searchParams.get("startVideo");

  const userVideos = useFeedStore((s) => s.userVideos);

  const feed = useMemo(() => {
    const baseFeed = getMockFeed();

    const userFeedItems: FeedItem[] = userVideos.map((v) => ({
      type: "video" as const,
      data: {
        ...v,
        videoUrl: v.blobUrl || v.videoUrl,
        user: mockUsers.find((u) => u.id === v.userId) || { id: v.userId, username: "you", avatarUrl: null },
        course: mockCourses.find((c) => c.id === v.courseId) || { id: v.courseId, name: "My Course", description: "", userId: v.userId, topics: [] },
        likesCount: 0,
        commentsCount: 0,
      },
    }));

    return [...userFeedItems, ...baseFeed];
  }, [userVideos]);

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
