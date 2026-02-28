"use client";

import Modal from "@/components/ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  videoId: string | null;
}

const reasons = [
  { id: "BAD_CONTENT", label: "Bad content", emoji: "🚫" },
  { id: "TOO_EASY", label: "Too easy", emoji: "😴" },
  { id: "TOO_HARD", label: "Too hard", emoji: "🤯" },
];

export default function DislikeModal({ open, onClose, videoId }: Props) {
  const handleSelect = (reason: string) => {
    console.log("Dislike:", videoId, reason);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Why?" position="bottom">
      <div className="p-4 space-y-2">
        {reasons.map((r) => (
          <button
            key={r.id}
            onClick={() => handleSelect(r.id)}
            className="w-full p-4 rounded-xl border border-dark-border bg-dark text-left text-sm text-white hover:border-moonDust-blue/50 hover:bg-dark-card transition-colors flex items-center gap-3"
          >
            <span className="text-lg">{r.emoji}</span>
            {r.label}
          </button>
        ))}
      </div>
    </Modal>
  );
}
