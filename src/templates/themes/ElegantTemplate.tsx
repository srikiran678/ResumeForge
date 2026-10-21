import React from 'react';
import { ResumeData } from '../../data/types';

interface TemplateProps {
  resume: ResumeData;
}

export const ElegantTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['education', 'work', 'skills', 'projects', 'achievements', 'certificates'];

  return (
    <div className="text-neutral-900 bg-white p-8 max-w-[850px] mx-auto text-left leading-relaxed font-serif">
      {/* Centered Formal Ivy League Header */}
      <header className="border-b border-neutral-800 pb-3 mb-4 text-center">
        <h1 className="text-2xl font-normal tracking-wider uppercase text-neutral-950 font-serif">
          {basics.name || 'Your Full Name'}
        </h1>
        {basics.label && (
          <div className="text-xs italic text-neutral-700 tracking-wide mt-0.5">
            {basics.label}
          </div>
        )}

        <div className="text-[11px] text-neutral-600 font-sans flex flex-wrap justify-center items-center gap-x-2.5 mt-1.5">
          {basics.location && <span>{basics.location}</span>}
          {basics.email && <span>• {basics.email}</span>}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.url && <span>• {basics.url}</span>}
          {basics.profiles?.map((p, idx) => (
            <span key={idx}>• {p.network}: {p.username || p.url}</span>
          ))}
        </div>
      </header>

      {/* Summary */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-4">
          <p className="text-xs text-neutral-800 leading-relaxed italic text-center max-w-2xl mx-auto">
            "{basics.summary}"
          </p>
        </section>
      )}

      {/* Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-0.5 mb-2 text-center font-sans">
                Education
              </h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between font-bold text-neutral-950">
                      <span>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</span>
                      <span className="font-normal font-sans text-neutral-600 text-[11px]">{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between italic text-neutral-800">
                      <span>{edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="not-italic font-sans text-[11px]">GPA: {edu.cgpa}</span>}
                    </div>
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="text-[11px] text-neutral-600 mt-0.5 font-sans">
                        Honors / Coursework: {(edu.coursework || []).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'work' && work.length > 0) {
          return (
            <section key="work" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-0.5 mb-2 text-center font-sans">
                Professional Experience
              </h2>
              <div className="space-y-3">
                {work.map((w) => (
                  <div key={w.id} className="text-xs">
                    <div className="flex justify-between font-bold text-neutral-950">
                      <span>{w.company}{w.location ? `, ${w.location}` : ''}</span>
                      <span className="font-normal font-sans text-neutral-600 text-[11px]">{w.startDate} – {w.endDate || 'Present'}</span>
                    </div>
                    <div className="italic text-neutral-800 mb-1">
                      {w.position}
                    </div>
                    {w.responsibilities && w.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-800 text-[11.5px] font-sans">
                        {w.responsibilities.map((r, idx) => (
                          <li key={idx} className="leading-snug">{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-4 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-0.5 mb-2 text-center">
                Skills & Specialized Competencies
              </h2>
              <div className="text-xs space-y-1 text-neutral-800">
                {skills.map((cat, idx) => (
                  <div key={idx} className="flex">
                    <span className="font-bold text-neutral-900 w-32 shrink-0">{cat.category}:</span>
                    <span>{(cat.items || []).join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-0.5 mb-2 text-center font-sans">
                Selected Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between font-bold text-neutral-950">
                      <span>{proj.name}</span>
                      {proj.url && <span className="font-normal font-sans text-neutral-500 text-[11px]">{proj.url}</span>}
                    </div>
                    {proj.description && <p className="text-neutral-700 text-[11.5px] font-sans">{proj.description}</p>}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-700 text-[11px] font-sans mt-0.5">
                        {proj.highlights.map((h, idx) => (
                          <li key={idx}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};
