import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the provided API key
const genAI = new GoogleGenerativeAI("AIzaSyAUgrPIOR1Kokk1f29rvxhkIZom9mToA_o");

// Define valid language types
type Language = 'english' | 'spanish' | 'french' | 'german' | 'italian' | 'portuguese' | 'dutch' | 'russian' | 'chinese' | 'japanese' | 'korean' | 'arabic' | 'hindi' | 'turkish' | 'polish' | 'swedish' | 'norwegian' | 'danish' | 'finnish';

export async function POST(req: Request) {
  try {
    const { cvText, jobDesc, length, language } = await req.json();

    if (!cvText || !jobDesc) {
      return NextResponse.json(
        { error: "CV text and job description are required" },
        { status: 400 }
      );
    }

    // Enhanced length mapping with specific instructions
    const lengthMap: Record<string, string> = {
      small: "Create a brief email cover letter (3-4 sentences total). Focus on the most relevant experience and keep it concise for quick reading.",
      medium: "Create a one-paragraph cover letter (6-8 sentences). Include key qualifications, relevant experience, and enthusiasm for the role.",
      long: "Create a comprehensive cover letter (2-3 paragraphs). Include detailed experience, specific achievements, and strong closing statement."
    };

    // Language-specific instructions with proper typing
    const languageInstructions: Record<Language, string> = {
      english: "Write the cover letter in English with professional business language.",
      spanish: "Write the cover letter in Spanish (Español) with professional business language. Use appropriate Spanish business terminology and cultural nuances.",
      french: "Write the cover letter in French (Français) with professional business language. Use appropriate French business terminology and cultural nuances.",
      german: "Write the cover letter in German (Deutsch) with professional business language. Use appropriate German business terminology and cultural nuances.",
      italian: "Write the cover letter in Italian (Italiano) with professional business language. Use appropriate Italian business terminology and cultural nuances.",
      portuguese: "Write the cover letter in Portuguese (Português) with professional business language. Use appropriate Portuguese business terminology and cultural nuances.",
      dutch: "Write the cover letter in Dutch (Nederlands) with professional business language. Use appropriate Dutch business terminology and cultural nuances.",
      russian: "Write the cover letter in Russian (Русский) with professional business language. Use appropriate Russian business terminology and cultural nuances.",
      chinese: "Write the cover letter in Chinese (中文) with professional business language. Use appropriate Chinese business terminology and cultural nuances.",
      japanese: "Write the cover letter in Japanese (日本語) with professional business language. Use appropriate Japanese business terminology and cultural nuances.",
      korean: "Write the cover letter in Korean (한국어) with professional business language. Use appropriate Korean business terminology and cultural nuances.",
      arabic: "Write the cover letter in Arabic (العربية) with professional business language. Use appropriate Arabic business terminology and cultural nuances. Note: Arabic is written right-to-left.",
      hindi: "Write the cover letter in Hindi (हिन्दी) with professional business language. Use appropriate Hindi business terminology and cultural nuances.",
      turkish: "Write the cover letter in Turkish (Türkçe) with professional business language. Use appropriate Turkish business terminology and cultural nuances.",
      polish: "Write the cover letter in Polish (Polski) with professional business language. Use appropriate Polish business terminology and cultural nuances.",
      swedish: "Write the cover letter in Swedish (Svenska) with professional business language. Use appropriate Swedish business terminology and cultural nuances.",
      norwegian: "Write the cover letter in Norwegian (Norsk) with professional business language. Use appropriate Norwegian business terminology and cultural nuances.",
      danish: "Write the cover letter in Danish (Dansk) with professional business language. Use appropriate Danish business terminology and cultural nuances.",
      finnish: "Write the cover letter in Finnish (Suomi) with professional business language. Use appropriate Finnish business terminology and cultural nuances."
    };

    // Safely get language instruction with fallback
    const getLanguageInstruction = (lang: any): string => {
      if (typeof lang === 'string' && lang in languageInstructions) {
        return languageInstructions[lang as Language];
      }
      return languageInstructions.english;
    };

    // Well-engineered prompt for better results
    const prompt = `You are an expert career consultant and professional writer. Your task is to create a compelling email cover letter that perfectly matches the candidate's CV with the job requirements.

IMPORTANT REQUIREMENTS:
- Format: Professional email format with a clear subject line
- Tone: Confident, enthusiastic, and professional
- Structure: Follow the length requirement exactly
- Personalization: Use specific details from the CV that directly relate to the job
- Keywords: Incorporate relevant keywords from the job description naturally
- Closing: Always end with a professional closing such as "Best Wishes", "Best Regards", "Sincerely", "Kind Regards", or "Yours Faithfully" followed by the candidate's name
- Language: ${getLanguageInstruction(language)}

CV CONTENT:
${cvText}

JOB DESCRIPTION:
${jobDesc}

LENGTH REQUIREMENT:
${lengthMap[length] || lengthMap.medium}

LANGUAGE REQUIREMENT:
${getLanguageInstruction(language)}

INSTRUCTIONS:
1. Start with a compelling subject line that includes the job title
2. Address the hiring manager professionally
3. Open with enthusiasm and mention the specific position
4. Connect your experience directly to the job requirements
5. Use specific examples and achievements from the CV
6. Show genuine interest in the company/role
7. End with a strong call-to-action
8. Keep the tone warm but professional
9. Ensure perfect grammar and spelling
10. Always conclude with a professional closing (Best Wishes, Best Regards, Sincerely, etc.) and the candidate's name
11. Write the entire cover letter in the specified language: ${language}

Generate the cover letter now:`;

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    
    // Generate content with safety settings
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    });

    const response = await result.response;
    const generatedText = response.text();

    if (!generatedText) {
      throw new Error("No content generated");
    }

    return NextResponse.json({ result: generatedText });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter. Please try again." },
      { status: 500 }
    );
  }
}
