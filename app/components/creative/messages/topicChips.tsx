// components/TopicChips.tsx
"use client";
import { useState } from "react";
import { topics, Topic } from "../../../lib/topic";
import { ChevronLeft } from "lucide-react";

type Props = {
  onSelect: (label: string) => void;
};

export default function TopicChips({ onSelect }: Props) {
  const [history, setHistory] = useState<Topic[]>([]); // breadcrumb stack
  const current = history[history.length - 1];
  const visibleTopics = current?.subtopics ?? topics;

  const handleChipClick = (topic: Topic) => {
    if (topic.subtopics?.length) {
      // Drill down
      setHistory((prev) => [...prev, topic]);
    } else {
      // Leaf node — this is the final selection
      const breadcrumb = [...history.map((t) => t.label), topic.label].join(" > ");
      onSelect(breadcrumb); // e.g. "Deadline > Request extension"
    }
  };

  const handleBack = () => {
    setHistory((prev) => prev.slice(0, -1));
  };

  return (
    <div className="px-3 py-2 border-t border-gray-100 bg-white">
      {/* Breadcrumb + back button */}
      {history.length > 0 && (
        <div className="flex items-center gap-1 mb-2">
          <button
            onClick={handleBack}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-gray-400">
            {history.map((t) => t.label).join(" › ")}
          </span>
        </div>
      )}

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {visibleTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleChipClick(topic)}
            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            {topic.label}
            {topic.subtopics?.length ? " ›" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}