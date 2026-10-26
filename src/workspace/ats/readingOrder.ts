import { ResumeData } from '../../data/types';

export const SECTION_TITLES: Record<string, string> = {
  summary: 'SUMMARY / OBJECTIVE',
  objective: 'CAREER OBJECTIVE',
  work: 'WORK EXPERIENCE / INTERNSHIP',
  experience: 'WORK EXPERIENCE',
  education: 'EDUCATIONAL QUALIFICATIONS',
  projects: 'ACADEMIC PROJECTS',
  skills: 'TECHNICAL SKILLS',
  certificates: 'CERTIFICATIONS',
  certifications: 'CERTIFICATIONS',
  strengths: 'STRENGTHS',
  extracurricular: 'EXTRA-CURRICULAR ACTIVITIES',
  declaration: 'DECLARATION',
  achievements: 'ACHIEVEMENTS & HONORS',
  hackathons: 'HACKATHONS & COMPETITIONS',
  volunteering: 'VOLUNTEERING & LEADERSHIP',
  publications: 'PUBLICATIONS',
};

export const DEFAULT_SECTION_ORDER = [
  'summary',
  'education',
  'work',
  'projects',
  'skills',
  'hackathons',
  'achievements',
  'certificates',
  'volunteering',
];

export function hasSectionContent(resume: ResumeData, key: string): boolean {
  if (!resume) return false;
  switch (key) {
    case 'summary':
      return Boolean(resume.basics?.summary && resume.basics.summary.trim().length > 0);
    case 'objective':
      return Boolean(
        (resume.careerObjective && resume.careerObjective.trim().length > 0) ||
        (resume.basics?.summary && resume.basics.summary.trim().length > 0)
      );
    case 'education':
      return Array.isArray(resume.education) && resume.education.length > 0;
    case 'work':
    case 'experience':
    case 'internships':
      return Array.isArray(resume.work) && resume.work.length > 0;
    case 'projects':
      return Array.isArray(resume.projects) && resume.projects.length > 0;
    case 'skills':
      return Array.isArray(resume.skills) && resume.skills.length > 0;
    case 'certificates':
    case 'certifications': {
      const certs = resume.certificates || (resume as any).certifications;
      return Array.isArray(certs) && certs.length > 0;
    }
    case 'strengths':
      return Array.isArray(resume.strengths) && resume.strengths.length > 0;
    case 'extracurricular':
      return (
        (Array.isArray(resume.extracurricular) && resume.extracurricular.length > 0) ||
        (Array.isArray(resume.hackathons) && resume.hackathons.length > 0) ||
        (Array.isArray(resume.volunteering) && resume.volunteering.length > 0)
      );
    case 'declaration':
      return Boolean(resume.declaration?.text || resume.basics?.name);
    case 'achievements':
      return Array.isArray(resume.achievements) && resume.achievements.length > 0;
    case 'hackathons':
      return Array.isArray(resume.hackathons) && resume.hackathons.length > 0;
    case 'volunteering':
      return Array.isArray(resume.volunteering) && resume.volunteering.length > 0;
    case 'publications':
      return Array.isArray(resume.publications) && resume.publications.length > 0;
    default:
      return false;
  }
}

export function getActiveOrderedSections(resume: ResumeData): string[] {
  if (!resume) return [];
  const sectionOrder =
    resume.meta?.sectionOrder && resume.meta.sectionOrder.length > 0
      ? resume.meta.sectionOrder
      : DEFAULT_SECTION_ORDER;

  const hiddenSections = new Set(resume.meta?.hiddenSections || []);

  return sectionOrder.filter((key) => !hiddenSections.has(key) && hasSectionContent(resume, key));
}
