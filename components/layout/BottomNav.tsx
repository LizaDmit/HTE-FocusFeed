"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IoHomeOutline, IoHome, IoAddCircleOutline, IoAddCircle, IoChatbubbleOutline, IoChatbubble, IoPersonOutline, IoPerson } from "react-icons/io5";

const tabs = [
  { href: "/feed", label: "Feed", icon: IoHomeOutline, activeIcon: IoHome },
  { href: "/create", label: "Create", icon: IoAddCircleOutline, activeIcon: IoAddCircle },
  { href: "/messages", label: "Messages", icon: IoChatbubbleOutline, activeIcon: IoChatbubble },
  { href: "/profile", label: "Profile", icon: IoPersonOutline, activeIcon: IoPerson },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { status } = useSession();

  if (status !== "authenticated") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-card/95 backdrop-blur-md border-t border-dark-border safe-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = isActive ? tab.activeIcon : tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
                isActive ? "text-moonDust-blue" : "text-gray-400 hover:text-moonDust-lavender"
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
