"use client";
import { useState, useEffect } from "react";

interface OutputBoxProps {
  text: string;
  isGenerating: boolean;
  fileName: string;
  language: string;
}

export default function OutputBox({ text, isGenerating, fileName, language }: OutputBoxProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!text && !isGenerating) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  const downloadAsTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    
    // Use a consistent date format to avoid hydration issues
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD format
    
    const jobTitle = fileName && fileName !== "Manual Input" 
      ? fileName.replace(/\.[^/.]+$/, "") 
      : "cover-letter";
    
    element.href = URL.createObjectURL(file);
    element.download = `${jobTitle}-cover-letter-${dateStr}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };



  if (isGenerating) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">Generating Your Cover Letter</h3>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  // Only render the full component after mounting to prevent hydration issues
  if (!mounted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Generated Cover Letter
          </h2>
          <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Action Buttons */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={copyToClipboard}
            className={`px-5 py-3 rounded-lg text-sm font-medium transition-all-fallback ${
              copied
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 hover:shadow-md"
            }`}
          >
            {copied ? (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied!
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Copy to Clipboard
              </div>
            )}
          </button>
          
          <button
            onClick={downloadAsTxt}
            className="px-5 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium hover:shadow-md transition-all-fallback flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download as TXT
          </button>


        </div>

        {/* Cover Letter Content */}
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}
