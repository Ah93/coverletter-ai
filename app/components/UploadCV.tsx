"use client";
import { useState, useRef } from "react";

interface UploadCVProps {
  onUpload: (file: File) => void;
  onTextInput: (text: string) => void;
  onFileSelect: (file: File) => void;
}

export default function UploadCV({ onUpload, onTextInput, onFileSelect }: UploadCVProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualText, setManualText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      alert("File size too large. Please upload a file smaller than 10MB.");
      return;
    }

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword"
    ];
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = selectedFile.name.toLowerCase();
    
    const isValidType = validTypes.includes(selectedFile.type) || 
                       validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidType) {
      alert("Please select a valid PDF, DOC, or DOCX file.");
      return;
    }

    setFile(selectedFile);
    onUpload(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleManualTextSubmit = () => {
    if (manualText.trim()) {
      onTextInput(manualText.trim());
      setShowManualInput(false);
      setManualText("");
    }
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all-fallback cursor-pointer ${
          isDragOver
            ? "border-blue-400 bg-blue-50 transform-fallback"
            : "border-gray-300 hover:border-blue-300 hover:bg-gray-50 hover:scale-[1.02]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {file ? "File uploaded successfully!" : "Upload your CV"}
            </p>
            <p className="text-sm text-gray-500">
              {file ? "Click to change file" : "Drag and drop or click to browse"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports PDF, DOC, and DOCX files (max 10MB)
            </p>
          </div>
        </div>
      </div>
      
      {/* Manual Input Option */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="inline-flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          {showManualInput ? "Hide Manual Input" : "Or type your CV manually"}
        </button>
      </div>

      {showManualInput && (
        <div className="mt-4 p-6 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="font-medium text-gray-800 mb-3 text-sm">Type Your CV Content</h4>
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Paste or type your CV content here..."
            className="w-full p-4 border border-gray-200 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleManualTextSubmit}
              disabled={!manualText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              Use This Text
            </button>
            <button
              onClick={() => {
                setShowManualInput(false);
                setManualText("");
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
