import { ResumeData } from '../../data/types';

// Generates the raw string exactly as an ATS parser or Notepad copy-paste sees it
export function generateRawTextStream(resume: ResumeData): string {
  if (!resume || !resume.basics) return '';
  const lines: string[] = [];

  // Header / Basics
  if (resume.basics.name) lines.push(resume.basics.name.toUpperCase());
  if (resume.basics.label) lines.push(resume.basics.label);

  const contactParts: string[] = [];
  if (resume.basics.email) contactParts.push(resume.basics.email);
  if (resume.basics.phone) contactParts.push(resume.basics.phone);
  if (resume.basics.location) contactParts.push(resume.basics.location);
  if (resume.basics.url) contactParts.push(resume.basics.url);
  if (Array.isArray(resume.basics.profiles)) {
    resume.basics.profiles.forEach((p) => contactParts.push(p.url || `${p.network}: ${p.username}`));
  }
  if (contactParts.length > 0) lines.push(contactParts.join(' | '));
  lines.push('');

  // Summary
  if (resume.basics.summary && !resume.meta?.hiddenSections?.includes('summary')) {
    lines.push('SUMMARY');
    lines.push(resume.basics.summary);
    lines.push('');
  }

  // Iterate sections in defined order
  const order = resume.meta?.sectionOrder || [
    'education',
    'work',
    'projects',
    'skills',
    'hackathons',
    'achievements',
    'certificates',
    'volunteering',
  ];

  const hidden = resume.meta?.hiddenSections || [];

  order.forEach((sectionKey) => {
    if (hidden.includes(sectionKey)) return;

    if (sectionKey === 'education' && Array.isArray(resume.education) && resume.education.length > 0) {
      lines.push('EDUCATION');
      resume.education.forEach((edu) => {
        lines.push(`${edu.institution} - ${edu.location || ''}`);
        lines.push(`${edu.degree} in ${edu.field} | CGPA: ${edu.cgpa}`);
        lines.push(`Dates: ${edu.startDate} - ${edu.endDate || 'Present'}`);
        if (edu.coursework && edu.coursework.length > 0) {
          lines.push(`Coursework: ${(edu.coursework || []).join(', ')}`);
        }
        lines.push('');
      });
    }

    if (sectionKey === 'work' && Array.isArray(resume.work) && resume.work.length > 0) {
      lines.push('EXPERIENCE');
      resume.work.forEach((exp) => {
        lines.push(`${exp.position} - ${exp.company} (${exp.location})`);
        lines.push(`Dates: ${exp.startDate} - ${exp.endDate || 'Present'}`);
        if (exp.technologies && exp.technologies.length > 0) {
          lines.push(`Technologies: ${(exp.technologies || []).join(', ')}`);
        }
        (exp.responsibilities || []).forEach((b) => lines.push(`• ${b}`));
        lines.push('');
      });
    }

    if (sectionKey === 'projects' && Array.isArray(resume.projects) && resume.projects.length > 0) {
      lines.push('PROJECTS');
      resume.projects.forEach((proj) => {
        const techStr = (proj.technologies || []).length > 0 ? ` | ${proj.technologies.join(', ')}` : '';
        lines.push(`${proj.name}${techStr}`);
        if (proj.url || proj.githubUrl) {
          lines.push(`Links: ${[proj.url, proj.githubUrl].filter(Boolean).join(' | ')}`);
        }
        if (proj.description) lines.push(proj.description);
        (proj.highlights || []).forEach((h) => lines.push(`• ${h}`));
        lines.push('');
      });
    }

    if (sectionKey === 'skills' && Array.isArray(resume.skills) && resume.skills.length > 0) {
      lines.push('SKILLS');
      resume.skills.forEach((cat) => {
        lines.push(`${cat.category}: ${(cat.items || []).join(', ')}`);
      });
      lines.push('');
    }

    if (sectionKey === 'hackathons' && Array.isArray(resume.hackathons) && resume.hackathons.length > 0) {
      lines.push('HACKATHONS & COMPETITIONS');
      resume.hackathons.forEach((h) => {
        lines.push(`${h.name} - ${h.organization} | Award: ${h.achievement}`);
        const hTech = (h.technologies || []).length > 0 ? ` (${h.technologies.join(', ')})` : '';
        lines.push(`Project: ${h.project}${hTech}`);
        lines.push('');
      });
    }

    if (sectionKey === 'achievements' && Array.isArray(resume.achievements) && resume.achievements.length > 0) {
      lines.push('ACHIEVEMENTS & HONORS');
      resume.achievements.forEach((a) => {
        lines.push(`${a.title} - ${a.organization} (${a.date})`);
        lines.push(a.description);
        lines.push('');
      });
    }

    if (sectionKey === 'certificates' && Array.isArray(resume.certificates) && resume.certificates.length > 0) {
      lines.push('CERTIFICATIONS');
      resume.certificates.forEach((c) => {
        lines.push(`${c.name} - ${c.issuer} (${c.date})`);
        if (c.credentialUrl) lines.push(`Credential: ${c.credentialUrl}`);
        lines.push('');
      });
    }

    if (sectionKey === 'volunteering' && Array.isArray(resume.volunteering) && resume.volunteering.length > 0) {
      lines.push('VOLUNTEERING & LEADERSHIP');
      resume.volunteering.forEach((v) => {
        lines.push(`${v.role} - ${v.organization} (${v.startDate} - ${v.endDate})`);
        v.contributions.forEach((c) => lines.push(`• ${c}`));
        lines.push('');
      });
    }
  });

  return lines.join('\n');
}
