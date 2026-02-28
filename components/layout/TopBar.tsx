"use client";

import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import CustomizePanel from "@/components/feed/CustomizePanel";
import CourseSearchModal from "@/components/feed/CourseSearchModal";

export default function TopBar() {
  const [showCustomize, setShowCustomize] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-dark/90 to-transparent pointer-events-none">
        <button
          onClick={() => setShowSearch(true)}
          className="pointer-events-auto w-9 h-9 rounded-full bg-dark-card/80 backdrop-blur-sm border border-dark-border flex items-center justify-center text-moonDust-lavender hover:text-moonDust-blue transition-colors"
        >
          <IoAddOutline size={20} />
        </button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowCustomize(true)}
          className="pointer-events-auto backdrop-blur-sm"
        >
          Customize
        </Button>
      </header>

      <CustomizePanel open={showCustomize} onClose={() => setShowCustomize(false)} />
      <CourseSearchModal open={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}
