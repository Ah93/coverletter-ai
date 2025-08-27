"use client";
import { useState, useEffect } from "react";

interface CVDocumentPreviewProps {
  cvText: string;
  fileName: string;
}

export default function CVDocumentPreview({ cvText, fileName }: CVDocumentPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!cvText.trim()) return null;

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Document Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            CV Document Preview
          </h2>
          <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            {fileName}
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="p-6">
        {/* Document Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
            <div className="text-lg font-bold text-blue-600">{cvText.length}</div>
            <div className="text-xs text-blue-700">Characters</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
            <div className="text-lg font-bold text-green-600">{cvText.split(' ').length}</div>
            <div className="text-xs text-green-700">Words</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
            <div className="text-lg font-bold text-purple-600">{cvText.split('\n').length}</div>
            <div className="text-xs text-purple-700">Lines</div>
          </div>
        </div>

        {/* Document Preview */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-h-96 overflow-y-auto shadow-inner">
          {/* Document Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              CV Document
            </h1>
            <div className="text-sm text-gray-600">
              <p>Uploaded: {fileName}</p>
            </div>
          </div>

          {/* Document Content */}
          <div className="space-y-4">
            {cvText.split('\n').map((line, index) => (
              <p key={index} className="text-sm text-gray-700 leading-relaxed">
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>

        {/* Document Footer */}
        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Document Preview • Generated from uploaded CV</p>
        </div>
      </div>
    </div>
  );
}
