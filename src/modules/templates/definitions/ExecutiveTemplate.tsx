import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, volunteering, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['summary', 'work', 'education', 'skills', 'projects', 'achievements', 'certificates', 'volunteering'];

  return (
    <div className="text-slate-900 bg-white p-8 max-w-[850px] mx-auto text-left leading-relaxed font-serif">
      {/* Executive Dual-Rule Header */}
      <header className="border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase font-sans">
            {basics.name || 'Your Full Name'}
          </h1>
          {basics.label && (
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 font-sans">
              {basics.label}
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-600 font-sans flex flex-wrap items-center gap-x-3 mt-2 border-t border-slate-200 pt-2">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.location && <span>• {basics.location}</span>}
          {basics.url && <span>• {basics.url}</span>}
          {basics.profiles?.map((p, idx) => (
            <span key={idx}>• {p.network}: {p.username || p.url}</span>
          ))}
        </div>
      </header>

      {/* Executive Summary */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans border-b border-slate-300 pb-0.5 mb-1.5 flex items-center justify-between">
            <span>Executive Profile & Leadership Overview</span>
          </h2>
          <p className="text-xs text-slate-800 leading-normal font-sans text-justify">{basics.summary}</p>
        </section>
      )}

      {/* Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        if (sectionKey === 'work' && work.length > 0) {
          return (
            <section key="work" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans border-b border-slate-300 pb-0.5 mb-2">
                Executive & Professional Experience
              </h2>
              <div className="space-y-3 font-sans">
                {work.map((w) => (
                  <div key={w.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-950 text-[13px]">
                      <span>{w.position}</span>
                      <span className="text-slate-600 font-medium text-xs">{w.startDate} – {w.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between text-slate-700 italic text-xs mb-1">
                      <span>{w.company}{w.location ? `, ${w.location}` : ''}</span>
                    </div>
                    {w.responsibilities && w.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 text-[11.5px]">
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

        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans border-b border-slate-300 pb-0.5 mb-2">
                Education & Credentials
              </h2>
              <div className="space-y-2 font-sans">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-950">
                      <span>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</span>
                      <span className="text-slate-600">{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>{edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="font-semibold text-slate-900">Honors/GPA: {edu.cgpa}</span>}
                    </div>
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Focus: {(edu.coursework || []).join(', ')}
                      </div>
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
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
                Core Competencies & Technology Matrix
              </h2>
              <div className="text-xs space-y-1 text-slate-800">
                {skills.map((cat, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="font-bold text-slate-950 sm:w-36 shrink-0">{cat.category}:</span>
                    <span className="text-slate-700">{(cat.items || []).join(' • ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-4 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
                Key Initiatives & Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-950">
                      <span className="flex items-center space-x-1.5">
                        <span>{proj.name}</span>
                      </span>
                      {proj.url && <span className="text-[11px] font-mono text-indigo-700 font-normal">{proj.url}</span>}
                    </div>
                    {proj.description && <p className="text-slate-700 text-[11.5px] mt-0.5">{proj.description}</p>}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 text-[11.5px] mt-0.5">
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
            <section key="certificates" className="mb-3 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Certifications & Executive Development
              </h2>
              <div className="text-xs space-y-1">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex justify-between text-slate-800">
                    <span><strong className="text-slate-950">{cert.name}</strong> — {cert.issuer}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-3 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Honors & Key Milestones
              </h2>
              <div className="text-xs space-y-1">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex justify-between text-slate-800">
                    <span><strong className="text-slate-950">{ach.title}</strong>: {ach.description}</span>
                    {ach.date && <span className="text-slate-500 font-mono text-[11px]">{ach.date}</span>}
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
