import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

/**
 * Stripe Developer Platform & Payments Template
 * Inspired by Stripe developer docs: clean monospace accents, API ergonomics, and 99.999% SLA.
 */
export const StripeDeveloperTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['education', 'experience', 'projects', 'skills', 'achievements', 'certificates'];
  const themeColor = meta.accentColor || '#635bff';

  return (
    <div className="text-slate-900 bg-white p-7 max-w-[850px] mx-auto text-left font-sans leading-normal selection:bg-slate-100">
      {/* Header */}
      <header className="pb-3 mb-3 border-b-2" style={{ borderColor: themeColor }}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-950 font-sans">
                {basics.name || 'Your Full Name'}
              </h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border" style={{ borderColor: themeColor, color: themeColor }}>API & 99.999%</span>
            </div>
            {basics.label && (
              <div className="text-xs font-bold tracking-wide mt-0.5" style={{ color: themeColor }}>
                {basics.label}
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-2 sm:text-right font-mono">
            {basics.location && <span>{basics.location}</span>}
            {basics.phone && <span>• {basics.phone}</span>}
            {basics.email && (
              <span>• <a href={`mailto:${basics.email}`} className="text-slate-900 font-semibold hover:underline">{basics.email}</a></span>
            )}
            {basics.url && (
              <span>• <a href={basics.url} target="_blank" rel="noreferrer" className="text-slate-900 font-semibold hover:underline">{basics.url.replace(/^https?:\/\//, '')}</a></span>
            )}
          </div>
        </div>

        {basics.profiles && basics.profiles.length > 0 && (
          <div className="text-[10.5px] font-mono text-slate-600 mt-1 flex flex-wrap gap-x-3">
            {basics.profiles.map((p, idx) => (
              <a key={idx} href={p.url} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: themeColor }}>
                {p.network}: <span className="text-slate-800">{p.username || p.url.replace(/^https?:\/\//, '')}</span>
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Summary */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-3">
          <p className="text-xs text-slate-700 leading-relaxed font-sans">{basics.summary}</p>
        </section>
      )}

      {/* Dynamic Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        // 1. Education
        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 flex items-center justify-between">
                <span>Education</span>
              </h2>
              <div className="space-y-1.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{edu.institution}{edu.location ? ` — ${edu.location}` : ''}</span>
                      <span className="font-mono text-[11px] text-slate-600 font-normal">{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-slate-700">
                      <span>{edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="font-bold text-slate-900 text-[11.5px]">GPA: {edu.cgpa}</span>}
                    </div>
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        <strong className="text-slate-800">Key Coursework:</strong> {edu.coursework.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 2. Experience
        if ((sectionKey === 'experience' || sectionKey === 'work') && work.length > 0) {
          return (
            <section key="work" className="mb-3.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 flex items-center justify-between">
                <span>Experience &amp; Leadership</span>
              </h2>
              <div className="space-y-2.5">
                {work.map((w) => (
                  <div key={w.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span className="text-[12.5px] text-slate-950 font-black">{w.position}</span>
                      <span className="font-mono text-[11px] text-slate-600 font-normal">{w.startDate} – {w.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between items-baseline font-semibold text-slate-700 mb-1">
                      <span style={{ color: themeColor }}>{w.company}</span>
                      {w.location && <span className="text-[11px] font-mono text-slate-500 font-normal">{w.location}</span>}
                    </div>
                    {w.responsibilities && w.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 leading-snug">
                        {w.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 3. Projects
        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 flex items-center justify-between">
                <span>Technical Projects</span>
              </h2>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-950 font-bold">{proj.name}</span>
                        {(proj.url || proj.githubUrl) && (
                          <a href={proj.url || proj.githubUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono hover:underline" style={{ color: themeColor }}>
                            [{(proj.url || proj.githubUrl || '').replace(/^https?:\/\//, '')}]
                          </a>
                        )}
                      </div>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="font-mono text-[10.5px] font-normal text-slate-600">
                          {proj.technologies.join(' • ')}
                        </span>
                      )}
                    </div>
                    {proj.description && <p className="text-slate-700 mt-0.5 leading-snug">{proj.description}</p>}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 mt-1 leading-snug">
                        {proj.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
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
            <section key="skills" className="mb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Technical Stack &amp; Skills
              </h2>
              <div className="space-y-1 text-xs">
                {skills.map((s, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                    <span className="font-bold text-slate-950 sm:w-36 shrink-0">{s.category}:</span>
                    <span className="text-slate-700 font-mono text-[11px]">
                      {s.items.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 5. Hackathons
        if (sectionKey === 'hackathons' && hackathons && hackathons.length > 0) {
          return (
            <section key="hackathons" className="mb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Hackathons &amp; Competitions
              </h2>
              <div className="space-y-1.5 text-xs">
                {hackathons.map((h) => (
                  <div key={h.id}>
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{h.name} — {h.organization}</span>
                      <span className="font-semibold text-[11px]" style={{ color: themeColor }}>{h.achievement}</span>
                    </div>
                    {h.project && (
                      <div className="text-slate-700 text-[11.5px]">
                        Project: <strong className="text-slate-900">{h.project}</strong> {h.technologies && h.technologies.length > 0 && `(${h.technologies.join(', ')})`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 6. Achievements
        if (sectionKey === 'achievements' && achievements && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Achievements &amp; Honors
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-700">
                {achievements.map((ach) => (
                  <li key={ach.id}>
                    <strong className="text-slate-900">{ach.title}</strong>
                    {ach.organization && ` — ${ach.organization}`}
                    {ach.date && ` (${ach.date})`}
                    {ach.description && `: ${ach.description}`}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        // 7. Certifications
        if (sectionKey === 'certificates' && certificates && certificates.length > 0) {
          return (
            <section key="certificates" className="mb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Certifications
              </h2>
              <div className="text-xs text-slate-700 flex flex-wrap gap-x-4 gap-y-1">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-500 font-mono text-[11px]">[{cert.issuer}]</span>}
                    {cert.date && <span className="text-slate-400 font-mono text-[10px]">({cert.date})</span>}
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
