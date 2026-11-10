import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

/**
 * McKinsey & Company / Management Consulting Template
 * Tailored for MBB (McKinsey, BCG, Bain) strategy consulting, tech PM, and executive roles.
 * Emphasizes structured problem-solving, quantifiable client results, team leadership,
 * and high-stakes transformation initiatives.
 */
export const McKinseyTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, volunteering, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['education', 'experience', 'projects', 'skills', 'achievements', 'volunteering'];
  const accentColor = meta.accentColor || '#0f172a'; // Deep Navy / Charcoal

  return (
    <div className="text-slate-900 bg-white p-7 max-w-[850px] mx-auto text-left font-sans leading-normal selection:bg-slate-200">
      {/* Executive Clean Header */}
      <header className="pb-3 mb-3 border-b-2" style={{ borderColor: accentColor }}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950">
              {basics.name || 'Your Full Name'}
            </h1>
            {basics.label && (
              <div className="text-xs font-semibold tracking-wide text-slate-700 mt-0.5">
                {basics.label}
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-2 sm:text-right font-medium">
            {basics.location && <span>{basics.location}</span>}
            {basics.phone && <span>• {basics.phone}</span>}
            {basics.email && (
              <span>• <a href={`mailto:${basics.email}`} className="text-slate-900 hover:underline">{basics.email}</a></span>
            )}
            {basics.url && (
              <span>• <a href={basics.url} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline">{basics.url.replace(/^https?:\/\//, '')}</a></span>
            )}
          </div>
        </div>
      </header>

      {/* Executive Summary (if enabled) */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-3">
          <p className="text-xs text-slate-700 leading-relaxed font-normal">{basics.summary}</p>
        </section>
      )}

      {/* Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        // 1. Education
        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5 flex items-center justify-between">
                <span>Education</span>
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{edu.institution}</span>
                      <span className="font-normal text-[11px] text-slate-600">{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-slate-700">
                      <span>{edu.degree} in {edu.field}</span>
                      <span className="text-[11px] text-slate-600">{edu.location}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5 space-y-0.5">
                      {edu.cgpa && <div><strong>GPA:</strong> {edu.cgpa}{edu.testScores ? ` • ${edu.testScores}` : ''}</div>}
                      {edu.honors && edu.honors.length > 0 && <div><strong>Honors:</strong> {edu.honors.join(', ')}</div>}
                      {edu.coursework && edu.coursework.length > 0 && <div><strong>Coursework:</strong> {edu.coursework.join(', ')}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 2. Experience (Leadership & Client Impact Focus)
        if ((sectionKey === 'experience' || sectionKey === 'work') && work.length > 0) {
          return (
            <section key="work" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
                Professional Experience &amp; Leadership
              </h2>
              <div className="space-y-3">
                {work.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-950 text-[12px]">{exp.company}</span>
                      <span className="text-[11px] text-slate-600">{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-slate-700 mb-1 italic">
                      <span>{exp.position}</span>
                      <span className="not-italic text-[11px] text-slate-500">{exp.location}</span>
                    </div>
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

        // 3. Strategic Initiatives & Projects
        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
                Strategic Initiatives &amp; Projects
              </h2>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{proj.name}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="font-normal italic text-[11px] text-slate-600">
                          {proj.technologies.join(' • ')}
                        </span>
                      )}
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

        // 4. Skills & Additional Information
        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
                Skills, Languages &amp; Certifications
              </h2>
              <div className="space-y-1 text-xs text-slate-800">
                {skills.map((cat, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="font-bold text-slate-950 sm:w-36 shrink-0 text-[11.5px]">{cat.category}:</span>
                    <span className="text-slate-700 text-[11.5px]">{(cat.items || []).join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 5. Honors & Fellowships
        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
                Honors &amp; Fellowships
              </h2>
              <div className="space-y-1 text-xs text-slate-800">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex justify-between items-baseline">
                    <span><strong className="text-slate-900">{ach.title}</strong> — {ach.organization}</span>
                    <span className="text-slate-500 text-[10.5px]">{ach.date}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 6. Leadership & Extracurricular
        if (sectionKey === 'volunteering' && volunteering.length > 0) {
          return (
            <section key="volunteering" className="mb-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
                Community Leadership &amp; Board Service
              </h2>
              <div className="space-y-1.5 text-xs text-slate-800">
                {volunteering.map((v) => (
                  <div key={v.id}>
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{v.role} — {v.organization}</span>
                      <span className="font-normal text-slate-500 text-[10.5px]">{v.startDate} – {v.endDate}</span>
                    </div>
                    {v.contributions && v.contributions.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700 text-[11px] mt-0.5">
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
