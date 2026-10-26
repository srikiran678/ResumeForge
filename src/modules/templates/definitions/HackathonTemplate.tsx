import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

export const HackathonTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, volunteering, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['summary', 'hackathons', 'projects', 'work', 'education', 'skills', 'achievements'];

  return (
    <div className="text-neutral-900 bg-white p-7 max-w-[850px] mx-auto text-left leading-normal font-sans text-xs">
      {/* Header */}
      <header className="border-b-2 border-neutral-900 pb-3 mb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase text-neutral-950">{basics.name || 'Full Name'}</h1>
            {basics.label && <div className="text-xs font-semibold text-neutral-700 tracking-wide">{basics.label}</div>}
          </div>
          <div className="text-[11px] font-mono text-neutral-600 text-left sm:text-right mt-1 sm:mt-0">
            {basics.email && <div>{basics.email}</div>}
            {basics.phone && <div>{basics.phone}</div>}
            {basics.location && <div>{basics.location}</div>}
          </div>
        </div>

        <div className="text-[11px] font-mono text-neutral-700 flex flex-wrap gap-x-3 mt-2 border-t border-neutral-200 pt-1.5">
          {basics.url && <span>web: {basics.url}</span>}
          {basics.profiles?.map((p, idx) => (
            <span key={idx}>{p.network.toLowerCase()}: {p.username || p.url}</span>
          ))}
        </div>
      </header>

      {/* Summary */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-0.5 mb-1.5 border-l-2 border-neutral-900 font-mono">
            // Profile & Bio
          </h2>
          <p className="text-neutral-800 px-1">{basics.summary}</p>
        </section>
      )}

      {/* Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        if (sectionKey === 'hackathons' && hackathons.length > 0) {
          return (
            <section key="hackathons" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-0.5 mb-1.5 border-l-2 border-neutral-900 font-mono">
                // Hackathons & Technical Competitions
              </h2>
              <div className="space-y-2">
                {hackathons.map((h) => (
                  <div key={h.id} className="border-l-2 border-neutral-300 pl-3">
                    <div className="flex justify-between font-bold text-neutral-900">
                      <span>{h.name} — <span className="font-semibold text-neutral-700">{h.organization}</span></span>
                      <span className="font-mono text-[11px] text-neutral-800">{h.achievement}</span>
                    </div>
                    <div className="text-neutral-800 text-[11px] mt-0.5">
                      <span className="font-semibold">Project:</span> {h.project}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-600 mt-0.5">
                      Stack: {h.technologies.join(', ')}
                      {h.githubUrl && <span className="ml-2">| repo: {h.githubUrl}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-0.5 mb-1.5 border-l-2 border-neutral-900 font-mono">
                // Featured Technical Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="border-l-2 border-neutral-300 pl-3">
                    <div className="flex justify-between font-bold text-neutral-900">
                      <span>{proj.name}</span>
                      <span className="font-mono text-[11px] text-neutral-600">{proj.date || ''}</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-600 mb-0.5">
                      [{proj.technologies.join(', ')}]
                      {(proj.url || proj.githubUrl) && (
                        <span className="ml-2 font-normal text-neutral-500">
                          — {[proj.url, proj.githubUrl].filter(Boolean).join(' | ')}
                        </span>
                      )}
                    </div>
                    {proj.description && <p className="text-neutral-800 mb-1">{proj.description}</p>}
                    {proj.highlights && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-800">
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

        if (sectionKey === 'work' && work.length > 0) {
          return (
            <section key="work" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-0.5 mb-1.5 border-l-2 border-neutral-900 font-mono">
                // Work & Internship Experience
              </h2>
              <div className="space-y-2.5">
                {work.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-neutral-300 pl-3">
                    <div className="flex justify-between font-bold text-neutral-900">
                      <span>{exp.position}</span>
                      <span className="font-mono text-[11px]">{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    <div className="text-neutral-700 text-[11px] mb-1">
                      {exp.company} | {exp.location}
                    </div>
                    {exp.responsibilities && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-800">
                        {exp.responsibilities.map((b, idx) => (
                          <li key={idx}>{b}</li>
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
            <section key="education" className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-0.5 mb-1.5 border-l-2 border-neutral-900 font-mono">
                // Education
              </h2>
              <div className="space-y-1.5 px-1">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between font-bold text-neutral-900">
                      <span>{edu.institution}{edu.location ? ` (${edu.location})` : ''}</span>
                      <span className="font-mono text-[11px]">{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between text-neutral-700">
                      <span>{edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="font-mono font-semibold">GPA: {edu.cgpa}</span>}
                    </div>
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="text-[11px] text-neutral-600 mt-0.5 font-mono">
                        courses: {edu.coursework.join(', ')}
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
            <section key="skills" className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-0.5 mb-1.5 border-l-2 border-neutral-900 font-mono">
                // Tech Stack & Tooling
              </h2>
              <div className="text-xs space-y-1 font-mono px-1">
                {skills.map((cat, idx) => (
                  <div key={idx}>
                    <span className="font-bold text-neutral-900">{cat.category}: </span>
                    <span className="text-neutral-700">{cat.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-0.5 mb-1.5 border-l-2 border-neutral-900 font-mono">
                // Honors & Recognition
              </h2>
              <div className="space-y-1 px-1">
                {achievements.map((a) => (
                  <div key={a.id} className="text-xs">
                    <span className="font-bold text-neutral-900">{a.title}</span> — {a.organization} ({a.date})
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
