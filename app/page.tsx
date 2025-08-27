"use client";
import { useState, useEffect } from "react";
import UploadCV from "./components/UploadCV";
import JobInput from "./components/JobInput";
import OutputBox from "./components/OutputBox";
import TemplateLibrary from "./components/TemplateLibrary";
import DocumentViewer from "./components/DocumentViewer";


export default function Home() {
  const [cvText, setCvText] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [output, setOutput] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [length, setLength] = useState("medium");
  const [language, setLanguage] = useState("english");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpload = async (file: File) => {
    setCvFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/parse-cv", { method: "POST", body: formData });
      const data = await res.json();
      
      if (res.ok && data.text) {
        setCvText(data.text);
      } else {
        const errorMessage = data.error || "Failed to parse CV. Please try again.";
        alert(errorMessage);
        setCvFileName("");
        setCvFile(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Network error. Please check your connection and try again.");
      setCvFileName("");
      setCvFile(null);
    }
  };

  const handleManualTextInput = (text: string) => {
    setCvText(text);
    setCvFileName("Manual Input");
    setCvFile(null);
  };

  const handleFileSelect = (file: File) => {
    setCvFile(file);
  };

  const handleGenerate = async (jd: string) => {
    if (!cvText.trim()) {
      alert("Please upload your CV first!");
      return;
    }
    if (!jd.trim()) {
      alert("Please enter a job description!");
      return;
    }

    setJobDescription(jd);
    setIsGenerating(true);
    setOutput("Generating your cover letter...");
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDesc: jd, length, language }),
      });
      const data = await res.json();
      if (data.result) {
        setOutput(data.result);
      } else {
        setOutput("Error generating cover letter. Please try again.");
      }
    } catch (error) {
      setOutput("Network error. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: any) => {
    setOutput(template.content);
    setShowTemplates(false);
  };

  const lengthOptions = [
    { value: "small", label: "Small", description: "3-4 sentences" },
    { value: "medium", label: "Medium", description: "1 paragraph" },
    { value: "long", label: "Long", description: "2-3 paragraphs" }
  ];

  const languageOptions = [
    { value: "english", label: "English", flag: "🇺🇸", description: "International standard" },
    { value: "spanish", label: "Spanish", flag: "🇪🇸", description: "Español" },
    { value: "french", label: "French", flag: "🇫🇷", description: "Français" },
    { value: "german", label: "German", flag: "🇩🇪", description: "Deutsch" },
    { value: "italian", label: "Italian", flag: "🇮🇹", description: "Italiano" },
    { value: "portuguese", label: "Portuguese", flag: "🇵🇹", description: "Português" },
    { value: "dutch", label: "Dutch", flag: "🇳🇱", description: "Nederlands" },
    { value: "russian", label: "Russian", flag: "🇷🇺", description: "Русский" },
    { value: "chinese", label: "Chinese", flag: "🇨🇳", description: "中文" },
    { value: "japanese", label: "Japanese", flag: "🇯🇵", description: "日本語" },
    { value: "korean", label: "Korean", flag: "🇰🇷", description: "한국어" },
    { value: "arabic", label: "Arabic", flag: "🇸🇦", description: "العربية" },
    { value: "hindi", label: "Hindi", flag: "🇮🇳", description: "हिन्दी" },
    { value: "turkish", label: "Turkish", flag: "🇹🇷", description: "Türkçe" },
    { value: "polish", label: "Polish", flag: "🇵🇱", description: "Polski" },
    { value: "swedish", label: "Swedish", flag: "🇸🇪", description: "Svenska" },
    { value: "norwegian", label: "Norwegian", flag: "🇳🇴", description: "Norsk" },
    { value: "danish", label: "Danish", flag: "🇩🇰", description: "Dansk" },
    { value: "finnish", label: "Finnish", flag: "🇫🇮", description: "Suomi" }
  ];

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-5xl mx-auto py-16 px-6 relative z-10">
        {/* Modern Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-8 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
            AI Cover Letter Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload your CV, describe the job, and let AI create a personalized cover letter in your preferred language
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          {/* CV Upload */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 shadow-lg">1</span>
              Upload Your CV
            </h2>
            <UploadCV onUpload={handleUpload} onTextInput={handleManualTextInput} onFileSelect={handleFileSelect} />
            {cvFileName && (
              <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                ✓ {cvFileName}
              </div>
            )}
          </div>

          {/* Document Viewer */}
          {cvFile && (
            <div className="mb-8">
              <DocumentViewer file={cvFile} fileName={cvFileName} />
            </div>
          )}

          {/* Length Selection */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 shadow-lg">2</span>
              Choose Length
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lengthOptions.map((option) => (
                <label key={option.value} className="relative cursor-pointer group">
                  <input
                    type="radio"
                    name="length"
                    value={option.value}
                    checked={length === option.value}
                    onChange={(e) => setLength(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    length === option.value 
                      ? 'border-purple-500 bg-purple-50 shadow-lg scale-105' 
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}>
                    <div className="text-center">
                      <span className="text-lg font-bold text-gray-800 block mb-1">
                        {option.label}
                      </span>
                      <span className="text-sm text-gray-600">
                        {option.description}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 shadow-lg">3</span>
              Choose Language
            </h2>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-white text-gray-900 appearance-none cursor-pointer hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value} className="py-2">
                    {option.flag} {option.label} - {option.description}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-01.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {/* Current Language Display */}
            <div className="mt-6 flex items-center justify-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-semibold shadow-sm border border-green-200">
                <span className="mr-2">
                  {languageOptions.find(opt => opt.value === language)?.flag}
                </span>
                Cover letter will be generated in: <span className="ml-1 font-semibold">{languageOptions.find(opt => opt.value === language)?.label}</span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 shadow-lg">4</span>
              Job Description
            </h2>
            <JobInput onSubmit={handleGenerate} isGenerating={isGenerating} />
          </div>
        </div>



        {/* Output */}
        {output && (
          <div className="mt-12">
            <OutputBox 
              text={output} 
              isGenerating={isGenerating}
              fileName={cvFileName}
              language={language}
            />
          </div>
        )}



        {/* Modern Footer */}
        <div className="text-center mt-16 text-gray-500">
          <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">Made By Ahmed Sheikh</p>
          </div>
        </div>
      </div>
    </main>
  );
}
