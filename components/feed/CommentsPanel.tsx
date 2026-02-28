"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { getMockCommentsByVideo } from "@/lib/mock-data";
import { IoSendOutline, IoHeartOutline } from "react-icons/io5";

interface Props {
  open: boolean;
  onClose: () => void;
  videoId: string | null;
}

export default function CommentsPanel({ open, onClose, videoId }: Props) {
  const [newComment, setNewComment] = useState("");
  const comments = videoId ? getMockCommentsByVideo(videoId) : [];

  const handleSend = () => {
    if (!newComment.trim()) return;
    console.log("New comment:", videoId, newComment);
    setNewComment("");
  };

  return (
    <Modal open={open} onClose={onClose} title={`Comments (${comments.length})`} position="bottom">
      <div className="flex flex-col" style={{ height: "50vh" }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-moonDust-purple/30 flex items-center justify-center text-xs font-bold text-moonDust-purple shrink-0">
                  {c.user.username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-moonDust-lavender">@{c.user.username}</span>
                  </div>
                  <p className="text-sm text-white/90 mt-0.5">{c.text}</p>
                  <button className="flex items-center gap-1 mt-1 text-gray-400 hover:text-moonDust-blue text-xs">
                    <IoHeartOutline size={12} />
                    <span>{c.likesCount}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-dark-border p-3 flex gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Add a comment..."
            className="flex-1 bg-dark border border-dark-border rounded-full px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-moonDust-blue/50"
          />
          <button
            onClick={handleSend}
            disabled={!newComment.trim()}
            className="w-9 h-9 rounded-full bg-moonDust-blue flex items-center justify-center text-dark disabled:opacity-40"
          >
            <IoSendOutline size={16} />
          </button>
        </div>
      </div>
    </Modal>
  );
}
