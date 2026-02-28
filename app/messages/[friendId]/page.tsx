"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/profile/Avatar";
import { mockUsers, getMockConversations, mockVideos, MockMessage } from "@/lib/mock-data";
import { IoArrowBack, IoSendOutline, IoPlayCircleOutline } from "react-icons/io5";

const CURRENT_USER_ID = "user-1";

export default function ChatPage() {
  const params = useParams();
  const friendId = params.friendId as string;
  const friend = mockUsers.find((u) => u.id === friendId);
  const conversations = getMockConversations(CURRENT_USER_ID);
  const convo = conversations.find((c) => c.friend.id === friendId);

  const [messages, setMessages] = useState<MockMessage[]>(
    convo?.messages.slice().reverse() || []
  );
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!friend) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <p className="text-gray-400">User not found</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    const msg: MockMessage = {
      id: `msg-new-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      receiverId: friendId,
      text: text.trim(),
      sharedVideoId: null,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-dark-border bg-dark-card/80 backdrop-blur-md shrink-0">
        <Link href="/messages" className="text-gray-400 hover:text-white">
          <IoArrowBack size={22} />
        </Link>
        <Link href={`/profile/${friend.id}`} className="flex items-center gap-2">
          <Avatar username={friend.username} size="sm" />
          <span className="text-sm font-semibold text-white">@{friend.username}</span>
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId === CURRENT_USER_ID;
          const sharedVideo = msg.sharedVideoId
            ? mockVideos.find((v) => v.id === msg.sharedVideoId)
            : null;

          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isMine
                    ? "bg-moonDust-blue text-dark rounded-br-sm"
                    : "bg-dark-card border border-dark-border text-white rounded-bl-sm"
                }`}
              >
                {msg.text && <p>{msg.text}</p>}
                {sharedVideo && (
                  <Link
                    href={`/feed?videoId=${sharedVideo.id}`}
                    className={`mt-1 flex items-center gap-2 p-2 rounded-lg ${
                      isMine ? "bg-black/10" : "bg-dark border border-dark-border"
                    }`}
                  >
                    <IoPlayCircleOutline size={20} className={isMine ? "text-dark" : "text-moonDust-blue"} />
                    <span className="text-xs truncate">{sharedVideo.title}</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-dark-border p-3 flex gap-2 bg-dark-card/80 backdrop-blur-md shrink-0 safe-bottom">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Message..."
          className="flex-1 bg-dark border border-dark-border rounded-full px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-moonDust-blue/50"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-10 h-10 rounded-full bg-moonDust-blue flex items-center justify-center text-dark disabled:opacity-40 shrink-0"
        >
          <IoSendOutline size={18} />
        </button>
      </div>
    </div>
  );
}
