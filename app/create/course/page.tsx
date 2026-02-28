"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { IoArrowBack, IoDocumentTextOutline, IoCheckmarkCircle } from "react-icons/io5";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TopicEditor from "@/components/create/TopicEditor";
import { mockCourses } from "@/lib/mock-data";
import { useFeedStore } from "@/lib/stores/feed-store";

function CreateCourseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const addCourse = useFeedStore((s) => s.addCourse);
  const updateCourse = useFeedStore((s) => s.updateCourse);
  const storeCourses = useFeedStore((s) => s.userCourses);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [syllabus, setSyllabus] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [created, setCreated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editId) return;

    const mockCourse = mockCourses.find((c) => c.id === editId);
    const userCourse = storeCourses.find((c) => c.id === editId);
    const course = userCourse || mockCourse;

    if (course) {
      setName(course.name);
      setDescription(course.description || "");
      setTopics([...course.topics]);
      setIsEditing(true);
    }
  }, [editId, storeCourses]);

  const handleSyllabusUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSyllabus(file);
    setExtracting(true);

    setTimeout(() => {
      setTopics((prev) => [
        ...prev,
        "Introduction and Overview",
        "Core Concepts",
        "Advanced Topics",
        "Practical Applications",
        "Review and Assessment",
      ]);
      setExtracting(false);
    }, 2000);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (isEditing && editId) {
      updateCourse(editId, { name, description, topics });
    } else {
      const newCourse = {
        id: `course-user-${Date.now()}`,
        name,
        description,
        userId: "user-1",
        topics,
      };
      addCourse(newCourse);
    }

    setCreated(true);
    setTimeout(() => router.push("/profile"), 1500);
  };

  return (
    <div className="min-h-[100dvh] px-4 py-6 max-w-md mx-auto overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={isEditing ? "/profile" : "/create"} className="text-gray-400 hover:text-white">
          <IoArrowBack size={22} />
        </Link>
        <h1 className="text-xl font-bold text-moonDust-lavender">
          {isEditing ? "Edit Course" : "Create Course"}
        </h1>
      </div>

      {created ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <IoCheckmarkCircle size={64} className="text-green-400" />
          <p className="text-lg font-semibold text-white">
            {isEditing ? "Course Updated!" : "Course Created!"}
          </p>
          <p className="text-sm text-gray-400">Redirecting...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Input
            label="Course Name"
            placeholder="e.g., Introduction to Biology"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-moonDust-lavender/80 font-medium">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the course..."
              rows={3}
              className="w-full px-4 py-2.5 bg-dark border border-dark-border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-moonDust-blue/50 focus:ring-1 focus:ring-moonDust-blue/30 transition-colors resize-none text-sm"
            />
          </div>

          {!isEditing && (
            <div>
              <label className="text-sm text-moonDust-lavender/80 font-medium block mb-2">
                Upload Syllabus (optional)
              </label>
              <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleSyllabusUpload} />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={extracting}
                className="w-full p-4 rounded-xl border border-dashed border-dark-border bg-dark-card hover:border-moonDust-purple/50 transition-colors flex items-center gap-3"
              >
                {extracting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-moonDust-purple border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Extracting topics from PDF...</span>
                  </>
                ) : syllabus ? (
                  <>
                    <IoDocumentTextOutline size={20} className="text-moonDust-purple" />
                    <span className="text-sm text-white">{syllabus.name}</span>
                  </>
                ) : (
                  <>
                    <IoDocumentTextOutline size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-400">Upload PDF to auto-extract topics</span>
                  </>
                )}
              </button>
            </div>
          )}

          <TopicEditor topics={topics} onChange={setTopics} />

          <Button onClick={handleSave} disabled={!name.trim()} className="w-full" size="lg">
            {isEditing ? "Save Changes" : "Create Course"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CreateCoursePage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-moonDust-blue border-t-transparent rounded-full animate-spin" /></div>}>
      <CreateCourseForm />
    </Suspense>
  );
}
