"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { usePreferences } from "@/lib/stores/preferences";
import { IoAddOutline, IoCheckmarkOutline } from "react-icons/io5";

interface Course {
  id: string;
  name: string;
  topics: { name: string }[] | string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CourseSearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const { courses: addedCourses, addCourse } = usePreferences();
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => setAllCourses(data))
      .catch(() => {});
  }, [open]);

  const results = query.trim()
    ? allCourses.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : allCourses;

  const isAdded = (id: string) => addedCourses.some((c) => c.id === id);

  const getTopicCount = (course: Course) => {
    if (!course.topics) return 0;
    return course.topics.length;
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Course to Feed" position="bottom">
      <div className="p-5 space-y-4">
        <Input
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No courses found</p>
          ) : (
            results.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 bg-dark rounded-xl border border-dark-border"
              >
                <div>
                  <p className="text-sm text-white font-medium">{course.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{getTopicCount(course)} topics</p>
                </div>
                {isAdded(course.id) ? (
                  <span className="text-moonDust-blue">
                    <IoCheckmarkOutline size={20} />
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addCourse({ id: course.id, name: course.name })}
                  >
                    <IoAddOutline size={18} />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
