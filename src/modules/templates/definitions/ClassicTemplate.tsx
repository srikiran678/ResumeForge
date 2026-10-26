import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, volunteering, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['summary', 'education', 'work', 'projects', 'skills', 'hackathons', 'achievements', 'certificates', 'volunteering'];

  return (
    <div className="text-black bg-white p-8 max-w-[850px] mx-auto text-left leading-relaxed font-resumeClassic">
      {/* Header / Contact Info */}
      <header className="border-b-2 border-black pb-4 mb-4 text-center">
        <h1 className="text-2xl font-bold tracking-wide uppercase text-black mb-1">{basics.name || 'Your Full Name'}</h1>
        {basics.label && <div className="text-sm font-semibold tracking-wide text-neutral-800 mb-2">{basics.label}</div>}

        <div className="text-xs text-neutral-700 flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
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
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 text-black">
            Summary
          </h2>
          <p className="text-xs text-neutral-800 leading-normal">{basics.summary}</p>
        </section>
      )}

      {/* Dynamic Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 text-black">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between font-bold text-black">
                      <span>{edu.institution}{edu.location ? ` — ${edu.location}` : ''}</span>
                      <span>{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between italic text-neutral-800">
                      <span>{edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="font-medium not-italic">CGPA: {edu.cgpa}</span>}
                    </div>
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="text-[11px] text-neutral-700 mt-0.5">
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
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 text-black">
                Experience
              </h2>
              <div className="space-y-3">
                {work.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between font-bold text-black">
                      <span>{exp.position}</span>
                      <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    <div className="italic text-neutral-800 mb-1">
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </div>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800">
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

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 text-black">
                Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between font-bold text-black">
                      <span>
                        {proj.name}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <span className="font-normal italic text-neutral-700"> | {proj.technologies.join(', ')}</span>
                        )}
                      </span>
                      {proj.date && <span>{proj.date}</span>}
                    </div>
                    {(proj.url || proj.githubUrl) && (
                      <div className="text-[11px] text-neutral-600 mb-0.5">
                        {[proj.url, proj.githubUrl].filter(Boolean).join(' | ')}
                      </div>
                    )}
                    {proj.description && <p className="text-neutral-800 mb-1">{proj.description}</p>}
                    {proj.highlights && proj.highlights.length > 0 && (
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

        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 text-black">
                Skills
              </h2>
              <div className="text-xs space-y-1 text-neutral-800">
                {skills.map((cat, idx) => (
                  <div key={idx}>
                    <span className="font-bold text-black">{cat.category}: </span>
                    <span>{cat.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'hackathons' && hackathons.length > 0) {
          return (
            <section key="hackathons" className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 text-black">
                Hackathons & Technical Competitions
              </h2>
              <div className="space-y-2">
                {hackathons.map((h) => (
                  <div key={h.id} className="text-xs">
                    <div className="flex justify-between font-bold text-black">
                      <span>{h.name} — {h.organization}</span>
                      <span>{h.achievement}</span>
                    </div>
                    <div className="text-neutral-700">
                      Project: <span className="font-medium text-black">{h.project}</span> ({h.technologies.join(', ')})
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
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 text-black">
                Achievements & Honors
              </h2>
              <div className="space-y-1.5 text-xs text-neutral-800">
                {achievements.map((a) => (
                  <div key={a.id}>
                    <span className="font-bold text-black">{a.title}</span> — {a.organization} ({a.date})
                    {a.description && <div className="text-[11px] text-neutral-700">{a.description}</div>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'certificates' && certificates.length > 0) {
          return (
            <section key="certificates" className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 text-black">
                Certifications
              </h2>
              <div className="space-y-1 text-xs text-neutral-800">
                {certificates.map((c) => (
                  <div key={c.id} className="flex justify-between">
                    <span>
                      <span className="font-bold text-black">{c.name}</span> — {c.issuer}
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
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 text-black">
                Volunteering & Leadership
              </h2>
              <div className="space-y-2 text-xs">
                {volunteering.map((v) => (
                  <div key={v.id}>
                    <div className="flex justify-between font-bold text-black">
                      <span>{v.role} — {v.organization}</span>
                      <span>{v.startDate} – {v.endDate}</span>
                    </div>
                    {v.contributions && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-800 mt-0.5">
                        {v.contributions.map((c, idx) => (
                          <li key={idx}>{c}</li>
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
