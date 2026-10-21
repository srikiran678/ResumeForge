import React from 'react';
import { ResumeData } from '../../data/types';
import { getTemplate } from '../registry/templateRegistry';

export interface ResumeDocumentProps {
  resume: ResumeData;
  scale?: number;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({ resume, scale = 1 }) => {
  const templateId = resume?.meta?.template || 'classic';
  const TemplateComponent = getTemplate(templateId);

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
      <TemplateComponent resume={resume} />
    </div>
  );
};
