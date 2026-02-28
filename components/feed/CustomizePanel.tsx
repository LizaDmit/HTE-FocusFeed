"use client";

import Modal from "@/components/ui/Modal";
import Toggle from "@/components/ui/Toggle";
import { usePreferences, VideoLength, ContentType } from "@/lib/stores/preferences";
import { IoTrashOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const VIDEO_LENGTHS: { id: VideoLength; label: string; desc: string }[] = [
  { id: "short", label: "Short", desc: "< 30s" },
  { id: "medium", label: "Medium", desc: "30–50s" },
  { id: "long", label: "Long", desc: "> 50s" },
];

const CONTENT_TYPES: { id: ContentType; label: string }[] = [
  { id: "SLICED_LECTURE", label: "Sliced Lecture" },
  { id: "SLIDES_VOICEOVER", label: "Slides + Voice" },
  { id: "AI_TEACHER", label: "AI Teacher" },
  { id: "OTHER", label: "Other" },
  { id: "QUIZ", label: "Quizzes" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CustomizePanel({ open, onClose }: Props) {
  const { videoLength, contentTypes, courses, toggleVideoLength, toggleContentType, removeCourse, toggleCourseVisibility } =
    usePreferences();

  return (
    <Modal open={open} onClose={onClose} title="Customize Feed" position="bottom">
      <div className="p-5 space-y-6">
        <section>
          <h4 className="text-sm font-semibold text-moonDust-purple mb-3">Video Length</h4>
          <div className="space-y-2">
            {VIDEO_LENGTHS.map((vl) => (
              <Toggle
                key={vl.id}
                enabled={videoLength.includes(vl.id)}
                onChange={() => toggleVideoLength(vl.id)}
                label={`${vl.label} (${vl.desc})`}
              />
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-moonDust-purple mb-3">Content Types</h4>
          <div className="space-y-2">
            {CONTENT_TYPES.map((ct) => (
              <Toggle
                key={ct.id}
                enabled={contentTypes.includes(ct.id)}
                onChange={() => toggleContentType(ct.id)}
                label={ct.label}
              />
            ))}
          </div>
        </section>

        {courses.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold text-moonDust-purple mb-3">Your Courses</h4>
            <div className="space-y-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 bg-dark rounded-xl border border-dark-border"
                >
                  <span className={`text-sm ${course.visible ? "text-white" : "text-gray-500"}`}>
                    {course.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCourseVisibility(course.id)}
                      className="text-gray-400 hover:text-moonDust-lavender p-1"
                    >
                      {course.visible ? <IoEyeOutline size={16} /> : <IoEyeOffOutline size={16} />}
                    </button>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="text-gray-400 hover:text-red-400 p-1"
                    >
                      <IoTrashOutline size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}
