import React from 'react';
import { ResumeData } from '../../types';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { AcademicTemplate } from './templates/AcademicTemplate';
import { HackathonTemplate } from './templates/HackathonTemplate';

interface ResumeDocumentProps {
  resume: ResumeData;
  scale?: number;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({ resume, scale = 1 }) => {
  const template = resume.meta.template || 'classic';

  const renderTemplate = () => {
    switch (template) {
      case 'compact':
        return <CompactTemplate resume={resume} />;
      case 'modern':
        return <ModernTemplate resume={resume} />;
      case 'academic':
        return <AcademicTemplate resume={resume} />;
      case 'hackathon':
        return <HackathonTemplate resume={resume} />;
      case 'classic':
      default:
        return <ClassicTemplate resume={resume} />;
    }
  };

  return (
    <div
      id="printable-resume"
      className="resume-document-container bg-white shadow-sheet rounded-xs mx-auto overflow-hidden transition-all duration-200 select-text"
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        width: '100%',
        maxWidth: '850px',
        minHeight: '1100px',
      }}
    >
      {renderTemplate()}
    </div>
  );
};
