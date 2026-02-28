"use client";

import { useState } from "react";
import Link from "next/link";
import type { MockQuiz, MockCourse } from "@/lib/mock-data";

interface QuizCardProps {
  quiz: MockQuiz & { course: MockCourse };
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  return (
    <div className="h-[100dvh] w-full snap-start flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f1a]">
      <div className="w-full max-w-sm mx-4 space-y-6">
        <div className="text-center">
          <p className="text-xs text-moonDust-sky font-medium uppercase tracking-wider mb-2">Quiz</p>
          <p className="text-moonDust-lavender/60 text-xs">{quiz.course.name}</p>
        </div>

        <h2 className="text-lg font-semibold text-white text-center leading-relaxed px-2">
          {quiz.question}
        </h2>

        <div className="space-y-3">
          {quiz.options.map((option, idx) => {
            let style = "border-dark-border bg-dark-card/50 text-white hover:border-moonDust-blue/50";
            if (answered) {
              if (idx === quiz.correctAnswer) {
                style = "border-green-500 bg-green-500/10 text-green-400";
              } else if (idx === selected) {
                style = "border-red-500 bg-red-500/10 text-red-400";
              } else {
                style = "border-dark-border bg-dark-card/30 text-gray-500";
              }
            }

            return (
              <button
                key={idx}
                disabled={answered}
                onClick={() => setSelected(idx)}
                className={`w-full p-4 rounded-xl border text-left text-sm transition-all ${style}`}
              >
                <span className="font-medium mr-2 text-moonDust-purple/60">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="text-center space-y-1">
            <p className={`text-sm font-medium ${selected === quiz.correctAnswer ? "text-green-400" : "text-red-400"}`}>
              {selected === quiz.correctAnswer ? "Correct!" : "Not quite. Try reviewing the topic."}
            </p>
            {selected !== quiz.correctAnswer && (
              <Link
                href={`/feed?videoId=${quiz.videoId}`}
                className="inline-block text-sm text-moonDust-blue hover:underline font-medium"
              >
                Watch the video to revise →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
