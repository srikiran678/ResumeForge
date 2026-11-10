import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

/**
 * Wall Street / Investment Banking Template
 * The strict Bulge Bracket (Goldman Sachs, Morgan Stanley, J.P. Morgan) & WSO standard.
 * Characterized by hyper-dense 1-page efficiency, centered uppercase header,
 * prominent academic metrics (GPA, SAT, Honors), and quantitative deal-impact bullets.
 */
export const WallStreetTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, volunteering, meta } = resume;
  // Wall Street format strictly skips summary/objective by convention
  const hidden = new Set(meta.hiddenSections || ['summary']);
  const order = meta.sectionOrder || ['education', 'experience', 'projects', 'skills', 'achievements', 'volunteering'];

  return (
    <div className="text-black bg-white p-6 max-w-[850px] mx-auto text-left font-serif leading-tight selection:bg-slate-200">
      {/* Centered Strict IB Header */}
      <header className="text-center pb-2 mb-2.5 border-b-2 border-black">
        <h1 className="text-2xl font-bold tracking-wider text-black uppercase mb-1">
          {basics.name || 'FIRSTNAME LASTNAME'}
        </h1>
        <div className="text-[11px] text-neutral-900 flex flex-wrap justify-center items-center gap-x-2 font-serif">
          {basics.location && <span>{basics.location}</span>}
          {basics.phone && (
            <>
              <span>|</span>
              <span>{basics.phone}</span>
            </>
          )}
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
          {basics.profiles?.map((p, idx) => (
            <React.Fragment key={idx}>
              <span>|</span>
              <a href={p.url} target="_blank" rel="noreferrer" className="text-black hover:underline">
                {p.network}: {p.username || p.network}
              </a>
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        // 1. Education (Always First in IB)
        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[11px]">
                    <div className="flex justify-between items-baseline font-bold text-black">
                      <span>{edu.institution}</span>
                      <span>{edu.location || 'New York, NY'}</span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-neutral-900">
                      <span>{edu.degree} in {edu.field}</span>
                      <span className="not-italic font-medium">{edu.startDate} – {edu.endDate || 'Expected May 2026'}</span>
                    </div>
                    <div className="text-[10.5px] text-neutral-900 mt-0.5 space-y-0.5">
                      {edu.cgpa && (
                        <div>
                          <strong>Cumulative GPA:</strong> {edu.cgpa}
                          {edu.testScores ? ` | ${edu.testScores}` : ''}
                        </div>
                      )}
                      {edu.honors && edu.honors.length > 0 && (
                        <div>
                          <strong>Honors:</strong> {edu.honors.join(', ')}
                        </div>
                      )}
                      {edu.coursework && edu.coursework.length > 0 && (
                        <div>
                          <strong>Relevant Coursework:</strong> {edu.coursework.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 2. Professional & Transaction Experience
        if ((sectionKey === 'experience' || sectionKey === 'work') && work.length > 0) {
          return (
            <section key="work" className="mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Professional Experience
              </h2>
              <div className="space-y-2.5">
                {work.map((exp) => (
                  <div key={exp.id} className="text-[11px]">
                    <div className="flex justify-between items-baseline font-bold text-black">
                      <span>{exp.company}</span>
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-neutral-900 mb-0.5">
                      <span>{exp.position}</span>
                      <span className="not-italic">{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-950 text-[10.5px] leading-tight">
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

        // 3. Leadership & Academic Projects
        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Financial Modeling &amp; Selected Projects
              </h2>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-[11px]">
                    <div className="flex justify-between items-baseline font-bold text-black">
                      <span>{proj.name}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="font-normal italic text-[10.5px]">[{proj.technologies.join(', ')}]</span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-[10.5px] text-neutral-900 leading-tight mt-0.5">{proj.description}</p>
                    )}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-950 text-[10.5px] leading-tight mt-0.5">
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

        // 4. Skills, Certifications & Interests
        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
                Skills, Certifications &amp; Interests
              </h2>
              <div className="space-y-0.5 text-[10.5px] text-neutral-900">
                {skills.map((cat, idx) => (
                  <div key={idx} className="flex items-baseline">
                    <span className="font-bold text-black w-40 shrink-0">{cat.category}:</span>
                    <span>{(cat.items || []).join(', ')}</span>
                  </div>
                ))}
                {certificates && certificates.length > 0 && (
                  <div className="flex items-baseline">
                    <span className="font-bold text-black w-40 shrink-0">Certifications:</span>
                    <span>{certificates.map(c => `${c.name} (${c.issuer})`).join('; ')}</span>
                  </div>
                )}
              </div>
            </section>
          );
        }

        // 5. Extracurricular & Student Investments
        if (sectionKey === 'volunteering' && volunteering.length > 0) {
          return (
            <section key="volunteering" className="mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
                Leadership, Athletics &amp; Activities
              </h2>
              <div className="space-y-1.5 text-[10.5px] text-neutral-900">
                {volunteering.map((v) => (
                  <div key={v.id}>
                    <div className="flex justify-between items-baseline font-bold text-black">
                      <span>{v.organization} — {v.role}</span>
                      <span className="font-normal">{v.startDate} – {v.endDate}</span>
                    </div>
                    {v.contributions && v.contributions.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-950 mt-0.5">
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
