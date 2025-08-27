# AI Email Cover Letter Generator

A powerful, AI-powered web application that generates personalized email cover letters based on your CV and job requirements. Built with Next.js 15, React 19, and Google Gemini AI.

## ✨ Features

### 🚀 Core Functionality
- **AI-Powered Generation**: Uses Google Gemini 1.5 Flash for intelligent cover letter creation
- **CV Upload & Parsing**: Supports PDF, DOC, and DOCX files with drag-and-drop functionality
- **Smart Matching**: AI analyzes your CV and job description to create relevant content
- **Length Customization**: Choose from Small (3-4 sentences), Medium (1 paragraph), or Long (2-3 paragraphs)

### 🎨 User Experience
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Real-time Generation**: Live status updates during AI processing
- **Professional Templates**: Built-in template library for different career levels and industries

### 🔧 Advanced Features
- **Quality Checker**: AI-powered analysis of your cover letter's effectiveness
- **Copy to Clipboard**: One-click copying for easy use
- **Download as TXT**: Save your cover letters locally
- **Template Library**: Professional templates for various career stages
- **Smart Prompts**: Well-engineered AI prompts for better results

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: Google Generative AI (Gemini 1.5 Flash)
- **File Processing**: PDF-parse for document text extraction
- **Deployment**: Ready for Vercel deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd coverletter-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # The API key is already configured in the code
   # GEMINI_API_KEY=AIzaSyAUgrPIOR1Kokk1f29rvxhkIZom9mToA_o
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 How to Use

### 1. Upload Your CV
- Drag and drop your CV file (PDF, DOC, or DOCX)
- Or click to browse and select a file
- The system will automatically parse and extract text content

### 2. Choose Cover Letter Length
- **Small**: Brief email (3-4 sentences) - perfect for quick applications
- **Medium**: One paragraph (6-8 sentences) - balanced and professional
- **Long**: Comprehensive (2-3 paragraphs) - detailed and thorough

### 3. Enter Job Description
- Paste the complete job description
- Include requirements, responsibilities, and company information
- The more detailed, the better the AI can match your experience

### 4. Generate & Customize
- Click "Generate Cover Letter" to create your personalized letter
- Use the Quality Checker to analyze effectiveness
- Copy to clipboard or download as TXT file

### 5. Template Library (Optional)
- Browse professional templates by category
- Use as starting points for different career stages
- Customize templates with your information

## 🎯 AI Features

### Smart Content Generation
- Analyzes CV content for relevant experience
- Matches skills to job requirements
- Incorporates industry-specific keywords
- Maintains professional tone and structure

### Quality Analysis
- **Professionalism Score**: Tone, grammar, and presentation
- **Keyword Match Score**: Relevance to job requirements
- **Structure Score**: Organization and flow
- **Actionable Feedback**: Specific improvement suggestions

## 🔒 Privacy & Security

- CV files are processed locally and not stored
- AI processing uses secure Google Gemini API
- No personal data is retained after generation
- All communications are encrypted

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **AWS**: Deploy to S3 + CloudFront
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language generation
- **Next.js Team** for the amazing framework
- **Tailwind CSS** for beautiful styling
- **Open Source Community** for inspiration and tools

## 📞 Support

If you have any questions or need help:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the code examples in the components

---

**Built with ❤️ using Next.js and AI technology**
