"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import CustomizePanel from "@/components/feed/CustomizePanel";
import CourseSearchModal from "@/components/feed/CourseSearchModal";

export default function TopBar() {
  const [showCustomize, setShowCustomize] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[480px] flex items-center justify-between px-4 py-3 bg-gradient-to-b from-dark/90 to-transparent pointer-events-none">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowSearch(true)}
          className="pointer-events-auto backdrop-blur-sm"
        >
          Add Course
        </Button>
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
