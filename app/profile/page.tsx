"use client";

import { useState, useEffect } from "react";
import Avatar from "@/components/profile/Avatar";
import FriendSearch from "@/components/profile/FriendSearch";
import CourseList from "@/components/profile/CourseList";
import VideoGrid from "@/components/profile/VideoGrid";
import Tabs from "@/components/ui/Tabs";
import { IoPencilOutline, IoPeopleOutline, IoChevronDownOutline, IoChevronUpOutline, IoLogOutOutline } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id || "user-1";

  const [user, setUser] = useState<{ id: string; username: string; avatarUrl: string | null } | null>(null);
  const [courses, setCourses] = useState<{ id: string; name: string; description: string; userId: string; topics: string[] }[]>([]);
  const [videos, setVideos] = useState<{ id: string; title: string; videoUrl: string; thumbnailUrl: string | null; userId: string; courseId: string | null; type: string; duration: number }[]>([]);
  const [friends, setFriends] = useState<{ id: string; username: string; avatarUrl: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("courses");
  const [showFriends, setShowFriends] = useState(false);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch(`/api/profile?userId=${currentUserId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setCourses(data.courses || []);
        setVideos(data.videos || []);
        setFriends(data.friends || []);
        setUsername(data.user?.username || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUserId]);

  const handleDeleteVideo = async (id: string) => {
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  if (loading || !user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-moonDust-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] max-w-md mx-auto overflow-y-auto pb-4">
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-card border border-red-500/30 text-sm text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-colors"
      >
        <IoLogOutOutline size={24} />
      </button>

      <div className="flex flex-col items-center pt-10 pb-4 px-4">
        <Avatar username={username} avatarUrl={user.avatarUrl} size="xl" />

        <div className="flex items-center gap-2 mt-4">
          {editing ? (
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
              autoFocus
              className="text-lg font-bold text-white bg-transparent border-b border-moonDust-blue focus:outline-none text-center"
            />
          ) : (
            <>
              <h2 className="text-lg font-bold text-white">@{username}</h2>
              <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-moonDust-blue">
                <IoPencilOutline size={16} />
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setShowFriends(!showFriends)}
          className="mt-3 flex items-center gap-2 px-4 py-2 rounded-full bg-dark-card border border-dark-border text-sm text-moonDust-lavender hover:border-moonDust-blue/50 transition-colors"
        >
          <IoPeopleOutline size={16} />
          Search Friends ({friends.length})
          {showFriends ? <IoChevronUpOutline size={14} /> : <IoChevronDownOutline size={14} />}
        </button>

        {showFriends && (
          <div className="w-full mt-4">
            <FriendSearch
              currentUserId={currentUserId}
              friendIds={friends.map((f) => f.id)}
            />
          </div>
        )}
      </div>

      <Tabs
        tabs={[
          { id: "courses", label: "Courses" },
          { id: "videos", label: "Videos" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "courses" ? (
        <CourseList courses={courses} editable />
      ) : (
        <VideoGrid videos={videos} onDelete={handleDeleteVideo} />
      )}
    </div>
  );
}
