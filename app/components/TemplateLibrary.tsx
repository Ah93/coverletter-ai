"use client";
import { useState, useEffect } from "react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
}

const templates: Template[] = [
  {
    id: "entry-level",
    name: "Entry Level Professional",
    description: "Perfect for recent graduates and entry-level positions",
    category: "Career Level",
    content: `Subject: Application for [Position] - [Your Name]

Dear Hiring Manager,

I am writing to express my strong interest in the [Position] role at [Company Name]. As a recent graduate with a [Degree] from [University], I am excited to begin my professional journey and contribute to your team.

During my academic career, I developed strong [relevant skill 1] and [relevant skill 2] through [specific project/course/activity]. My coursework in [relevant subject] has provided me with a solid foundation in [industry knowledge], and I am eager to apply these skills in a professional setting.

I am particularly drawn to [Company Name] because of [specific reason - company values, projects, culture]. I am confident that my enthusiasm, willingness to learn, and strong work ethic would make me a valuable addition to your team.

I would welcome the opportunity to discuss how my background and passion align with your needs. Thank you for considering my application.

Best regards,
[Your Name]
[Your Email]
[Your Phone]`
  },
  {
    id: "career-change",
    name: "Career Change",
    description: "For professionals transitioning to a new industry or role",
    category: "Career Level",
    content: `Subject: Application for [Position] - [Your Name]

Dear Hiring Manager,

I am writing to express my interest in the [Position] role at [Company Name]. While my background is in [current industry/role], I am excited to leverage my transferable skills and passion for [new industry/role] to contribute to your team.

My experience in [current role] has equipped me with valuable skills including [skill 1], [skill 2], and [skill 3], which I believe are directly applicable to this position. Additionally, my background in [relevant experience] has given me a unique perspective that could benefit your organization.

I am particularly drawn to [Company Name] because [specific reason]. The opportunity to [specific aspect of the role] aligns perfectly with my career goals and personal interests.

I am confident that my diverse experience, adaptability, and strong desire to succeed in this new field would make me a valuable asset to your team. I would welcome the opportunity to discuss how my background could contribute to your organization's success.

Best regards,
[Your Name]
[Your Email]
[Your Phone]`
  },
  {
    id: "senior-executive",
    name: "Senior Executive",
    description: "For experienced professionals seeking leadership roles",
    category: "Career Level",
    content: `Subject: Application for [Position] - [Your Name]

Dear Hiring Manager,

I am writing to express my strong interest in the [Position] role at [Company Name]. With over [X] years of experience in [industry/field], including [X] years in leadership positions, I am excited about the opportunity to contribute to your organization's continued success.

Throughout my career, I have consistently delivered results by [specific achievement 1], [specific achievement 2], and [specific achievement 3]. My experience in [relevant area] has taught me the importance of [key leadership principle], and I have successfully implemented strategies that have resulted in [measurable outcome].

I am particularly drawn to [Company Name] because of [specific reason - company vision, challenges, opportunities]. The opportunity to [specific aspect of the role] aligns perfectly with my expertise and career objectives.

I am confident that my proven track record of success, strategic thinking, and ability to lead high-performing teams would make me a valuable addition to your executive team. I would welcome the opportunity to discuss how my experience and vision could contribute to your organization's future growth.

Best regards,
[Your Name]
[Your Email]
[Your Phone]`
  }
];

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border-2 border-gray-100 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group relative bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="absolute top-4 right-4">
              <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
                {template.category}
              </span>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {template.description}
              </p>
            </div>
            <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
              <span className="mr-2">Use Template</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
