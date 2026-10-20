import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
  resume: ResumeData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, volunteering, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['summary', 'education', 'work', 'projects', 'skills', 'hackathons', 'achievements', 'certificates'];

  return (
    <div className="text-slate-900 bg-white p-8 max-w-[850px] mx-auto text-left leading-relaxed font-resumeModern">
      {/* Header with clean modern typography */}
      <header className="border-b-2 border-slate-900 pb-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 uppercase">{basics.name || 'Your Full Name'}</h1>
        {basics.label && <div className="text-xs font-semibold text-slate-700 tracking-wide mt-0.5">{basics.label}</div>}

        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-2.5 mt-2">
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
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Summary
          </h2>
          <p className="text-xs text-slate-700 leading-normal">{basics.summary}</p>
        </section>
      )}

      {/* Dynamic Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</span>
                      <span>{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>{edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="font-semibold text-slate-900">GPA: {edu.cgpa}</span>}
                    </div>
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        <span className="font-semibold">Coursework:</span> {edu.coursework.join(', ')}
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Experience
              </h2>
              <div className="space-y-3">
                {work.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{exp.position}</span>
                      <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    <div className="text-slate-700 font-medium mb-1">
                      {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                    </div>
                    {exp.responsibilities && (
                      <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700">
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

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>
                        {proj.name}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <span className="font-normal text-slate-600"> | {proj.technologies.join(', ')}</span>
                        )}
                      </span>
                      {proj.date && <span>{proj.date}</span>}
                    </div>
                    {(proj.url || proj.githubUrl) && (
                      <div className="text-[11px] text-slate-500 mb-0.5">
                        {[proj.url, proj.githubUrl].filter(Boolean).join(' | ')}
                      </div>
                    )}
                    {proj.description && <p className="text-slate-700 mb-1">{proj.description}</p>}
                    {proj.highlights && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700">
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

        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Skills
              </h2>
              <div className="text-xs space-y-1 text-slate-800">
                {skills.map((cat, idx) => (
                  <div key={idx}>
                    <span className="font-bold text-slate-900">{cat.category}: </span>
                    <span className="text-slate-700">{cat.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'hackathons' && hackathons.length > 0) {
          return (
            <section key="hackathons" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Hackathons & Competitions
              </h2>
              <div className="space-y-1.5 text-xs">
                {hackathons.map((h) => (
                  <div key={h.id}>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{h.name} — {h.organization}</span>
                      <span>{h.achievement}</span>
                    </div>
                    <div className="text-slate-600">
                      Project: <span className="font-medium text-slate-800">{h.project}</span> ({h.technologies.join(', ')})
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Achievements
              </h2>
              <div className="space-y-1 text-xs text-slate-800">
                {achievements.map((a) => (
                  <div key={a.id}>
                    <span className="font-bold text-slate-900">{a.title}</span> — {a.organization} ({a.date})
                    {a.description && <div className="text-[11px] text-slate-600">{a.description}</div>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'certificates' && certificates.length > 0) {
          return (
            <section key="certificates" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Certifications
              </h2>
              <div className="space-y-1 text-xs text-slate-800">
                {certificates.map((c) => (
                  <div key={c.id} className="flex justify-between">
                    <span>
                      <span className="font-bold text-slate-900">{c.name}</span> — {c.issuer}
                    </span>
                    <span>{c.date}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'volunteering' && volunteering.length > 0) {
          return (
            <section key="volunteering" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Volunteering
              </h2>
              <div className="space-y-1.5 text-xs text-slate-800">
                {volunteering.map((v) => (
                  <div key={v.id}>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{v.role} — {v.organization}</span>
                      <span>{v.startDate} – {v.endDate}</span>
                    </div>
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
