import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['summary', 'skills', 'work', 'projects', 'education', 'achievements', 'certificates'];

  return (
    <div className="text-zinc-900 bg-white p-8 max-w-[850px] mx-auto text-left leading-relaxed font-sans">
      {/* Header: Pure Monochromatic Minimal */}
      <header className="mb-5 pb-3 border-b border-zinc-200">
        <h1 className="text-2xl font-light tracking-tight text-zinc-950">
          <span className="font-semibold">{basics.name?.split(' ')[0] || 'Your'}</span>{' '}
          {basics.name?.split(' ').slice(1).join(' ') || 'Name'}
        </h1>
        {basics.label && (
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-1">
            {basics.label}
          </div>
        )}

        <div className="text-[11px] font-mono text-zinc-600 flex flex-wrap gap-x-3 gap-y-0.5 mt-2.5">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span className="text-zinc-400">/ {basics.phone}</span>}
          {basics.location && <span className="text-zinc-400">/ {basics.location}</span>}
          {basics.url && <span className="text-zinc-400">/ {basics.url}</span>}
          {basics.profiles?.map((p, idx) => (
            <span key={idx} className="text-zinc-400">/ {p.network}: {p.username || p.url}</span>
          ))}
        </div>
      </header>

      {/* Summary */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-4">
          <p className="text-xs text-zinc-700 leading-relaxed">{basics.summary}</p>
        </section>
      )}

      {/* Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-4">
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                // Skills & Tools
              </h2>
              <div className="text-xs space-y-1">
                {skills.map((cat, idx) => (
                  <div key={idx} className="flex">
                    <span className="font-mono text-zinc-500 text-[11px] w-32 shrink-0">{cat.category}</span>
                    <span className="text-zinc-800">{(cat.items || []).join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'work' && work.length > 0) {
          return (
            <section key="work" className="mb-4">
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">
                // Experience
              </h2>
              <div className="space-y-3">
                {work.map((w) => (
                  <div key={w.id} className="text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-zinc-950">{w.position}</span>
                      <span className="font-mono text-[11px] text-zinc-500">{w.startDate} – {w.endDate || 'Present'}</span>
                    </div>
                    <div className="text-zinc-600 text-[11.5px] mb-1">
                      {w.company}{w.location ? `, ${w.location}` : ''}
                    </div>
                    {w.responsibilities && w.responsibilities.length > 0 && (
                      <ul className="space-y-1 text-zinc-700 text-[11.5px] pl-3 border-l-2 border-zinc-100">
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
            <section key="projects" className="mb-4">
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">
                // Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-semibold text-zinc-950">
                      <span>{proj.name}</span>
                      {proj.url && <span className="font-mono font-normal text-[11px] text-zinc-500">{proj.url}</span>}
                    </div>
                    {proj.description && <p className="text-zinc-700 text-[11.5px] mt-0.5">{proj.description}</p>}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <div className="text-[11px] text-zinc-600 mt-1 pl-3 border-l-2 border-zinc-100">
                        {(proj.highlights || []).join(' • ')}
                      </div>
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
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                // Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs flex justify-between items-baseline">
                    <div>
                      <span className="font-semibold text-zinc-950">{edu.institution}</span>
                      <span className="text-zinc-600"> — {edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="text-zinc-500 font-mono text-[11px]"> (GPA: {edu.cgpa})</span>}
                    </div>
                    <span className="font-mono text-[11px] text-zinc-500">{edu.startDate} – {edu.endDate || 'Present'}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-3">
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1">
                // Honors
              </h2>
              <div className="text-xs space-y-1">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex justify-between text-zinc-700">
                    <span><strong>{ach.title}</strong>: {ach.description}</span>
                    {ach.date && <span className="font-mono text-[11px] text-zinc-400">{ach.date}</span>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'certificates' && certificates && certificates.length > 0) {
          return (
            <section key="certificates" className="mb-3">
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1">
                // Certifications
              </h2>
              <div className="text-xs space-y-1">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex justify-between text-zinc-700">
                    <span><strong>{cert.name}</strong> — {cert.issuer}</span>
                    {cert.date && <span className="font-mono text-[11px] text-zinc-400">{cert.date}</span>}
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
