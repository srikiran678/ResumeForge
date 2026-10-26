import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

export const CompactTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, volunteering, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['summary', 'education', 'work', 'projects', 'skills', 'hackathons', 'achievements', 'certificates'];

  return (
    <div className="text-black bg-white p-6 max-w-[850px] mx-auto text-left leading-snug font-resumeCompact text-[11px]">
      {/* Header */}
      <header className="border-b border-black pb-2 mb-2 text-center">
        <h1 className="text-xl font-bold tracking-tight uppercase text-black">{basics.name || 'Full Name'}</h1>
        {basics.label && <div className="text-xs font-semibold text-neutral-800">{basics.label}</div>}

        <div className="text-[10px] text-neutral-700 flex flex-wrap justify-center gap-x-2 mt-0.5">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>| {basics.phone}</span>}
          {basics.location && <span>| {basics.location}</span>}
          {basics.url && <span>| {basics.url}</span>}
          {basics.profiles?.map((p, idx) => (
            <span key={idx}>| {p.network}: {p.username || p.url}</span>
          ))}
        </div>
      </header>

      {/* Summary */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1 text-black">
            Professional Summary
          </h2>
          <p className="text-[11px] text-neutral-800">{basics.summary}</p>
        </section>
      )}

      {/* Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1 text-black">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-1">
                  <div className="flex justify-between font-bold">
                    <span>{edu.institution}{edu.location ? ` — ${edu.location}` : ''}</span>
                    <span>{edu.startDate} – {edu.endDate || 'Present'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{edu.degree} in {edu.field}</span>
                    {edu.cgpa && <span className="font-semibold">GPA: {edu.cgpa}</span>}
                  </div>
                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="text-[10px] text-neutral-600">
                      <span className="font-semibold">Coursework:</span> {edu.coursework.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </section>
          );
        }

        if (sectionKey === 'work' && work.length > 0) {
          return (
            <section key="work" className="mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1 text-black">
                Experience
              </h2>
              {work.map((exp) => (
                <div key={exp.id} className="mb-1.5">
                  <div className="flex justify-between font-bold">
                    <span>{exp.position} — <span className="font-normal">{exp.company}</span></span>
                    <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                  </div>
                  {exp.responsibilities && (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-800 mt-0.5">
                      {exp.responsibilities.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          );
        }

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1 text-black">
                Technical Projects
              </h2>
              {projects.map((proj) => (
                <div key={proj.id} className="mb-1.5">
                  <div className="flex justify-between font-bold">
                    <span>
                      {proj.name}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="font-normal text-neutral-600"> ({proj.technologies.join(', ')})</span>
                      )}
                    </span>
                    {proj.date && <span>{proj.date}</span>}
                  </div>
                  {proj.highlights && (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-800">
                      {proj.highlights.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          );
        }

        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1 text-black">
                Technical Skills
              </h2>
              <div className="space-y-0.5">
                {skills.map((cat, idx) => (
                  <div key={idx}>
                    <span className="font-bold">{cat.category}: </span>
                    <span>{(cat.items || []).join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'hackathons' && hackathons.length > 0) {
          return (
            <section key="hackathons" className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1 text-black">
                Hackathons & Awards
              </h2>
              {hackathons.map((h) => (
                <div key={h.id} className="flex justify-between mb-0.5">
                  <span>
                    <span className="font-bold">{h.name}</span> — {h.project} ({h.achievement})
                  </span>
                  <span>{h.date || ''}</span>
                </div>
              ))}
            </section>
          );
        }

        if (sectionKey === 'certificates' && certificates.length > 0) {
          return (
            <section key="certificates" className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1 text-black">
                Certifications
              </h2>
              {certificates.map((c) => (
                <div key={c.id} className="flex justify-between mb-0.5">
                  <span>
                    <span className="font-bold">{c.name}</span> — {c.issuer}
                  </span>
                  <span>{c.date}</span>
                </div>
              ))}
            </section>
          );
        }

        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1 text-black">
                Honors & Achievements
              </h2>
              {achievements.map((a) => (
                <div key={a.id} className="mb-0.5">
                  <span className="font-bold">{a.title}</span> — {a.organization} ({a.date})
                </div>
              ))}
            </section>
          );
        }

        if (sectionKey === 'volunteering' && volunteering.length > 0) {
          return (
            <section key="volunteering" className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1 text-black">
                Volunteering
              </h2>
              {volunteering.map((v) => (
                <div key={v.id} className="mb-1">
                  <div className="flex justify-between font-bold">
                    <span>{v.role} — {v.organization}</span>
                    <span>{v.startDate} – {v.endDate}</span>
                  </div>
                </div>
              ))}
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};
