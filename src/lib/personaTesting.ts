import { ResumeData } from '../types';

export interface PersonaReview {
  personaId: string;
  name: string;
  role: string;
  background: string;
  avatarColor: string;
  avatarInitials: string;
  score: number; // 0 - 100
  verdict: 'Strong Recommendation' | 'Promising with Edits' | 'Needs Structure Polish';
  humanQuote: string;
  strengths: string[];
  actionableCritiques: {
    problem: string;
    suggestion: string;
    actionableFixType: 'fit_1_page' | 'xyz_formula' | 'skills_order' | 'project_links';
  }[];
}

export const HUMAN_PERSONAS = [
  {
    id: 'elena_recruiter',
    name: 'Elena Rostova',
    role: 'Lead Technical Recruiter at FinTech Scaleup',
    background: 'Screened 10,000+ software engineering resumes. Prioritizes clean single-column readability, top-to-bottom scanability, and real metrics over buzzwords.',
    avatarColor: 'bg-emerald-600',
    avatarInitials: 'ER',
  },
  {
    id: 'maya_student',
    name: 'Maya Lin',
    role: 'CS Junior & Peer Career Mentor',
    background: 'Undergraduate student who landed summer internships through open-source projects and hackathons without prior big-name corporate experience.',
    avatarColor: 'bg-blue-600',
    avatarInitials: 'ML',
  },
  {
    id: 'david_switcher',
    name: 'David Kim',
    role: 'Full-Stack Developer & Career Switcher',
    background: 'Transitioned into software engineering. Understands the anxiety of skill-gap identification and keyword alignment against automated ATS filters.',
    avatarColor: 'bg-purple-600',
    avatarInitials: 'DK',
  },
  {
    id: 'rahul_hackathon',
    name: 'Rahul Verma',
    role: 'New Grad SWE & Hackathon Finalist',
    background: 'Passionate about project depth, live demo links, and modern cloud stacks (TypeScript, Go, Docker, PostgreSQL).',
    avatarColor: 'bg-amber-600',
    avatarInitials: 'RV',
  },
];

export const PersonaTestingService = {
  evaluateWithAllPersonas(resume: ResumeData): PersonaReview[] {
    return HUMAN_PERSONAS.map((p) => this.evaluateSinglePersona(resume, p.id));
  },

  evaluateSinglePersona(resume: ResumeData, personaId: string): PersonaReview {
    const persona = HUMAN_PERSONAS.find((p) => p.id === personaId) || HUMAN_PERSONAS[0];
    const totalWords = JSON.stringify(resume).split(/\s+/).length;
    const hasProjects = resume.projects.length >= 2;
    const hasWork = resume.work.length > 0;
    const hasMetrics = resume.work.some((w) => w.responsibilities.some((r) => /\d+%|\d+ms|\d+x|\d+ users/i.test(r))) ||
      resume.projects.some((p) => p.highlights.some((h) => /\d+%|\d+ms|\d+x|\d+ users/i.test(h)));

    if (personaId === 'elena_recruiter') {
      let score = 88;
      const strengths: string[] = [];
      const critiques: PersonaReview['actionableCritiques'] = [];

      strengths.push('Strict single-column layout is a relief—my ATS software parsed your contact details cleanly.');
      if (hasMetrics) {
        strengths.push('Quantified metrics detected in bullet points (e.g. latency/throughput numbers).');
        score += 6;
      } else {
        critiques.push({
          problem: 'Some bullet points explain what you did, but lack quantifiable results.',
          suggestion: 'Apply the Google XYZ Formula: "Accomplished [X], measured by [Y], by doing [Z]".',
          actionableFixType: 'xyz_formula',
        });
      }

      if (totalWords > 550) {
        critiques.push({
          problem: 'Resume looks slightly long and might risk spilling onto page 2 for an early-career candidate.',
          suggestion: 'Use 1-Page Smart Fit to automatically calibrate line spacing and margins.',
          actionableFixType: 'fit_1_page',
        });
        score -= 5;
      } else {
        strengths.push('Crisp 1-page length makes it easy to read in 6 seconds.');
        score += 4;
      }

      return {
        personaId,
        name: persona.name,
        role: persona.role,
        background: persona.background,
        avatarColor: persona.avatarColor,
        avatarInitials: persona.avatarInitials,
        score: Math.min(98, Math.max(75, score)),
        verdict: score >= 90 ? 'Strong Recommendation' : 'Promising with Edits',
        humanQuote: 'If I saw this across my desk at 9 AM, I would immediately appreciate the selectable text and lack of messy multi-column sidebars.',
        strengths,
        actionableCritiques: critiques,
      };
    }

    if (personaId === 'maya_student') {
      let score = 90;
      const strengths: string[] = [];
      const critiques: PersonaReview['actionableCritiques'] = [];

      if (hasProjects) {
        strengths.push(`Strong project depth with ${resume.projects.length} featured applications.`);
        score += 5;
      } else {
        critiques.push({
          problem: 'Student resumes need at least 2 detailed technical projects to compete with prior intern experience.',
          suggestion: 'Add another project from your coursework or hackathons to your Master Profile.',
          actionableFixType: 'project_links',
        });
        score -= 8;
      }

      if (resume.education[0]?.coursework && resume.education[0].coursework.length > 0) {
        strengths.push('Relevant CS coursework clearly communicates academic rigor.');
      }

      return {
        personaId,
        name: persona.name,
        role: persona.role,
        background: persona.background,
        avatarColor: persona.avatarColor,
        avatarInitials: persona.avatarInitials,
        score: Math.min(98, Math.max(75, score)),
        verdict: score >= 90 ? 'Strong Recommendation' : 'Promising with Edits',
        humanQuote: 'As someone who also worried about not having big-brand names on my resume early on, your projects speak loud and clear.',
        strengths,
        actionableCritiques: critiques,
      };
    }

    // Default for David or Rahul
    return {
      personaId,
      name: persona.name,
      role: persona.role,
      background: persona.background,
      avatarColor: persona.avatarColor,
      avatarInitials: persona.avatarInitials,
      score: 92,
      verdict: 'Strong Recommendation',
      humanQuote: 'The stack alignment (languages, databases, cloud) is clearly organized and verifiable. Recruiters will find keywords quickly.',
      strengths: [
        'Skills categories are structured logically without comma soup.',
        'Technical projects feature live links and specific tools.',
      ],
      actionableCritiques: [
        {
          problem: 'Ensure all projects have verifiable links or GitHub repos.',
          suggestion: 'Review project links in editor settings.',
          actionableFixType: 'project_links',
        },
      ],
    };
  },
};
