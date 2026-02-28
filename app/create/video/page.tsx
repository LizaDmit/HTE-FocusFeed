"use client";

import { useState, useRef, useEffect } from "react";
import { IoCloudUploadOutline, IoCheckmarkCircle, IoArrowBack, IoChevronDown } from "react-icons/io5";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import Input from "@/components/ui/Input";

type Step = "upload" | "options" | "processing";
type VideoType = "SLICED_LECTURE" | "SLIDES_VOICEOVER" | "AI_TEACHER" | "OTHER";

interface CourseOption {
  id: string;
  name: string;
  topics: { name: string }[];
}

export default function CreateVideoPage() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [duration, setDuration] = useState(0);

  const [sliceVideo, setSliceVideo] = useState(false);
  const [generateSubtitles, setGenerateSubtitles] = useState(true);
  const [videoType, setVideoType] = useState<VideoType>("SLICED_LECTURE");
  const [aiPhoto, setAiPhoto] = useState<File | null>(null);
  const [voiceDescription, setVoiceDescription] = useState("");
  const [autoQuiz, setAutoQuiz] = useState(true);
  const [title, setTitle] = useState("");

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);

  const [processProgress, setProcessProgress] = useState(0);

  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id || "user-1";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => setCourses(data))
      .catch(() => {});
  }, []);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const courseTopics = selectedCourse?.topics?.map((t) => t.name) || [];

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedTopics([]);
    setCourseDropdownOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);

    const objectUrl = URL.createObjectURL(selected);
    setBlobUrl(objectUrl);

    const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    setTitle(nameWithoutExt);

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      setDuration(Math.floor(video.duration));
      if (video.duration > 180) setSliceVideo(true);
    };
    video.src = objectUrl;

    simulateUpload();
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploaded(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const canContinue =
    step === "upload" ? uploaded :
    step === "options" ? !!selectedCourseId && !!title.trim() :
    false;

  const handleContinue = () => {
    if (step === "upload" && uploaded) setStep("options");
    else if (step === "options" && selectedCourseId) {
      setStep("processing");
      simulateProcessing();
    }
  };

  const simulateProcessing = () => {
    setProcessProgress(0);
    const interval = setInterval(() => {
      setProcessProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          fetch("/api/videos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: title || file?.name || "Uploaded Video",
              videoUrl: blobUrl || "/sample-videos/sample1.mp4",
              userId: currentUserId,
              courseId: selectedCourseId,
              type: videoType,
              duration: duration || 30,
            }),
          }).catch(() => {});
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 500);
  };

  const videoTypes: { id: VideoType; label: string; desc: string }[] = [
    { id: "SLICED_LECTURE", label: "Sliced Lecture", desc: "Clip from input video" },
    { id: "SLIDES_VOICEOVER", label: "Slides + Voiceover", desc: "Slides with generated voice" },
    { id: "AI_TEACHER", label: "AI Teacher", desc: "AI-generated teacher video" },
    { id: "OTHER", label: "Other", desc: "Uploaded as is" },
  ];

  return (
    <div className="min-h-[100dvh] px-4 py-6 max-w-md mx-auto overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/create" className="text-gray-400 hover:text-white">
          <IoArrowBack size={22} />
        </Link>
        <h1 className="text-xl font-bold text-moonDust-lavender">Create Video</h1>
      </div>

      <div className="flex gap-1 mb-8">
        {(["upload", "options", "processing"] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full ${
              i <= ["upload", "options", "processing"].indexOf(step) ? "bg-moonDust-blue" : "bg-dark-border"
            }`}
          />
        ))}
      </div>

      {step === "upload" && (
        <div className="space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          {!file ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[9/10] rounded-2xl border-2 border-dashed border-dark-border hover:border-moonDust-blue/50 bg-dark-card flex flex-col items-center justify-center gap-4 transition-colors"
            >
              <IoCloudUploadOutline size={48} className="text-moonDust-blue/60" />
              <div className="text-center">
                <p className="text-white font-medium">Upload Video</p>
                <p className="text-sm text-gray-400 mt-1">MP4, MOV, or WebM</p>
              </div>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
                <div className="flex items-center gap-3">
                  {uploaded ? (
                    <IoCheckmarkCircle size={24} className="text-green-400" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-moonDust-blue border-t-transparent rounded-full animate-spin" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {duration > 0 && `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")} • `}
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                {!uploaded && (
                  <div className="mt-3 h-1.5 bg-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-moonDust-blue rounded-full transition-all duration-200"
                      style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <Button onClick={handleContinue} disabled={!canContinue} className="w-full" size="lg">
            Continue
          </Button>
        </div>
      )}

      {step === "options" && (
        <div className="space-y-6">
          <Input
            label="Video Title"
            placeholder="Name your video..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Course selector (required) */}
          <section>
            <p className="text-sm font-semibold text-moonDust-purple mb-2">
              Course <span className="text-red-400">*</span>
            </p>
            <div className="relative">
              <button
                onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
                className={`w-full p-3 rounded-xl border text-left text-sm flex items-center justify-between transition-colors ${
                  selectedCourseId
                    ? "border-moonDust-blue bg-moonDust-blue/10 text-white"
                    : "border-dark-border bg-dark-card text-gray-400"
                }`}
              >
                <span>{selectedCourse?.name || "Select a course..."}</span>
                <IoChevronDown size={16} className={`transition-transform ${courseDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {courseDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-dark-border bg-dark-card shadow-lg">
                  {courses.length === 0 ? (
                    <p className="p-3 text-sm text-gray-400">No courses yet. Create one first.</p>
                  ) : (
                    courses.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleCourseSelect(c.id)}
                        className={`w-full p-3 text-left text-sm hover:bg-moonDust-blue/10 transition-colors ${
                          c.id === selectedCourseId ? "text-moonDust-blue font-medium" : "text-white"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Topic multi-select (only if course has topics) */}
          {selectedCourseId && courseTopics.length > 0 && (
            <section>
              <p className="text-sm font-semibold text-moonDust-purple mb-2">Topics</p>
              <div className="relative">
                <button
                  onClick={() => setTopicDropdownOpen(!topicDropdownOpen)}
                  className="w-full p-3 rounded-xl border border-dark-border bg-dark-card text-left text-sm flex items-center justify-between transition-colors"
                >
                  <span className={selectedTopics.length > 0 ? "text-white" : "text-gray-400"}>
                    {selectedTopics.length > 0
                      ? `${selectedTopics.length} topic${selectedTopics.length > 1 ? "s" : ""} selected`
                      : "Select topics (optional)"}
                  </span>
                  <IoChevronDown size={16} className={`text-gray-400 transition-transform ${topicDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {topicDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-dark-border bg-dark-card shadow-lg">
                    {courseTopics.map((topic) => {
                      const isSelected = selectedTopics.includes(topic);
                      return (
                        <button
                          key={topic}
                          onClick={() => toggleTopic(topic)}
                          className={`w-full p-3 text-left text-sm flex items-center gap-2 hover:bg-moonDust-blue/10 transition-colors ${
                            isSelected ? "text-moonDust-blue" : "text-white"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-moonDust-blue border-moonDust-blue" : "border-gray-500"
                          }`}>
                            {isSelected && <span className="text-[10px] text-dark font-bold">✓</span>}
                          </div>
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {selectedTopics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedTopics.map((t) => (
                    <span
                      key={t}
                      onClick={() => toggleTopic(t)}
                      className="px-2.5 py-1 rounded-full bg-moonDust-blue/15 text-moonDust-blue text-xs cursor-pointer hover:bg-moonDust-blue/25 transition-colors"
                    >
                      {t} ×
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {duration > 180 && (
            <div className="p-4 rounded-xl bg-moonDust-blue/10 border border-moonDust-blue/20">
              <Toggle enabled={sliceVideo} onChange={setSliceVideo} label="Slice Video" />
              <p className="text-xs text-gray-400 mt-2 ml-14">
                Your video is over 3 minutes. It will be automatically split into shorter clips for better engagement.
              </p>
            </div>
          )}

          <Toggle enabled={generateSubtitles} onChange={setGenerateSubtitles} label="Generate Subtitles" />

          <section>
            <p className="text-sm font-semibold text-moonDust-purple mb-3">Video Type</p>
            <div className="space-y-2">
              {videoTypes.map((vt) => (
                <button
                  key={vt.id}
                  onClick={() => setVideoType(vt.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-colors ${
                    videoType === vt.id
                      ? "border-moonDust-blue bg-moonDust-blue/10"
                      : "border-dark-border bg-dark-card hover:border-dark-border/80"
                  }`}
                >
                  <p className="text-sm text-white font-medium">{vt.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{vt.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {videoType === "AI_TEACHER" && (
            <section className="space-y-3">
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setAiPhoto(e.target.files?.[0] || null)} />
              <Button variant="secondary" size="sm" onClick={() => photoInputRef.current?.click()}>
                {aiPhoto ? `Photo: ${aiPhoto.name}` : "Upload Reference Photo (Optional)"}
              </Button>
              <Input
                label="Describe the voice"
                placeholder="e.g., Warm, professional female voice..."
                value={voiceDescription}
                onChange={(e) => setVoiceDescription(e.target.value)}
              />
            </section>
          )}

          <Toggle enabled={autoQuiz} onChange={setAutoQuiz} label="Auto-generate Quizzes" />

          <Button onClick={handleContinue} disabled={!canContinue} className="w-full" size="lg">
            Start Processing
          </Button>
        </div>
      )}

      {step === "processing" && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#2a2a3e" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none" stroke="#80A8FF" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${Math.min(processProgress, 100) * 2.83} 283`}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-moonDust-blue">
              {Math.min(Math.floor(processProgress), 100)}%
            </span>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">Processing your video...</p>
            <p className="text-sm text-gray-400 mt-1">
              {processProgress < 30 ? "Transcribing audio..." :
               processProgress < 60 ? "Segmenting topics..." :
               processProgress < 85 ? "Generating content..." :
               processProgress < 100 ? "Finalizing..." : "Complete!"}
            </p>
          </div>
          {processProgress >= 100 && (
            <Link href="/feed">
              <Button size="lg">View in Feed</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
