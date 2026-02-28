"use client";

import { IoEllipsisHorizontal, IoTrashOutline } from "react-icons/io5";
import Link from "next/link";

interface Course {
  id: string;
  name: string;
  description: string;
  userId: string;
  topics: string[];
}

interface CourseListProps {
  courses: Course[];
  editable?: boolean;
}

export default function CourseList({ courses, editable = false }: CourseListProps) {
  const handleDelete = async (id: string) => {
    await fetch(`/api/courses/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  if (courses.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No courses yet</p>;
  }

  return (
    <div className="space-y-2 p-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="p-4 bg-dark-card rounded-xl border border-dark-border flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-white">{course.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{course.topics.length} topics</p>
          </div>
          {editable && (
            <div className="flex items-center gap-2">
              <Link
                href={`/create/course?edit=${course.id}`}
                className="text-gray-400 hover:text-moonDust-lavender p-1"
              >
                <IoEllipsisHorizontal size={18} />
              </Link>
              <button
                onClick={() => handleDelete(course.id)}
                className="text-gray-400 hover:text-red-400 p-1"
              >
                <IoTrashOutline size={18} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
