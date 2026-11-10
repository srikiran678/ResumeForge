import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

/**
 * Google SWE ATS Template
 * High-signal, single-column engineering layout emphasizing technical depth,
 * algorithms, quantifiable metrics (Google XYZ Formula: "Accomplished [X], as measured by [Y], by doing [Z]"),
 * and systems architecture.
 */
export const GoogleSWETemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['education', 'experience', 'projects', 'skills', 'achievements', 'certificates'];
  const accentColor = meta.accentColor || '#1a73e8';

  return (
    <div className="text-slate-900 bg-white p-7 max-w-[850px] mx-auto text-left font-sans leading-normal selection:bg-blue-100">
      {/* Header */}
      <header className="pb-3 mb-3 border-b-2" style={{ borderColor: accentColor }}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              {basics.name || 'Your Full Name'}
            </h1>
            {basics.label && (
              <div className="text-xs font-semibold tracking-wide text-blue-700 mt-0.5" style={{ color: accentColor }}>
                {basics.label}
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-2 sm:text-right font-mono">
            {basics.location && <span>{basics.location}</span>}
            {basics.phone && <span>• {basics.phone}</span>}
            {basics.email && (
              <span>• <a href={`mailto:${basics.email}`} className="text-slate-800 hover:underline">{basics.email}</a></span>
            )}
            {basics.url && (
              <span>• <a href={basics.url} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">{basics.url.replace(/^https?:\/\//, '')}</a></span>
            )}
          </div>
        </div>
        {basics.profiles && basics.profiles.length > 0 && (
          <div className="text-[10.5px] font-mono text-slate-500 mt-1 flex flex-wrap gap-x-3">
            {basics.profiles.map((p, idx) => (
              <a key={idx} href={p.url} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline" style={{ color: accentColor }}>
                {p.network}: {p.username || p.url.replace(/^https?:\/\//, '')}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Summary / Core Competency (if enabled) */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-3.5">
          <p className="text-xs text-slate-700 leading-relaxed">{basics.summary}</p>
        </section>
      )}

      {/* Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        // 1. Education
        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 flex items-center justify-between">
                <span>Education</span>
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{edu.institution}{edu.location ? ` — ${edu.location}` : ''}</span>
                      <span className="font-normal font-mono text-[11px] text-slate-600">{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-slate-700">
                      <span>{edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="font-medium text-slate-900 text-[11.5px]">GPA: {edu.cgpa}</span>}
                    </div>
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        <strong className="text-slate-800">Coursework:</strong> {edu.coursework.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 2. Experience (Google XYZ Formula)
        if ((sectionKey === 'experience' || sectionKey === 'work') && work.length > 0) {
          return (
            <section key="work" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Work Experience
              </h2>
              <div className="space-y-3">
                {work.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-950 text-[12.5px]">{exp.position}</span>
                      <span className="font-mono text-[11px] text-slate-600">{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-slate-700 mb-1">
                      <span className="font-medium text-slate-900">{exp.company}</span>
                      <span className="text-[11px] text-slate-500">{exp.location}</span>
                    </div>
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="text-[10.5px] font-mono text-blue-800 mb-1" style={{ color: accentColor }}>
                        Tech: {exp.technologies.join(' • ')}
                      </div>
                    )}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-1 text-slate-800 text-[11.5px] leading-relaxed">
                        {exp.responsibilities.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 3. Projects & Open Source
        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Technical Projects &amp; Open Source
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-slate-900 text-[12px]">{proj.name}</span>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <span className="text-[10.5px] font-mono text-slate-600 ml-2">
                            [{proj.technologies.join(', ')}]
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-600 flex gap-2">
                        {proj.url && (
                          <a href={proj.url} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline" style={{ color: accentColor }}>Demo</a>
                        )}
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline" style={{ color: accentColor }}>Source</a>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-[11px] text-slate-700 mt-0.5 leading-snug">{proj.description}</p>
                    )}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800 text-[11px] leading-snug mt-1">
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

        // 4. Skills Matrix
        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Technical Skills &amp; Domain Expertise
              </h2>
              <div className="space-y-1 text-xs text-slate-800">
                {skills.map((cat, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="font-bold text-slate-950 sm:w-36 shrink-0 text-[11.5px]">{cat.category}:</span>
                    <span className="text-slate-700 text-[11.5px]">{(cat.items || []).join(' • ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 5. Achievements
        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Honors &amp; Awards
              </h2>
              <div className="space-y-1 text-xs text-slate-800">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex justify-between items-baseline">
                    <span><strong className="text-slate-900">{ach.title}</strong> — {ach.organization}</span>
                    <span className="font-mono text-slate-500 text-[10.5px]">{ach.date}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 6. Certifications
        if (sectionKey === 'certificates' && certificates.length > 0) {
          return (
            <section key="certificates" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Certifications
              </h2>
              <div className="space-y-1 text-xs text-slate-800">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-baseline">
                    <span><strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}</span>
                    <span className="font-mono text-slate-500 text-[10.5px]">{cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 7. Hackathons
        if (sectionKey === 'hackathons' && hackathons.length > 0) {
          return (
            <section key="hackathons" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Hackathons &amp; Competitions
              </h2>
              <div className="space-y-1 text-xs text-slate-800">
                {hackathons.map((h) => (
                  <div key={h.id} className="flex justify-between items-baseline">
                    <span><strong className="text-slate-900">{h.name}</strong> ({h.project}) — {h.achievement}</span>
                    <span className="font-mono text-slate-500 text-[10.5px]">{h.date}</span>
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
