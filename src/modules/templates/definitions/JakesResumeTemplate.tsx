import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

/**
 * Jake's Resume Template (jakeryang/resume)
 * The open-source LaTeX standard favored by r/EngineeringResumes.
 * Features: Single column, razor-sharp baseline date alignments, 
 * compact horizontal rules, zero fluff, 100% ATS readability.
 */
export const JakesResumeTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, volunteering, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['education', 'experience', 'projects', 'skills', 'certifications', 'achievements'];

  return (
    <div className="text-black bg-white p-7 max-w-[850px] mx-auto text-left font-serif leading-tight selection:bg-slate-200">
      {/* Centered Header */}
      <header className="text-center pb-2 mb-3">
        <h1 className="text-2xl font-bold tracking-tight uppercase text-black mb-1">
          {basics.name || 'Your Full Name'}
        </h1>
        {basics.label && (
          <div className="text-xs font-semibold text-neutral-800 tracking-wide mb-1">
            {basics.label}
          </div>
        )}
        <div className="text-[11px] text-neutral-800 flex flex-wrap justify-center items-center gap-x-2">
          {basics.phone && <span>{basics.phone}</span>}
          {basics.email && (
            <>
              <span>|</span>
              <a href={`mailto:${basics.email}`} className="text-black hover:underline">{basics.email}</a>
            </>
          )}
          {basics.url && (
            <>
              <span>|</span>
              <a href={basics.url} target="_blank" rel="noreferrer" className="text-black hover:underline">{basics.url.replace(/^https?:\/\//, '')}</a>
            </>
          )}
          {basics.location && (
            <>
              <span>|</span>
              <span>{basics.location}</span>
            </>
          )}
          {basics.profiles?.map((p, idx) => (
            <React.Fragment key={idx}>
              <span>|</span>
              <a href={p.url} target="_blank" rel="noreferrer" className="text-black hover:underline">
                {p.username ? `${p.network}: ${p.username}` : p.network}
              </a>
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Summary (if enabled) */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Objective
          </h2>
          <p className="text-[11px] text-neutral-900 leading-normal">{basics.summary}</p>
        </section>
      )}

      {/* Dynamic Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        // 1. Education
        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[11.5px]">
                    <div className="flex justify-between items-baseline font-bold text-black">
                      <span>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</span>
                      <span className="font-normal text-[11px] text-neutral-800">{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-neutral-900">
                      <span className="italic">{edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="text-[11px] font-medium">GPA: {edu.cgpa}</span>}
                    </div>
                    {edu.honors && edu.honors.length > 0 && (
                      <div className="text-[10.5px] text-neutral-800 mt-0.5">
                        <span className="font-semibold">Honors:</span> {edu.honors.join(', ')}
                      </div>
                    )}
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="text-[10.5px] text-neutral-800 mt-0.5">
                        <span className="font-semibold">Relevant Coursework:</span> {edu.coursework.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 2. Experience / Work
        if ((sectionKey === 'experience' || sectionKey === 'work') && work.length > 0) {
          return (
            <section key="work" className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Experience
              </h2>
              <div className="space-y-2.5">
                {work.map((exp) => (
                  <div key={exp.id} className="text-[11.5px]">
                    <div className="flex justify-between items-baseline font-bold text-black">
                      <span>{exp.position}</span>
                      <span className="font-normal text-[11px] text-neutral-800">{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-neutral-900 mb-1">
                      <span>{exp.company}</span>
                      <span className="not-italic text-[11px] text-neutral-700">{exp.location}</span>
                    </div>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-900 text-[11px] leading-snug">
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

        // 3. Projects
        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Projects
              </h2>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-[11.5px]">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-black">{proj.name}</span>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <span className="text-[11px] text-neutral-800 ml-1.5">
                            | <em>{proj.technologies.join(', ')}</em>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-700">
                        {proj.url && (
                          <a href={proj.url} target="_blank" rel="noreferrer" className="text-black hover:underline mr-2">Link</a>
                        )}
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-black hover:underline">Code</a>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-[11px] text-neutral-900 mt-0.5 leading-snug">{proj.description}</p>
                    )}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-900 text-[11px] leading-snug mt-1">
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

        // 4. Technical Skills
        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
                Technical Skills
              </h2>
              <div className="space-y-1 text-[11px] text-neutral-900">
                {skills.map((cat, idx) => (
                  <div key={idx} className="flex items-baseline">
                    <span className="font-bold text-black w-32 shrink-0">{cat.category}:</span>
                    <span>{(cat.items || []).join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 5. Certifications
        if (sectionKey === 'certificates' && certificates.length > 0) {
          return (
            <section key="certificates" className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
                Certifications
              </h2>
              <div className="space-y-1 text-[11px] text-neutral-900">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-baseline">
                    <span><strong className="text-black">{cert.name}</strong> — {cert.issuer}</span>
                    <span className="text-neutral-700 text-[10.5px]">{cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 6. Achievements
        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
                Honors &amp; Awards
              </h2>
              <div className="space-y-1 text-[11px] text-neutral-900">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex justify-between items-baseline">
                    <span><strong className="text-black">{ach.title}</strong> — {ach.organization}</span>
                    <span className="text-neutral-700 text-[10.5px]">{ach.date}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 7. Hackathons
        if (sectionKey === 'hackathons' && hackathons.length > 0) {
          return (
            <section key="hackathons" className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
                Hackathons &amp; Competitions
              </h2>
              <div className="space-y-1 text-[11px] text-neutral-900">
                {hackathons.map((h) => (
                  <div key={h.id} className="flex justify-between items-baseline">
                    <span><strong className="text-black">{h.name}</strong> ({h.project}) — {h.achievement}</span>
                    <span className="text-neutral-700 text-[10.5px]">{h.date}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 8. Volunteering
        if (sectionKey === 'volunteering' && volunteering.length > 0) {
          return (
            <section key="volunteering" className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
                Leadership &amp; Extracurricular
              </h2>
              <div className="space-y-1.5 text-[11px] text-neutral-900">
                {volunteering.map((v) => (
                  <div key={v.id}>
                    <div className="flex justify-between items-baseline font-bold text-black">
                      <span>{v.role} — {v.organization}</span>
                      <span className="font-normal text-neutral-700 text-[10.5px]">{v.startDate} – {v.endDate}</span>
                    </div>
                    {v.contributions && v.contributions.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-900 mt-0.5">
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
