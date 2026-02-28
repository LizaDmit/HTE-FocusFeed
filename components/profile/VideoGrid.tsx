"use client";

import Link from "next/link";
import { MockVideo } from "@/lib/mock-data";
import { IoPlayOutline } from "react-icons/io5";

interface VideoGridProps {
  videos: MockVideo[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No videos yet</p>;
  }

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="grid grid-cols-3 gap-1 p-1">
      {videos.map((video) => (
        <Link
          key={video.id}
          href={`/feed?startVideo=${video.id}`}
          className="relative aspect-[9/16] bg-dark-card rounded-lg overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-moonDust-purple/20 to-moonDust-blue/20 flex items-center justify-center">
            <IoPlayOutline size={24} className="text-white/60 group-hover:text-white transition-colors" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60">
            <p className="text-[10px] text-white truncate">{video.title}</p>
            <p className="text-[9px] text-gray-300">{formatDuration(video.duration)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
