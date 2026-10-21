import React from 'react';
import { ResumeData } from '../../data/types';

interface TemplateProps {
  resume: ResumeData;
}

export const TechnicalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['skills', 'work', 'projects', 'certificates', 'education', 'achievements'];

  return (
    <div className="text-slate-900 bg-white p-7 max-w-[850px] mx-auto text-left leading-normal font-sans">
      {/* Header: Systems Technical Header */}
      <header className="border-b-2 border-emerald-600 pb-2.5 mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 font-mono">
            {basics.name || 'Your Full Name'}
          </h1>
          {basics.label && (
            <div className="text-xs font-bold text-emerald-700 tracking-wide mt-0.5">
              {basics.label}
            </div>
          )}
        </div>

        <div className="text-[11px] font-mono text-slate-600 flex flex-wrap gap-x-2.5 sm:text-right">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.location && <span>• {basics.location}</span>}
          {basics.url && <span>• {basics.url}</span>}
          {basics.profiles?.map((p, idx) => (
            <span key={idx}>• {p.network}: {p.username || p.url}</span>
          ))}
        </div>
      </header>

      {/* Summary */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-3">
          <p className="text-xs text-slate-700 leading-normal">{basics.summary}</p>
        </section>
      )}

      {/* Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-300 pb-0.5 mb-1.5">
                Technical Skills & Architecture Matrix
              </h2>
              <div className="text-xs space-y-1">
                {skills.map((cat, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="font-mono font-bold text-slate-900 sm:w-36 shrink-0 text-[11.5px]">{cat.category}:</span>
                    <span className="text-slate-800">{(cat.items || []).join(' | ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'work' && work.length > 0) {
          return (
            <section key="work" className="mb-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-300 pb-0.5 mb-1.5">
                Engineering Experience
              </h2>
              <div className="space-y-2.5">
                {work.map((w) => (
                  <div key={w.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-950">
                      <span>{w.position} <span className="font-normal text-slate-600">@ {w.company}</span></span>
                      <span className="font-mono text-[11px] text-slate-600 font-normal">{w.startDate} – {w.endDate || 'Present'}</span>
                    </div>
                    {w.responsibilities && w.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 text-[11px]">
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

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-300 pb-0.5 mb-1.5">
                Systems & Open Source Projects
              </h2>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-950">
                      <span>{proj.name}</span>
                      {proj.url && <span className="font-mono text-emerald-700 text-[11px] font-semibold">{proj.url}</span>}
                    </div>
                    {proj.description && <p className="text-slate-700 text-[11px] mt-0.5">{proj.description}</p>}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 text-[11px] mt-0.5">
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

        if (sectionKey === 'certificates' && certificates.length > 0) {
          return (
            <section key="certificates" className="mb-2.5">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-300 pb-0.5 mb-1">
                Cloud & Professional Certifications
              </h2>
              <div className="text-xs space-y-0.5">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex justify-between text-slate-800 text-[11.5px]">
                    <span><strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}</span>
                    <span className="font-mono text-slate-500 text-[10.5px]">{cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-2.5">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-300 pb-0.5 mb-1">
                Education
              </h2>
              <div className="space-y-1 text-xs">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline text-[11.5px]">
                    <div>
                      <span className="font-bold text-slate-900">{edu.institution}</span>
                      <span className="text-slate-700"> — {edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="font-mono text-slate-600 text-[10.5px]"> (GPA: {edu.cgpa})</span>}
                    </div>
                    <span className="font-mono text-slate-500 text-[10.5px]">{edu.startDate} – {edu.endDate || 'Present'}</span>
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
