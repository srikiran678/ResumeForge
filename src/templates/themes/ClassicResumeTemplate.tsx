import React from 'react';
import { ResumeData } from '../../data/types';

interface ClassicResumeTemplateProps {
  resume: ResumeData;
}

export const ClassicResumeTemplate: React.FC<ClassicResumeTemplateProps> = ({ resume }) => {
  const {
    basics,
    education = [],
    work = [],
    projects = [],
    skills = [],
    certificates = [],
    strengths = [],
    extracurricular = [],
    declaration,
    meta,
  } = resume;

  const hidden = new Set(meta?.hiddenSections || []);
  const fontFamily = meta?.fontFamily || 'Arial';

  // Map font family selection to standard CSS font-family stacks
  const fontStyle = {
    fontFamily:
      fontFamily === 'Times New Roman'
        ? '"Times New Roman", Times, Georgia, serif'
        : fontFamily === 'Georgia'
        ? 'Georgia, serif'
        : fontFamily === 'Consolas'
        ? 'Consolas, monospace'
        : fontFamily === 'Inter'
        ? 'Inter, sans-serif'
        : 'Arial, Calibri, "Helvetica Neue", sans-serif',
  };

  const objectiveText = resume.careerObjective || basics.summary || '';

  // Fallback for extracurricular from hackathons & volunteering if not explicitly populated
  const effectiveExtracurricular =
    extracurricular.length > 0
      ? extracurricular
      : [
          ...(resume.hackathons || []).map(
            (h) => `${h.name} — ${h.achievement}${h.project ? ` (${h.project})` : ''}`
          ),
          ...(resume.volunteering || []).map(
            (v) => `${v.role} at ${v.organization}${v.contributions?.length ? `: ${v.contributions.join('; ')}` : ''}`
          ),
        ];

  // Default declaration text and details
  const declarationText =
    declaration?.text ||
    'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.';
  const declarationPlace = declaration?.place || basics.location || '';
  const declarationDate = declaration?.date || '';
  const declarationSignature = declaration?.signature || basics.name || '';

  return (
    <div
      style={fontStyle}
      className="text-black bg-white p-10 max-w-[850px] mx-auto text-left leading-normal text-[13px] print:p-8"
    >
      {/* A. Resume Header */}
      <header className="text-center mb-4">
        <h1 className="text-base font-bold tracking-widest uppercase mb-1 text-black">
          RESUME
        </h1>
        <div className="text-xl font-bold tracking-wider uppercase mb-1.5 text-black">
          {basics.name || 'CANDIDATE NAME'}
        </div>
        <div className="text-xs text-neutral-800 space-y-0.5 leading-relaxed">
          {basics.location && <div>Address: {basics.location}</div>}
          <div className="flex flex-wrap justify-center items-center gap-x-3">
            {basics.phone && <span>Contact: {basics.phone}</span>}
            {basics.phone && basics.email && <span>|</span>}
            {basics.email && <span>Email: {basics.email}</span>}
          </div>
        </div>
        <div className="border-b border-black mt-3" />
      </header>

      {/* B. Career Objective */}
      {objectiveText && !hidden.has('objective') && !hidden.has('summary') && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            CAREER OBJECTIVE
          </h2>
          <p className="text-xs text-neutral-900 leading-relaxed text-justify">
            {objectiveText}
          </p>
        </section>
      )}

      {/* C. Educational Qualifications */}
      {education.length > 0 && !hidden.has('education') && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            EDUCATIONAL QUALIFICATIONS
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-xs my-1">
              <thead>
                <tr className="border-b border-black bg-neutral-100/60 print:bg-transparent">
                  <th className="border border-black p-1.5 text-left font-bold w-[22%]">
                    Qualification
                  </th>
                  <th className="border border-black p-1.5 text-left font-bold w-[30%]">
                    Institution
                  </th>
                  <th className="border border-black p-1.5 text-left font-bold w-[24%]">
                    University / Board
                  </th>
                  <th className="border border-black p-1.5 text-center font-bold w-[11%]">
                    Year
                  </th>
                  <th className="border border-black p-1.5 text-center font-bold w-[13%]">
                    CGPA / %
                  </th>
                </tr>
              </thead>
              <tbody>
                {education.map((edu, idx) => {
                  const qual =
                    edu.qualification ||
                    edu.degree ||
                    (edu.field ? `${edu.degree || 'Degree'} in ${edu.field}` : 'Degree');
                  const inst = edu.institution || '—';
                  const board = edu.board || edu.location || '—';
                  const year =
                    edu.year ||
                    (edu.startDate && edu.endDate
                      ? `${edu.startDate} - ${edu.endDate}`
                      : edu.endDate || edu.startDate || '—');
                  const grade = edu.percentage || edu.cgpa || '—';

                  return (
                    <tr key={edu.id || idx} className="border-b border-black">
                      <td className="border border-black p-1.5 align-top font-medium">
                        {qual}
                      </td>
                      <td className="border border-black p-1.5 align-top">
                        {inst}
                      </td>
                      <td className="border border-black p-1.5 align-top">
                        {board}
                      </td>
                      <td className="border border-black p-1.5 text-center align-top whitespace-nowrap">
                        {year}
                      </td>
                      <td className="border border-black p-1.5 text-center align-top whitespace-nowrap font-medium">
                        {grade}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* D. Technical Skills */}
      {skills.length > 0 && !hidden.has('skills') && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            TECHNICAL SKILLS
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-neutral-900">
            {skills.map((cat, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="font-bold text-black">{cat.category}: </span>
                <span>{cat.items?.join(', ')}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* E. Academic Project */}
      {projects.length > 0 && !hidden.has('projects') && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            ACADEMIC PROJECT
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs space-y-1">
                <div className="font-bold text-black text-[13px]">
                  Project: {proj.name}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="font-normal italic text-neutral-800 text-xs">
                      {' '}
                      (Technologies: {proj.technologies.join(', ')})
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-neutral-900 leading-relaxed text-justify">
                    {proj.description}
                  </p>
                )}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-900">
                    {proj.highlights.map((h, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* F. Internship / Training */}
      {work.length > 0 && !hidden.has('work') && !hidden.has('internships') && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            INTERNSHIP / TRAINING
          </h2>
          <div className="space-y-3">
            {work.map((exp) => (
              <div key={exp.id} className="text-xs space-y-1">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>
                    {exp.position}
                    {exp.company ? ` — ${exp.company}` : ''}
                  </span>
                  {(exp.startDate || exp.endDate) && (
                    <span className="font-normal text-neutral-800 text-[11px] whitespace-nowrap">
                      {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}
                    </span>
                  )}
                </div>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-900">
                    {exp.responsibilities.map((r, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* G. Certifications */}
      {certificates.length > 0 && !hidden.has('certificates') && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            CERTIFICATIONS
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-neutral-900">
            {certificates.map((cert) => (
              <li key={cert.id} className="leading-relaxed">
                <span className="font-bold text-black">{cert.name}</span>
                {cert.issuer && <span> — {cert.issuer}</span>}
                {cert.date && <span className="text-neutral-700"> ({cert.date})</span>}
                {cert.credentialUrl && (
                  <span className="text-neutral-600 font-mono text-[11px]">
                    {' '}
                    [ID/Link: {cert.credentialUrl}]
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* H. Strengths */}
      {strengths.length > 0 && !hidden.has('strengths') && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            STRENGTHS
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-neutral-900">
            {strengths.map((str, idx) => (
              <li key={idx} className="leading-relaxed">
                {str}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* I. Extra-Curricular Activities */}
      {effectiveExtracurricular.length > 0 && !hidden.has('extracurricular') && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            EXTRA-CURRICULAR ACTIVITIES
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-neutral-900">
            {effectiveExtracurricular.map((act, idx) => (
              <li key={idx} className="leading-relaxed">
                {act}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* J. Declaration */}
      {!hidden.has('declaration') && (
        <section className="mt-5 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
            DECLARATION
          </h2>
          <p className="text-xs text-neutral-900 leading-relaxed mb-8 text-justify">
            {declarationText}
          </p>

          <div className="flex justify-between items-end text-xs font-medium text-black">
            <div className="space-y-1">
              <div>Place: {declarationPlace}</div>
              <div>Date: {declarationDate}</div>
            </div>
            <div className="text-right">
              <div>({declarationSignature})</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
