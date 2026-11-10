import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

/**
 * Harvard Academic & Professional Template
 * Based on the official Harvard Mignone Center for Career Success formatting standards.
 * Emphasizes academic rigor, distinguished serif typography (Garamond/Georgia), 
 * balanced horizontal dividing rules, and conservative professional elegance.
 */
export const HarvardClassicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, volunteering, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['education', 'experience', 'projects', 'skills', 'achievements', 'volunteering'];

  return (
    <div className="text-neutral-900 bg-white p-8 max-w-[850px] mx-auto text-left font-serif leading-relaxed selection:bg-amber-100">
      {/* Centered Formal Header */}
      <header className="text-center pb-3 mb-4 border-b border-neutral-900">
        <h1 className="text-2xl font-bold tracking-wider text-neutral-950 uppercase mb-1">
          {basics.name || 'Your Full Name'}
        </h1>
        {basics.label && (
          <div className="text-xs italic text-neutral-700 mb-1">
            {basics.label}
          </div>
        )}
        <div className="text-[11px] text-neutral-800 flex flex-wrap justify-center items-center gap-x-2">
          {basics.location && <span>{basics.location}</span>}
          {basics.phone && (
            <>
              <span>•</span>
              <span>{basics.phone}</span>
            </>
          )}
          {basics.email && (
            <>
              <span>•</span>
              <a href={`mailto:${basics.email}`} className="text-neutral-900 hover:underline">{basics.email}</a>
            </>
          )}
          {basics.url && (
            <>
              <span>•</span>
              <a href={basics.url} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">{basics.url.replace(/^https?:\/\//, '')}</a>
            </>
          )}
          {basics.profiles?.map((p, idx) => (
            <React.Fragment key={idx}>
              <span>•</span>
              <a href={p.url} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">
                {p.network}: {p.username || p.network}
              </a>
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Summary (if enabled) */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-400 pb-0.5 mb-1.5">
            Profile Summary
          </h2>
          <p className="text-[11.5px] text-neutral-800 leading-normal">{basics.summary}</p>
        </section>
      )}

      {/* Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        // 1. Education
        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-400 pb-0.5 mb-2">
                Education
              </h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[11.5px]">
                    <div className="flex justify-between items-baseline font-bold text-neutral-950">
                      <span>{edu.institution}</span>
                      <span className="font-normal text-[11px] text-neutral-700">{edu.location}</span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-neutral-800">
                      <span>{edu.degree} in {edu.field}</span>
                      <span className="not-italic text-[11px] text-neutral-700">{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>
                    {edu.cgpa && (
                      <div className="text-[11px] text-neutral-800 mt-0.5">
                        <span className="font-semibold">Academic Standing:</span> Cumulative GPA: {edu.cgpa}
                        {edu.testScores ? ` • ${edu.testScores}` : ''}
                      </div>
                    )}
                    {edu.honors && edu.honors.length > 0 && (
                      <div className="text-[11px] text-neutral-800 mt-0.5">
                        <span className="font-semibold">Honors &amp; Distinctions:</span> {edu.honors.join(', ')}
                      </div>
                    )}
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="text-[11px] text-neutral-800 mt-0.5">
                        <span className="font-semibold">Selected Coursework:</span> {edu.coursework.join(', ')}
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
            <section key="work" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-400 pb-0.5 mb-2">
                Professional Experience
              </h2>
              <div className="space-y-3">
                {work.map((exp) => (
                  <div key={exp.id} className="text-[11.5px]">
                    <div className="flex justify-between items-baseline font-bold text-neutral-950">
                      <span>{exp.company}</span>
                      <span className="font-normal text-[11px] text-neutral-700">{exp.location}</span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-neutral-800 mb-1">
                      <span>{exp.position}</span>
                      <span className="not-italic text-[11px] text-neutral-700">{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-900 text-[11.5px] leading-relaxed">
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
            <section key="projects" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-400 pb-0.5 mb-2">
                Selected Research &amp; Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-[11.5px]">
                    <div className="flex justify-between items-baseline font-bold text-neutral-950">
                      <span>{proj.name}</span>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" className="font-normal text-[11px] text-neutral-700 hover:underline">
                          Link
                        </a>
                      )}
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="italic text-[11px] text-neutral-700">
                        {proj.technologies.join(', ')}
                      </div>
                    )}
                    {proj.description && (
                      <p className="text-[11px] text-neutral-800 mt-0.5 leading-normal">{proj.description}</p>
                    )}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-900 text-[11px] leading-relaxed mt-1">
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

        // 4. Skills & Interests
        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-400 pb-0.5 mb-2">
                Skills &amp; Interests
              </h2>
              <div className="space-y-1 text-[11.5px] text-neutral-900">
                {skills.map((cat, idx) => (
                  <div key={idx} className="flex items-baseline">
                    <span className="font-bold text-neutral-950 w-36 shrink-0">{cat.category}:</span>
                    <span>{(cat.items || []).join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 5. Honors & Awards
        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-400 pb-0.5 mb-2">
                Honors &amp; Fellowships
              </h2>
              <div className="space-y-1 text-[11.5px] text-neutral-900">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex justify-between items-baseline">
                    <span><strong className="text-neutral-950">{ach.title}</strong> — {ach.organization}</span>
                    <span className="text-neutral-600 text-[11px]">{ach.date}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 6. Leadership & Activities
        if (sectionKey === 'volunteering' && volunteering.length > 0) {
          return (
            <section key="volunteering" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-950 border-b border-neutral-400 pb-0.5 mb-2">
                Leadership &amp; Extracurricular Activities
              </h2>
              <div className="space-y-2 text-[11.5px] text-neutral-900">
                {volunteering.map((v) => (
                  <div key={v.id}>
                    <div className="flex justify-between items-baseline font-bold text-neutral-950">
                      <span>{v.organization}</span>
                      <span className="font-normal text-neutral-600 text-[11px]">{v.startDate} – {v.endDate}</span>
                    </div>
                    <div className="italic text-neutral-800 text-[11px]">{v.role}</div>
                    {v.contributions && v.contributions.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-900 text-[11px] mt-0.5">
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
