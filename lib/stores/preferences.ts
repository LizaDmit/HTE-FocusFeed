"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type VideoLength = "short" | "medium" | "long";
export type ContentType = "SLICED_LECTURE" | "SLIDES_VOICEOVER" | "AI_TEACHER" | "OTHER" | "QUIZ";

interface CourseEntry {
  id: string;
  name: string;
  visible: boolean;
}

interface PreferencesState {
  videoLength: VideoLength[];
  contentTypes: ContentType[];
  courses: CourseEntry[];
  feedMuted: boolean;

  toggleVideoLength: (len: VideoLength) => void;
  toggleContentType: (ct: ContentType) => void;
  addCourse: (course: { id: string; name: string }) => void;
  removeCourse: (id: string) => void;
  toggleCourseVisibility: (id: string) => void;
  setFeedMuted: (muted: boolean) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      videoLength: ["short", "medium", "long"],
      contentTypes: ["SLICED_LECTURE", "SLIDES_VOICEOVER", "AI_TEACHER", "OTHER", "QUIZ"],
      courses: [],
      feedMuted: false,

      toggleVideoLength: (len) =>
        set((s) => ({
          videoLength: s.videoLength.includes(len)
            ? s.videoLength.filter((l) => l !== len)
            : [...s.videoLength, len],
        })),

      toggleContentType: (ct) =>
        set((s) => ({
          contentTypes: s.contentTypes.includes(ct)
            ? s.contentTypes.filter((c) => c !== ct)
            : [...s.contentTypes, ct],
        })),

      addCourse: (course) =>
        set((s) => {
          if (s.courses.find((c) => c.id === course.id)) return s;
          return { courses: [...s.courses, { ...course, visible: true }] };
        }),

      removeCourse: (id) =>
        set((s) => ({ courses: s.courses.filter((c) => c.id !== id) })),

      toggleCourseVisibility: (id) =>
        set((s) => ({
          courses: s.courses.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)),
        })),

      setFeedMuted: (muted) => set({ feedMuted: muted }),
    }),
    { name: "focusfeed-preferences" }
  )
);
