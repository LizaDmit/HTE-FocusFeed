"use client";

import Link from "next/link";
import { IoVideocamOutline, IoBookOutline } from "react-icons/io5";

export default function CreatePage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 gap-6">
      <h1 className="text-2xl font-bold text-moonDust-lavender mb-4">Create</h1>

      <Link
        href="/create/video"
        className="w-full max-w-sm p-8 rounded-2xl border border-dark-border bg-dark-card hover:border-moonDust-blue/50 transition-all flex flex-col items-center gap-4 group"
      >
        <div className="w-16 h-16 rounded-2xl bg-moonDust-blue/10 flex items-center justify-center group-hover:bg-moonDust-blue/20 transition-colors">
          <IoVideocamOutline size={32} className="text-moonDust-blue" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-white">Create Video</p>
          <p className="text-sm text-gray-400 mt-1">Upload and process educational video content</p>
        </div>
      </Link>

      <Link
        href="/create/course"
        className="w-full max-w-sm p-8 rounded-2xl border border-dark-border bg-dark-card hover:border-moonDust-purple/50 transition-all flex flex-col items-center gap-4 group"
      >
        <div className="w-16 h-16 rounded-2xl bg-moonDust-purple/10 flex items-center justify-center group-hover:bg-moonDust-purple/20 transition-colors">
          <IoBookOutline size={32} className="text-moonDust-purple" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-white">Create Course</p>
          <p className="text-sm text-gray-400 mt-1">Organize topics and build a course structure</p>
        </div>
      </Link>
    </div>
  );
}
