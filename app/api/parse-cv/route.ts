import { NextResponse } from "next/server";

// Dynamic import to avoid module resolution issues
let pdfParse: any = null;

async function getPdfParser() {
  if (!pdfParse) {
    try {
      console.log("Loading PDF parser...");
      // Try different import approaches
      try {
        console.log("Attempting dynamic import of pdf-parse...");
        const pdfModule = await import("pdf-parse");
        pdfParse = pdfModule.default || pdfModule;
        console.log("PDF parser loaded successfully via dynamic import");
      } catch (importError) {
        console.log("Dynamic import failed, trying require:", importError);
        // Fallback to require if dynamic import fails
        try {
          const requireModule = eval('require("pdf-parse")');
          pdfParse = requireModule.default || requireModule;
          console.log("PDF parser loaded successfully via require fallback");
        } catch (requireError) {
          console.error("Require fallback also failed:", requireError);
          throw new Error("PDF parsing library not available");
        }
      }
    } catch (error) {
      console.error("Failed to load pdf-parse:", error);
      throw new Error("PDF parsing library not available");
    }
  }
  return pdfParse;
}

// Alternative PDF parsing approach for serverless environments
async function parsePDFAlternative(buffer: Buffer): Promise<string> {
  try {
    console.log("Attempting alternative PDF parsing method...");
    
    // This is a basic fallback that might work in some serverless environments
    // It's not as robust as pdf-parse but can handle simple text-based PDFs
    
    // Convert buffer to string and look for text patterns
    const bufferString = buffer.toString('utf8');
    
    // Look for common PDF text markers
    const textPatterns = [
      /\/Text\s+<<[^>]*>>/g,
      /BT[\s\S]*?ET/g,
      /\([^)]*\)/g
    ];
    
    let extractedText = '';
    
    for (const pattern of textPatterns) {
      const matches = bufferString.match(pattern);
      if (matches) {
        extractedText += matches.join(' ') + ' ';
      }
    }
    
    // Clean up the extracted text
    if (extractedText) {
      extractedText = extractedText
        .replace(/[^\w\s]/g, ' ') // Remove special characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      console.log("Alternative parsing extracted text length:", extractedText.length);
      return extractedText;
    }
    
    throw new Error("Alternative parsing method found no text content");
  } catch (error) {
    console.error("Alternative PDF parsing failed:", error);
    throw error;
  }
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
        
        if (!buffer || buffer.length === 0) {
          throw new Error("Failed to create PDF buffer");
        }
        
        console.log("PDF buffer created, size:", buffer.length);
        
        // Try parsing with minimal options first
        let data;
        try {
          console.log("Attempting PDF parsing with default options...");
          data = await pdfParser(buffer);
          console.log("PDF parsed successfully with default options");
        } catch (parseError) {
          console.log("Simple parsing failed, trying with options:", parseError);
          // Try with specific options if simple parsing fails
          const options = {
            max: 0,
            version: 'v2.0.550'
          };
          console.log("Attempting PDF parsing with custom options:", options);
          data = await pdfParser(buffer, options);
          console.log("PDF parsed successfully with custom options");
        }
        
        // Validate the parsed data
        if (!data) {
          throw new Error("PDF parsing returned null or undefined data");
        }
        
        if (!data.text || typeof data.text !== 'string') {
          throw new Error("PDF parsing returned invalid text content");
        }
        
        if (data.text.trim().length === 0) {
          throw new Error("PDF parsing returned empty text content");
        }
        
        extractedText = data.text;
        console.log("PDF parsed successfully, text length:", extractedText.length);
        console.log("First 100 characters:", extractedText.substring(0, 100));
      } catch (pdfError) {
        console.error("PDF parsing error details:", {
          error: pdfError,
          message: pdfError instanceof Error ? pdfError.message : String(pdfError),
          stack: pdfError instanceof Error ? pdfError.stack : undefined,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        });
        
        // Try alternative parsing method as fallback
        try {
          console.log("Attempting alternative PDF parsing method...");
          const buffer = Buffer.from(await file.arrayBuffer());
          extractedText = await parsePDFAlternative(buffer);
          console.log("Alternative parsing successful, text length:", extractedText.length);
          // Continue with the extracted text
        } catch (alternativeError) {
          console.error("Alternative parsing also failed:", alternativeError);
          
          // Provide specific error messages based on error type
          let errorMessage = "Failed to parse PDF. ";
          const pdfErrorMsg = pdfError instanceof Error ? pdfError.message : String(pdfError);
          
          if (pdfErrorMsg.includes('ENOENT')) {
            errorMessage += "The file might be corrupted or inaccessible. ";
          } else if (pdfErrorMsg.includes('password')) {
            errorMessage += "The file might be password-protected. ";
          } else if (pdfErrorMsg.includes('null or undefined data')) {
            errorMessage += "The PDF parsing service returned invalid data. ";
          } else if (pdfErrorMsg.includes('invalid text content')) {
            errorMessage += "The PDF parsing service returned invalid text format. ";
          } else if (pdfErrorMsg.includes('empty text content')) {
            errorMessage += "The PDF appears to contain only images or no readable text. ";
          } else if (pdfErrorMsg.includes('PDF parsing library not available')) {
            errorMessage += "The PDF parsing service is temporarily unavailable. ";
          } else {
            errorMessage += "The file might be corrupted, password-protected, or contain only images. ";
          }
          
          errorMessage += "Please try converting to text or use the manual input option.";
          
          return NextResponse.json(
            { error: errorMessage },
            { status: 400 }
          );
        }
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
