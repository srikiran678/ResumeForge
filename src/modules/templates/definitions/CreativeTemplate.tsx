import React from 'react';
import { ResumeData } from '@/data/types';

interface TemplateProps {
  resume: ResumeData;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['summary', 'skills', 'projects', 'work', 'education', 'hackathons', 'achievements'];

  return (
    <div className="text-slate-800 bg-white p-8 max-w-[850px] mx-auto text-left leading-relaxed font-sans">
      {/* Contemporary Indigo-Accented Header */}
      <header className="mb-5 pb-4 border-b border-indigo-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {basics.name || 'Your Full Name'}
            </h1>
            {basics.label && (
              <div className="text-sm font-semibold text-indigo-600 mt-0.5">
                {basics.label}
              </div>
            )}
          </div>
          <div className="text-xs text-slate-500 space-y-0.5 sm:text-right">
            {basics.email && <div>{basics.email}</div>}
            {basics.phone && <div>{basics.phone}</div>}
            {basics.location && <div>{basics.location}</div>}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600">
          {basics.url && <span className="px-2 py-0.5 bg-slate-100 rounded-md">{basics.url}</span>}
          {basics.profiles?.map((p, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded-md">
              {p.network}: {p.username || p.url}
            </span>
          ))}
        </div>
      </header>

      {/* Summary */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-5 bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100/60">
          <p className="text-xs text-slate-700 leading-relaxed">{basics.summary}</p>
        </section>
      )}

      {/* Ordered Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center space-x-2 mb-2">
                <span className="size-2 rounded-full bg-indigo-600"></span>
                <span>Skills & Toolbox</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {skills.map((cat, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wide">
                      {cat.category}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(cat.items || []).map((item, i) => (
                        <span key={i} className="text-[11px] px-1.5 py-0.5 bg-white rounded border border-slate-200 text-slate-700 font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center space-x-2 mb-2">
                <span className="size-2 rounded-full bg-indigo-600"></span>
                <span>Flagship Projects & Demos</span>
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-slate-50/60 rounded-xl border border-slate-200/60 text-xs">
                    <div className="flex justify-between items-baseline font-bold text-slate-900 mb-0.5">
                      <span className="text-[13px]">{proj.name}</span>
                      {proj.url && (
                        <span className="text-[11px] font-mono text-indigo-600 font-semibold underline">
                          {proj.url}
                        </span>
                      )}
                    </div>
                    {proj.description && <p className="text-slate-600 text-[11.5px] mb-1.5">{proj.description}</p>}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 text-[11px]">
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
            <section key="work" className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center space-x-2 mb-2">
                <span className="size-2 rounded-full bg-indigo-600"></span>
                <span>Work Experience</span>
              </h2>
              <div className="space-y-3">
                {work.map((w) => (
                  <div key={w.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{w.position}</span>
                      <span className="text-slate-500 text-[11px] font-normal">{w.startDate} – {w.endDate || 'Present'}</span>
                    </div>
                    <div className="text-slate-600 text-[11.5px] italic mb-1">
                      {w.company}{w.location ? `, ${w.location}` : ''}
                    </div>
                    {w.responsibilities && w.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 text-[11.5px]">
                        {w.responsibilities.map((r, idx) => (
                          <li key={idx}>{r}</li>
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
            <section key="education" className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center space-x-2 mb-2">
                <span className="size-2 rounded-full bg-indigo-600"></span>
                <span>Education</span>
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-slate-900">{edu.institution}</span>
                      <span className="text-slate-600"> — {edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="text-indigo-700 font-semibold text-[11px]"> (GPA: {edu.cgpa})</span>}
                    </div>
                    <span className="text-slate-500 text-[11px] font-mono">{edu.startDate} – {edu.endDate || 'Present'}</span>
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
