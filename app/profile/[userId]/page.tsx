"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Avatar from "@/components/profile/Avatar";
import CourseList from "@/components/profile/CourseList";
import VideoGrid from "@/components/profile/VideoGrid";
import Tabs from "@/components/ui/Tabs";
import Button from "@/components/ui/Button";
import { IoArrowBack, IoPersonAddOutline, IoCheckmarkOutline } from "react-icons/io5";
import Link from "next/link";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id || "user-1";

  const [user, setUser] = useState<{ id: string; username: string; avatarUrl: string | null } | null>(null);
  const [courses, setCourses] = useState<{ id: string; name: string; description: string; userId: string; topics: string[] }[]>([]);
  const [videos, setVideos] = useState<{ id: string; title: string; videoUrl: string; thumbnailUrl: string | null; userId: string; courseId: string | null; type: string; duration: number }[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("courses");
  const [friendAdded, setFriendAdded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/profile?userId=${userId}`).then((r) => r.json()),
      fetch(`/api/friends?userId=${currentUserId}`).then((r) => r.json()),
    ])
      .then(([profileData, friendsData]) => {
        setUser(profileData.user);
        setCourses(profileData.courses || []);
        setVideos(profileData.videos || []);
        setFriends(friendsData.map((f: { id: string }) => f.id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId, currentUserId]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-moonDust-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <p className="text-gray-400">User not found</p>
      </div>
    );
  }

  const isFriend = friends.includes(userId);

  const handleAddFriend = async () => {
    setFriendAdded(true);
    await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requesterId: currentUserId, addresseeId: userId }),
    }).catch(() => {});
  };

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto">
      <div className="px-4 pt-4">
        <Link href="/profile" className="text-gray-400 hover:text-white">
          <IoArrowBack size={22} />
        </Link>
      </div>

      <div className="flex flex-col items-center pt-4 pb-4 px-4">
        <Avatar username={user.username} avatarUrl={user.avatarUrl} size="xl" />
        <h2 className="text-lg font-bold text-white mt-4">@{user.username}</h2>

        {!isFriend && userId !== currentUserId && (
          <Button
            variant={friendAdded ? "secondary" : "primary"}
            size="sm"
            className="mt-3"
            onClick={handleAddFriend}
            disabled={friendAdded}
          >
            {friendAdded ? (
              <><IoCheckmarkOutline size={16} className="mr-1" /> Request Sent</>
            ) : (
              <><IoPersonAddOutline size={16} className="mr-1" /> Add Friend</>
            )}
          </Button>
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
        <CourseList courses={courses} />
      ) : (
        <VideoGrid videos={videos} />
      )}
    </div>
  );
}
