import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the provided Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyAUgrPIOR1Kokk1f29rvxhkIZom9mToA_o");

export async function POST(req: Request) {
  try {
    const { coverLetter, jobDescription } = await req.json();

    if (!coverLetter || !jobDescription) {
      return NextResponse.json(
        { error: "Cover letter and job description are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert career consultant and hiring manager. Analyze the following cover letter against the job description and provide a comprehensive quality assessment.

COVER LETTER:
${coverLetter}

JOB DESCRIPTION:
${jobDescription}

Please analyze the cover letter and provide:

1. PROFESSIONALISM SCORE (0-100): Rate the overall professional tone, grammar, and presentation
2. KEYWORD MATCH SCORE (0-100): Rate how well the cover letter incorporates relevant keywords and requirements from the job description
3. STRUCTURE SCORE (0-100): Rate the organization, flow, and completeness of the cover letter
4. OVERALL SCORE (0-100): Calculate the average of the above three scores
5. SPECIFIC FEEDBACK: Provide 3-5 actionable suggestions for improvement

Respond in this exact JSON format:
{
  "score": {
    "professionalism": [number],
    "keywordMatch": [number],
    "structure": [number],
    "overall": [number],
    "feedback": ["suggestion 1", "suggestion 2", "suggestion 3"]
  }
}

Be honest but constructive in your assessment. Focus on specific, actionable improvements.`;

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      },
    });

    const response = await result.response;
    const generatedText = response.text();

    if (!generatedText) {
      throw new Error("No content generated");
    }

    // Try to parse the JSON response
    try {
      const parsedResponse = JSON.parse(generatedText);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      // If parsing fails, create a fallback response
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json({
        score: {
          professionalism: 75,
          keywordMatch: 70,
          structure: 80,
          overall: 75,
          feedback: [
            "The AI analysis couldn't be parsed properly. Please review your cover letter manually.",
            "Ensure you've included specific examples from your experience.",
            "Check that your cover letter addresses the key requirements in the job description."
          ]
        }
      });
    }
  } catch (error: any) {
    console.error("Quality check error:", error);
    return NextResponse.json(
      { error: "Failed to analyze quality. Please try again." },
      { status: 500 }
    );
  }
}
