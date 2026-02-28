"use client";

import { useState } from "react";
import { IoAddOutline, IoCloseOutline, IoReorderThreeOutline } from "react-icons/io5";
import Input from "@/components/ui/Input";

interface TopicEditorProps {
  topics: string[];
  onChange: (topics: string[]) => void;
}

export default function TopicEditor({ topics, onChange }: TopicEditorProps) {
  const [newTopic, setNewTopic] = useState("");

  const addTopic = () => {
    if (!newTopic.trim()) return;
    onChange([...topics, newTopic.trim()]);
    setNewTopic("");
  };

  const removeTopic = (index: number) => {
    onChange(topics.filter((_, i) => i !== index));
  };

  const updateTopic = (index: number, value: string) => {
    const updated = [...topics];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm text-moonDust-lavender/80 font-medium">Topics</label>

      {topics.length > 0 && (
        <div className="space-y-2">
          {topics.map((topic, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <IoReorderThreeOutline size={18} className="text-gray-500 shrink-0 cursor-grab" />
              <input
                value={topic}
                onChange={(e) => updateTopic(idx, e.target.value)}
                className="flex-1 px-3 py-2 bg-dark border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-moonDust-blue/50"
              />
              <button
                onClick={() => removeTopic(idx)}
                className="text-gray-400 hover:text-red-400 p-1"
              >
                <IoCloseOutline size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Add a topic..."
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTopic())}
        />
        <button
          onClick={addTopic}
          disabled={!newTopic.trim()}
          className="w-10 h-10 rounded-xl bg-moonDust-blue/10 border border-moonDust-blue/30 flex items-center justify-center text-moonDust-blue hover:bg-moonDust-blue/20 disabled:opacity-40 shrink-0 self-end"
        >
          <IoAddOutline size={20} />
        </button>
      </div>
    </div>
  );
}
