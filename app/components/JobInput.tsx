"use client";
import { useState } from "react";

interface JobInputProps {
  onSubmit: (text: string) => void;
  isGenerating: boolean;
}

export default function JobInput({ onSubmit, isGenerating }: JobInputProps) {
  const [jd, setJd] = useState("");

  const handleSubmit = () => {
    if (jd.trim() && !isGenerating) {
      onSubmit(jd);
    }
  };

  return (
    <div>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        className="w-full p-5 border border-gray-200 rounded-xl h-44 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        placeholder="Paste the job description here..."
        disabled={isGenerating}
      />
      <button
        onClick={handleSubmit}
        disabled={!jd.trim() || isGenerating}
        className={`mt-5 w-full px-6 py-4 rounded-xl font-medium transition-all ${
          !jd.trim() || isGenerating
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        }`}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Generating...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            Generate Cover Letter
          </div>
        )}
      </button>
    </div>
  );
}
