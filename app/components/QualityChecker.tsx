"use client";
import { useState, useEffect } from "react";

interface QualityCheckerProps {
  coverLetter: string;
  jobDescription: string;
}

interface QualityScore {
  professionalism: number;
  keywordMatch: number;
  structure: number;
  overall: number;
  feedback: string[];
}

export default function QualityChecker({ coverLetter, jobDescription }: QualityCheckerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [qualityScore, setQualityScore] = useState<QualityScore | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const analyzeQuality = async () => {
    if (!coverLetter.trim() || !jobDescription.trim()) {
      alert("Please generate a cover letter and provide a job description first.");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const res = await fetch("/api/quality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter, jobDescription }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setQualityScore(data.score);
      } else {
        throw new Error("Failed to analyze quality");
      }
    } catch (error) {
      alert("Error analyzing quality. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (!coverLetter.trim()) return null;

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
          <h2 className="text-xl font-semibold">Quality Checker</h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
        <h2 className="text-xl font-semibold">Quality Checker</h2>
        <p className="text-orange-100 text-sm">Analyze your cover letter's effectiveness</p>
      </div>
      
      <div className="p-6">
        <button
          onClick={analyzeQuality}
          disabled={isAnalyzing}
          className={`w-full px-6 py-3 rounded-xl font-semibold transition-all ${
            isAnalyzing
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700"
          }`}
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Analyzing...
            </div>
          ) : (
            "Analyze Cover Letter Quality"
          )}
        </button>

        {qualityScore && (
          <div className="mt-6 space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBg(qualityScore.overall)} mb-3`}>
                <span className={`text-2xl font-bold ${getScoreColor(qualityScore.overall)}`}>
                  {qualityScore.overall}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Overall Score</h3>
              <p className="text-sm text-gray-600">
                {qualityScore.overall >= 80 ? "Excellent!" : 
                 qualityScore.overall >= 60 ? "Good, with room for improvement" : 
                 "Needs improvement"}
              </p>
            </div>

            {/* Individual Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(qualityScore.professionalism)}`}>
                  {qualityScore.professionalism}
                </div>
                <div className="text-sm text-gray-600">Professionalism</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(qualityScore.keywordMatch)}`}>
                  {qualityScore.keywordMatch}
                </div>
                <div className="text-sm text-gray-600">Keyword Match</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(qualityScore.structure)}`}>
                  {qualityScore.structure}
                </div>
                <div className="text-sm text-gray-600">Structure</div>
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Improvement Suggestions</h4>
              <ul className="space-y-2">
                {qualityScore.feedback.map((feedback, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start">
                    <span className="mr-2">•</span>
                    {feedback}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
