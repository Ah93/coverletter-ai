"use client";
import { useState, useEffect } from "react";

interface DocumentViewerProps {
  file: File | null;
  fileName: string;
}

export default function DocumentViewer({ file, fileName }: DocumentViewerProps) {
  const [mounted, setMounted] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      
      // Cleanup URL when component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  if (!file) return null;

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, numPages));
  };

  // Check if file is PDF
  const isPDF = file.type === "application/pdf";

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Document Viewer Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Document Viewer
          </h2>
          <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            {fileName}
          </div>
        </div>
      </div>

      {/* Document Controls - Only show for PDFs */}
      {isPDF && (
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Page Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {numPages || '?'}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= numPages}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Zoom Out
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Zoom In
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Content */}
      <div className="p-6">
        {fileUrl ? (
          <div className="flex justify-center">
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
              {isPDF ? (
                <iframe
                  src={`${fileUrl}#page=${currentPage}&zoom=${scale * 100}`}
                  className="w-full"
                  style={{ 
                    height: '600px',
                    minWidth: '800px',
                    maxWidth: '100%'
                  }}
                  title="PDF Viewer"
                />
              ) : (
                <div className="w-full max-w-4xl p-8 text-center">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <p className="text-lg font-medium">Document Preview</p>
                    <p className="text-sm">File: {fileName}</p>
                    <p className="text-sm">Type: {file.type}</p>
                    <p className="text-sm">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div className="mt-4">
                    <a
                      href={fileUrl}
                      download={fileName}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download File
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-medium">Document</p>
              <p className="text-sm">Your document will be displayed here</p>
            </div>
          </div>
        )}
      </div>

      {/* Document Info */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>Document Viewer • {isPDF ? 'Use controls above to navigate and zoom' : 'File preview and download available'}</p>
        </div>
      </div>
    </div>
  );
}
