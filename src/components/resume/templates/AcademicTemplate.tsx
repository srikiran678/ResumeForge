import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
  resume: ResumeData;
}

export const AcademicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, volunteering, publications, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['education', 'work', 'projects', 'skills', 'achievements', 'publications', 'certificates', 'volunteering'];

  return (
    <div className="text-black bg-white p-8 max-w-[850px] mx-auto text-left leading-relaxed font-resumeAcademic text-xs">
      {/* Header */}
      <header className="text-center mb-5 border-b border-black pb-3">
        <h1 className="text-2xl font-bold tracking-normal uppercase text-black">{basics.name || 'Full Name'}</h1>
        {basics.label && <div className="text-sm italic text-neutral-800 mt-0.5">{basics.label}</div>}

        <div className="text-xs text-neutral-700 flex flex-wrap justify-center gap-x-2 mt-1">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.location && <span>• {basics.location}</span>}
          {basics.url && <span>• {basics.url}</span>}
          {basics.profiles?.map((p, idx) => (
            <span key={idx}>• {p.network}: {p.username || p.url}</span>
          ))}
        </div>
      </header>

      {/* Summary / Research Statement */}
      {basics.summary && !hidden.has('summary') && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
            Academic Background & Research Interests
          </h2>
          <p className="text-neutral-900 leading-normal">{basics.summary}</p>
        </section>
      )}

      {/* Sections */}
      {order.map((sectionKey) => {
        if (hidden.has(sectionKey)) return null;

        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between font-bold text-black">
                      <span>{edu.institution}, {edu.location || ''}</span>
                      <span>{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>
                    <div className="flex justify-between italic text-neutral-900">
                      <span>{edu.degree} in {edu.field}</span>
                      {edu.cgpa && <span className="font-semibold not-italic">Cumulative GPA: {edu.cgpa}</span>}
                    </div>
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

        if (sectionKey === 'work' && work.length > 0) {
          return (
            <section key="work" className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Research & Professional Experience
              </h2>
              <div className="space-y-3">
                {work.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between font-bold text-black">
                      <span>{exp.position}</span>
                      <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    <div className="italic text-neutral-800 mb-1">
                      {exp.company}, {exp.location}
                    </div>
                    {exp.responsibilities && (
                      <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-900">
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
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Academic & Laboratory Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between font-bold text-black">
                      <span>
                        {proj.name}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <span className="font-normal italic"> ({proj.technologies.join(', ')})</span>
                        )}
                      </span>
                      {proj.date && <span>{proj.date}</span>}
                    </div>
                    {proj.description && <p className="text-neutral-800 mb-1">{proj.description}</p>}
                    {proj.highlights && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-neutral-900">
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

        if (sectionKey === 'publications' && publications && publications.length > 0) {
          return (
            <section key="publications" className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Publications & Preprints
              </h2>
              <div className="space-y-1 text-neutral-900">
                {publications.map((p) => (
                  <div key={p.id}>
                    "{p.title}", <span className="italic">{p.publisher}</span>, {p.date}.
                    {p.url && <span className="text-neutral-600"> [{p.url}]</span>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Technical Competencies
              </h2>
              <div className="space-y-1 text-neutral-900">
                {skills.map((cat, idx) => (
                  <div key={idx}>
                    <span className="font-bold">{cat.category}: </span>
                    <span>{cat.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Academic Honors & Fellowships
              </h2>
              <div className="space-y-1.5 text-neutral-900">
                {achievements.map((a) => (
                  <div key={a.id}>
                    <span className="font-bold">{a.title}</span>, {a.organization} ({a.date})
                    {a.description && <div className="text-[11px] text-neutral-700">{a.description}</div>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'volunteering' && volunteering.length > 0) {
          return (
            <section key="volunteering" className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                Teaching & Community Service
              </h2>
              <div className="space-y-1.5 text-neutral-900">
                {volunteering.map((v) => (
                  <div key={v.id}>
                    <div className="flex justify-between font-bold">
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
