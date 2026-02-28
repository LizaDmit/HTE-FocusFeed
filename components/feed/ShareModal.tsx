"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { getMockFriends } from "@/lib/mock-data";
import { IoLinkOutline, IoCheckmarkOutline, IoSendOutline } from "react-icons/io5";

interface Props {
  open: boolean;
  onClose: () => void;
  videoId: string | null;
}

export default function ShareModal({ open, onClose, videoId }: Props) {
  const [copied, setCopied] = useState(false);
  const currentUserId = "user-1";
  const friends = getMockFriends(currentUserId);

  const copyLink = () => {
    const url = `${window.location.origin}/feed?videoId=${videoId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const sendToFriend = (friendId: string) => {
    console.log("Share video", videoId, "to friend", friendId);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Share" position="bottom">
      <div className="p-4 space-y-4">
        <button
          onClick={copyLink}
          className="w-full p-4 rounded-xl border border-dark-border bg-dark text-sm text-white hover:border-moonDust-blue/50 transition-colors flex items-center gap-3"
        >
          {copied ? <IoCheckmarkOutline size={20} className="text-green-400" /> : <IoLinkOutline size={20} className="text-moonDust-blue" />}
          {copied ? "Link copied!" : "Copy link"}
        </button>

        {friends.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Send to friend</p>
            <div className="space-y-2">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => sendToFriend(friend.id)}
                  className="w-full p-3 rounded-xl border border-dark-border bg-dark text-sm text-white hover:border-moonDust-blue/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-moonDust-sky/30 flex items-center justify-center text-xs font-bold text-moonDust-sky">
                      {friend.username[0].toUpperCase()}
                    </div>
                    <span>@{friend.username}</span>
                  </div>
                  <IoSendOutline size={16} className="text-moonDust-blue" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
