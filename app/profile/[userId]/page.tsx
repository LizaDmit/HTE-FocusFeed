"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Avatar from "@/components/profile/Avatar";
import CourseList from "@/components/profile/CourseList";
import VideoGrid from "@/components/profile/VideoGrid";
import Tabs from "@/components/ui/Tabs";
import Button from "@/components/ui/Button";
import { mockUsers, getMockCoursesByUser, getMockVideosByUser, mockFriendships } from "@/lib/mock-data";
import { IoArrowBack, IoPersonAddOutline, IoCheckmarkOutline } from "react-icons/io5";
import Link from "next/link";

const CURRENT_USER_ID = "user-1";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const user = mockUsers.find((u) => u.id === userId);
  const [activeTab, setActiveTab] = useState("courses");
  const [friendAdded, setFriendAdded] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <p className="text-gray-400">User not found</p>
      </div>
    );
  }

  const courses = getMockCoursesByUser(userId);
  const videos = getMockVideosByUser(userId);
  const isFriend = mockFriendships.some(
    (f) =>
      f.status === "ACCEPTED" &&
      ((f.requesterId === CURRENT_USER_ID && f.addresseeId === userId) ||
        (f.addresseeId === CURRENT_USER_ID && f.requesterId === userId))
  );

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

        {!isFriend && userId !== CURRENT_USER_ID && (
          <Button
            variant={friendAdded ? "secondary" : "primary"}
            size="sm"
            className="mt-3"
            onClick={() => setFriendAdded(true)}
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
