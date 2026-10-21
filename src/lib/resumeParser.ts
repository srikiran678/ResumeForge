import { MasterProfile, EducationItem, ExperienceItem, ProjectItem } from '../types';

export interface ExtractedResumeDraft {
  rawText: string;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
    education: Partial<EducationItem>[];
    experience: Partial<ExperienceItem>[];
    projects: Partial<ProjectItem>[];
    skills: string[];
  };
  confidenceScores: {
    name: number;
    email: number;
    phone: number;
    education: number;
    experience: number;
    projects: number;
    skills: number;
  };
}

export const ResumeParser = {
  // Parse text or file contents into a candidate draft
  parseResumeText(text: string): ExtractedResumeDraft {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const fields: ExtractedResumeDraft['fields'] = {
      education: [],
      experience: [],
      projects: [],
      skills: [],
    };

    const confidenceScores = {
      name: 0,
      email: 0,
      phone: 0,
      education: 0,
      experience: 0,
      projects: 0,
      skills: 0,
    };

    // 1. Email extraction
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      fields.email = emailMatch[0];
      confidenceScores.email = 95;
    }

    // 2. Phone extraction
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      fields.phone = phoneMatch[0];
      confidenceScores.phone = 90;
    }

    // 3. Name heuristic (first clean line that isn't email/phone/url)
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      if (
        !line.includes('@') &&
        !line.match(/\d{3}/) &&
        !line.toLowerCase().includes('http') &&
        line.split(' ').length >= 2 &&
        line.split(' ').length <= 4 &&
        line.length < 40
      ) {
        fields.name = line.replace(/[^a-zA-Z\s]/g, '').trim();
        confidenceScores.name = 85;
        break;
      }
    }

    // 4. Section Splitter Heuristic
    let currentSection = 'header';
    const sectionBuffers: Record<string, string[]> = {
      education: [],
      experience: [],
      projects: [],
      skills: [],
      summary: [],
    };

    lines.forEach((line) => {
      const lower = line.toLowerCase();
      if (/^(?:education|academic background|academics)$/i.test(line) || lower.startsWith('education')) {
        currentSection = 'education';
      } else if (/^(?:experience|work experience|employment|work history)$/i.test(line) || lower.startsWith('work experience')) {
        currentSection = 'experience';
      } else if (/^(?:projects|technical projects|academic projects)$/i.test(line) || lower.startsWith('projects')) {
        currentSection = 'projects';
      } else if (/^(?:skills|technical skills|skills & tools|core competencies)$/i.test(line) || lower.startsWith('skills')) {
        currentSection = 'skills';
      } else if (/^(?:summary|profile|professional summary|objective)$/i.test(line) || lower.startsWith('summary')) {
        currentSection = 'summary';
      } else {
        if (sectionBuffers[currentSection]) {
          sectionBuffers[currentSection].push(line);
        }
      }
    });

    // Parse Education
    if (sectionBuffers.education.length > 0) {
      confidenceScores.education = 80;
      const eduLines = sectionBuffers.education;
      const eduItem: Partial<EducationItem> = {
        id: `edu_parsed_${Date.now()}`,
        institution: eduLines[0] || 'University / Institution',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2021',
        endDate: '2025',
        cgpa: '',
        coursework: [],
      };

      eduLines.forEach((l) => {
        const match = l.match(/(?:gpa|cgpa):\s*([\d./]+)/i);
        if (match) {
          eduItem.cgpa = match[1];
        }
        if (l.toLowerCase().includes('coursework')) {
          eduItem.coursework = l.replace(/coursework:?/i, '').split(/[,;]/).map((s) => s.trim()).filter(Boolean);
        }
      });
      fields.education.push(eduItem);
    }

    // Parse Skills
    if (sectionBuffers.skills.length > 0) {
      confidenceScores.skills = 85;
      const skillText = sectionBuffers.skills.join(', ');
      const rawList = skillText
        .split(/[,•|;\n]/)
        .map((s) => s.replace(/^(?:languages|frameworks|tools|databases):/i, '').trim())
        .filter((s) => s.length > 1 && s.length < 30);
      fields.skills = Array.from(new Set(rawList));
    }

    // Parse Projects
    if (sectionBuffers.projects.length > 0) {
      confidenceScores.projects = 75;
      const projLines = sectionBuffers.projects;
      const highlights = projLines
        .filter((l) => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'))
        .map((l) => l.replace(/^[•\-*]\s*/, ''));
      if (highlights.length === 0 && projLines.length > 1) {
        highlights.push(projLines[1]);
      }
      const projItem: Partial<ProjectItem> = {
        id: `proj_parsed_${Date.now()}`,
        name: projLines[0] || 'Extracted Project',
        description: projLines.slice(1, 3).join(' '),
        technologies: [],
        highlights,
      };
      fields.projects.push(projItem);
    }

    // Parse Experience
    if (sectionBuffers.experience.length > 0) {
      confidenceScores.experience = 75;
      const expLines = sectionBuffers.experience;
      const responsibilities = expLines
        .filter((l) => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'))
        .map((l) => l.replace(/^[•\-*]\s*/, ''));
      if (responsibilities.length === 0 && expLines.length > 2) {
        responsibilities.push(expLines[2]);
      }
      const expItem: Partial<ExperienceItem> = {
        id: `exp_parsed_${Date.now()}`,
        company: expLines[0] || 'Organization',
        position: expLines[1] || 'Intern / Role',
        location: 'Remote',
        startDate: '2023',
        endDate: '2024',
        responsibilities,
      };
      fields.experience.push(expItem);
    }

    return {
      rawText: text,
      fields,
      confidenceScores,
    };
  },

  // Apply verified fields into Master Profile
  mergeVerifiedIntoProfile(
    profile: MasterProfile,
    verifiedFields: ExtractedResumeDraft['fields']
  ): MasterProfile {
    const updated = JSON.parse(JSON.stringify(profile)) as MasterProfile;

    if (verifiedFields.name) updated.personalInfo.fullName = verifiedFields.name;
    if (verifiedFields.email) updated.personalInfo.email = verifiedFields.email;
    if (verifiedFields.phone) updated.personalInfo.phone = verifiedFields.phone;
    if (verifiedFields.location) updated.personalInfo.location = verifiedFields.location;
    if (verifiedFields.summary) updated.personalInfo.summary = verifiedFields.summary;

    // Merge skills
    if (verifiedFields.skills.length > 0) {
      const existingLanguages = new Set(updated.skills.languages.map((s) => s.toLowerCase()));
      verifiedFields.skills.forEach((skill) => {
        if (!existingLanguages.has(skill.toLowerCase())) {
          updated.skills.other.push(skill);
        }
      });
    }

    // Append Education if non-empty
    verifiedFields.education.forEach((edu) => {
      if (edu.institution && !updated.education.some((e) => e.institution.toLowerCase() === edu.institution!.toLowerCase())) {
        updated.education.push({
          id: `edu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          institution: edu.institution,
          degree: edu.degree || 'Bachelor Degree',
          field: edu.field || 'General',
          startDate: edu.startDate || '2021',
          endDate: edu.endDate || '2025',
          cgpa: edu.cgpa || '',
          coursework: edu.coursework || [],
        });
      }
    });

    // Append Projects if non-empty
    verifiedFields.projects.forEach((proj) => {
      if (proj.name && !updated.projects.some((p) => p.name.toLowerCase() === proj.name!.toLowerCase())) {
        updated.projects.push({
          id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: proj.name,
          description: proj.description || '',
          technologies: proj.technologies || [],
          highlights: proj.highlights && proj.highlights.length > 0 ? proj.highlights : ['Built project using modern development workflows.'],
        });
      }
    });

    updated.updatedAt = new Date().toISOString();
    return updated;
  },
};
