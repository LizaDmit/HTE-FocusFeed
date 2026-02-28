"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Avatar from "./Avatar";
import { mockUsers } from "@/lib/mock-data";
import { IoAddOutline, IoCheckmarkOutline } from "react-icons/io5";

interface FriendSearchProps {
  currentUserId: string;
  friendIds: string[];
}

export default function FriendSearch({ currentUserId, friendIds }: FriendSearchProps) {
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<string[]>([]);

  const results = query.trim()
    ? mockUsers.filter(
        (u) => u.id !== currentUserId && u.username.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const noResults = query.trim().length > 0 && results.length === 0;

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {noResults && (
        <p className="text-sm text-gray-400 text-center py-4">The user does not exist.</p>
      )}

      {results.map((user) => {
        const isFriend = friendIds.includes(user.id);
        const justAdded = added.includes(user.id);
        return (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-dark-card rounded-xl border border-dark-border"
          >
            <div className="flex items-center gap-3">
              <Avatar username={user.username} size="sm" />
              <span className="text-sm text-white">@{user.username}</span>
            </div>
            {isFriend || justAdded ? (
              <span className="text-moonDust-blue text-xs flex items-center gap-1">
                <IoCheckmarkOutline size={14} />
                {isFriend ? "Friends" : "Sent"}
              </span>
            ) : (
              <button
                onClick={() => setAdded((prev) => [...prev, user.id])}
                className="text-moonDust-blue hover:text-moonDust-lavender p-1"
              >
                <IoAddOutline size={20} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
