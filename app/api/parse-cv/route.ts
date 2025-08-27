import { NextResponse } from "next/server";

// Dynamic import to avoid module resolution issues
let pdfParse: any = null;

async function getPdfParser() {
  if (!pdfParse) {
    try {
      // Try different import approaches
      try {
        const pdfModule = await import("pdf-parse");
        pdfParse = pdfModule.default || pdfModule;
      } catch (importError) {
        console.log("Dynamic import failed, trying require:", importError);
        // Fallback to require if dynamic import fails
        const requireModule = eval('require("pdf-parse")');
        pdfParse = requireModule.default || requireModule;
      }
    } catch (error) {
      console.error("Failed to load pdf-parse:", error);
      throw new Error("PDF parsing library not available");
    }
  }
  return pdfParse;
}

export async function POST(req: Request) {
  try {
    console.log("CV parsing request received");
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file provided");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Check file type
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    let extractedText = "";

    if (fileType === "application/pdf" || fileName.endsWith('.pdf')) {
      console.log("Processing PDF file");
      // Handle PDF files
      try {
        const pdfParser = await getPdfParser();
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Try parsing with minimal options first
        let data;
        try {
          data = await pdfParser(buffer);
        } catch (parseError) {
          console.log("Simple parsing failed, trying with options:", parseError);
          // Try with specific options if simple parsing fails
          const options = {
            max: 0,
            version: 'v2.0.550'
          };
          data = await pdfParser(buffer, options);
        }
        
        extractedText = data.text;
        console.log("PDF parsed successfully, text length:", extractedText.length);
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        
        // Provide specific error messages based on error type
        let errorMessage = "Failed to parse PDF. ";
        const pdfErrorMsg = pdfError instanceof Error ? pdfError.message : String(pdfError);
        if (pdfErrorMsg.includes('ENOENT')) {
          errorMessage += "The file might be corrupted or inaccessible. ";
        } else if (pdfErrorMsg.includes('password')) {
          errorMessage += "The file might be password-protected. ";
        } else {
          errorMessage += "The file might be corrupted, password-protected, or contain only images. ";
        }
        errorMessage += "Please try converting to text or use the manual input option.";
        
        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        );
      }
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith('.docx') ||
      fileType === "application/msword" ||
      fileName.endsWith('.doc')
    ) {
      console.log("Processing Word document");
      // For Word documents, we'll extract basic text
      // Note: Full Word parsing would require additional libraries like mammoth.js
      try {
        // For now, we'll return a helpful message
        extractedText = `[Word Document Uploaded: ${file.name}]\n\nNote: Word document parsing is currently limited. For best results, please convert your document to PDF before uploading. The AI will still generate a cover letter based on your job description input.`;
        console.log("Word document processed");
      } catch (wordError) {
        console.error("Word document error:", wordError);
        return NextResponse.json(
          { error: "Failed to process Word document. Please convert to PDF for better results." },
          { status: 400 }
        );
      }
    } else {
      console.log("Unsupported file type:", fileType, fileName);
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF, DOC, or DOCX file." },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      console.log("No text extracted from file");
      return NextResponse.json(
        { error: "No text could be extracted from the file. Please ensure the file contains readable text (not just images). Try using the manual input option instead." },
        { status: 400 }
      );
    }

    // Clean up the extracted text
    const cleanedText = extractedText
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();

    console.log("CV parsing completed successfully");
    return NextResponse.json({ 
      text: cleanedText,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

  } catch (error) {
    console.error("CV parsing error:", error);
    
    // Provide more helpful error messages
    let errorMessage = "An unexpected error occurred while processing your CV. ";
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('PDF parsing library not available')) {
      errorMessage += "The PDF parsing library failed to load. ";
    } else if (errorMsg.includes('ENOENT')) {
      errorMessage += "There was a file access issue. ";
    }
    errorMessage += "Please try again or use the manual input option.";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
