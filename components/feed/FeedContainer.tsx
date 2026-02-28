"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import VideoReel from "./VideoReel";
import QuizCard from "./QuizCard";
import DislikeModal from "./DislikeModal";
import CommentsPanel from "./CommentsPanel";
import ShareModal from "./ShareModal";
import { FeedItem } from "@/lib/mock-data";

interface FeedContainerProps {
  items: FeedItem[];
  startIndex?: number;
}

export default function FeedContainer({ items, startIndex = 0 }: FeedContainerProps) {
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [dislikeVideoId, setDislikeVideoId] = useState<string | null>(null);
  const [commentVideoId, setCommentVideoId] = useState<string | null>(null);
  const [shareVideoId, setShareVideoId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollTop / container.clientHeight);
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (startIndex > 0 && containerRef.current) {
      containerRef.current.scrollTop = startIndex * containerRef.current.clientHeight;
    }
  }, [startIndex]);

  return (
    <>
      <div
        ref={containerRef}
        className="h-[100dvh] overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {items.map((item, idx) => {
          if (item.type === "video") {
            return (
              <VideoReel
                key={item.data.id}
                video={item.data}
                isActive={idx === activeIndex}
                onDislike={() => setDislikeVideoId(item.data.id)}
                onComment={() => setCommentVideoId(item.data.id)}
                onShare={() => setShareVideoId(item.data.id)}
              />
            );
          }
          return <QuizCard key={item.data.id} quiz={item.data} />;
        })}
      </div>

      <DislikeModal
        open={!!dislikeVideoId}
        onClose={() => setDislikeVideoId(null)}
        videoId={dislikeVideoId}
      />
      <CommentsPanel
        open={!!commentVideoId}
        onClose={() => setCommentVideoId(null)}
        videoId={commentVideoId}
      />
      <ShareModal
        open={!!shareVideoId}
        onClose={() => setShareVideoId(null)}
        videoId={shareVideoId}
      />
    </>
  );
}
