import { ResumeData, QualityAnalysisResult } from '@/data/types';

const WEAK_VERB_MAP: Record<string, string[]> = {
  'worked on': ['engineered', 'developed', 'architected', 'implemented'],
  'helped with': ['collaborated to deliver', 'assisted in architecting', 'co-designed'],
  'helped': ['facilitated', 'accelerated', 'enabled', 'supported'],
  'was responsible for': ['spearheaded', 'managed', 'owned', 'directed'],
  'assisted': ['collaborated with senior engineers to build', 'partnered to deploy'],
  'handled': ['managed', 'orchestrated', 'streamlined', 'administered'],
  'did': ['executed', 'performed', 'conducted', 'built'],
  'participated in': ['contributed to', 'partnered on', 'co-developed'],
  'made': ['constructed', 'generated', 'engineered', 'produced'],
  'tried to': ['executed initiatives to', 'tested strategies to'],
  'looked at': ['analyzed', 'audited', 'evaluated', 'investigated'],
};

const VAGUE_PHRASES = [
  { phrase: 'made it faster', fix: 'Specify latency reduction (e.g. "reduced latency by 30%")' },
  { phrase: 'did various tasks', fix: 'List the exact 2-3 technical deliverables accomplished' },
  { phrase: 'worked with the team', fix: 'State your distinct contribution (e.g. "collaborated with 4 engineers to deploy...")' },
  { phrase: 'helped improve', fix: 'Provide measurable metrics (e.g. "increased throughput from X to Y")' },
  { phrase: 'handled bugs', fix: 'State "resolved 20+ critical issues across unit and end-to-end test suites"' },
  { phrase: 'good at', fix: 'Demonstrate competency through project implementations rather than self-rating' },
];

export const QualityAnalyzer = {
  analyze(resume: ResumeData): QualityAnalysisResult {
    const weakVerbsFound: QualityAnalysisResult['weakVerbsFound'] = [];
    const vagueStatements: QualityAnalysisResult['vagueStatements'] = [];
    const inconsistentDates: QualityAnalysisResult['inconsistentDates'] = [];
    const duplicateSkills: QualityAnalysisResult['duplicateSkills'] = [];

    // 1. Scan Bullets for Weak Verbs & Vague Phrases
    const allBullets: { text: string; location: string }[] = [];

    if (Array.isArray(resume.work)) {
      resume.work.forEach((exp) => {
        if (Array.isArray(exp.responsibilities)) {
          exp.responsibilities.forEach((b) => {
            allBullets.push({ text: b, location: `Experience: ${exp.company} (${exp.position})` });
          });
        }
      });
    }

    if (Array.isArray(resume.projects)) {
      resume.projects.forEach((proj) => {
        if (Array.isArray(proj.highlights)) {
          proj.highlights.forEach((b) => {
            allBullets.push({ text: b, location: `Project: ${proj.name}` });
          });
        }
      });
    }

    if (Array.isArray(resume.volunteering)) {
      resume.volunteering.forEach((vol) => {
        if (Array.isArray(vol.contributions)) {
          vol.contributions.forEach((b) => {
            allBullets.push({ text: b, location: `Volunteering: ${vol.organization}` });
          });
        }
      });
    }

    allBullets.forEach(({ text, location }) => {
      const lower = text.toLowerCase();

      // Check weak verbs
      for (const [weakVerb, suggestions] of Object.entries(WEAK_VERB_MAP)) {
        const regex = new RegExp(`\\b${weakVerb}\\b`, 'i');
        if (regex.test(lower)) {
          weakVerbsFound.push({
            word: weakVerb,
            suggestion: suggestions.join(', '),
            location,
          });
        }
      }

      // Check vague phrases
      VAGUE_PHRASES.forEach(({ phrase, fix }) => {
        if (lower.includes(phrase)) {
          vagueStatements.push({
            text: phrase,
            suggestion: fix,
            reason: 'Vague statements fail to prove tangible engineering impact to recruiters.',
          });
        }
      });
    });

    // 2. Consistency Checks: Dates
    const checkDateOrder = (start: string, end: string, label: string) => {
      if (!start || !end || end.toLowerCase() === 'present' || end.toLowerCase() === 'current') return;
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        if (endDate < startDate) {
          inconsistentDates.push({
            item: label,
            issue: `End date (${end}) occurs before start date (${start}).`,
            fix: 'Correct the chronological order so start precedes end date.',
          });
        }
      }
    };

    if (Array.isArray(resume.education)) {
      resume.education.forEach((edu) => {
        checkDateOrder(edu.startDate, edu.endDate, `Education at ${edu.institution}`);
      });
    }

    if (Array.isArray(resume.work)) {
      resume.work.forEach((exp) => {
        checkDateOrder(exp.startDate, exp.endDate, `Experience at ${exp.company}`);
      });
    }

    if (Array.isArray(resume.volunteering)) {
      resume.volunteering.forEach((vol) => {
        checkDateOrder(vol.startDate, vol.endDate, `Volunteering at ${vol.organization}`);
      });
    }

    // 3. Consistency Checks: Duplicate Skills & Capitalization
    const seenSkills = new Map<string, string[]>(); // normalized -> actual names
    if (Array.isArray(resume.skills)) {
      resume.skills.forEach((cat) => {
        if (Array.isArray(cat.items)) {
          cat.items.forEach((skill) => {
            const normalized = skill.trim().toLowerCase().replace(/[.\s-]/g, '');
            const existing = seenSkills.get(normalized) || [];
            existing.push(`${skill} (in ${cat.category})`);
            seenSkills.set(normalized, existing);
          });
        }
      });
    }

    seenSkills.forEach((occurrences) => {
      if (occurrences.length > 1) {
        duplicateSkills.push({
          skill: occurrences[0].split(' (')[0],
          occurrences,
        });
      }
    });

    // 4. Completeness Score Calculation (Section 21)
    let personalScore = 0;
    const b = resume.basics;
    if (b?.name) personalScore += 30;
    if (b?.email) personalScore += 25;
    if (b?.phone) personalScore += 20;
    if (b?.location) personalScore += 15;
    if (b?.url || (Array.isArray(b?.profiles) && b.profiles.length > 0)) personalScore += 10;

    let educationScore = 0;
    if (Array.isArray(resume.education) && resume.education.length > 0) {
      educationScore = 50;
      const firstEdu = resume.education[0];
      if (firstEdu.cgpa) educationScore += 25;
      if (firstEdu.coursework && firstEdu.coursework.length > 0) educationScore += 25;
    }

    let projectsScore = 0;
    const projCount = Array.isArray(resume.projects) ? resume.projects.length : 0;
    if (projCount >= 2) projectsScore = 100;
    else if (projCount === 1) projectsScore = 60;

    let skillsScore = 0;
    const totalSkillsCount = Array.isArray(resume.skills) 
      ? resume.skills.reduce((acc, cat) => acc + (cat.items?.length || 0), 0) 
      : 0;
    if (totalSkillsCount >= 12) skillsScore = 100;
    else if (totalSkillsCount >= 6) skillsScore = 75;
    else if (totalSkillsCount > 0) skillsScore = 40;

    let experienceScore = 0;
    const workCount = Array.isArray(resume.work) ? resume.work.length : 0;
    if (workCount >= 2) experienceScore = 100;
    else if (workCount === 1) experienceScore = 70;
    else experienceScore = 20;

    const certCount = Array.isArray(resume.certificates) ? resume.certificates.length : 0;
    const achieveCount = (Array.isArray(resume.achievements) ? resume.achievements.length : 0) + 
      (Array.isArray(resume.hackathons) ? resume.hackathons.length : 0);

    let certScore = certCount > 0 ? 100 : 50;
    let achieveScore = achieveCount > 0 ? 100 : 50;

    const overallCompleteness = Math.round(
      personalScore * 0.15 +
      educationScore * 0.2 +
      projectsScore * 0.25 +
      skillsScore * 0.2 +
      experienceScore * 0.1 +
      certScore * 0.05 +
      achieveScore * 0.05
    );

    // Student advice for lack of traditional experience
    const studentAlternativesAdvice: string[] = [];
    if (experienceScore < 70) {
      studentAlternativesAdvice.push(
        'For freshers, recruiters evaluate Technical Projects and Open Source contributions equivalently to initial junior internships.'
      );
      studentAlternativesAdvice.push(
        'Highlight Hackathons & Coding Competitions: Add the problem solved, team role, and awards won.'
      );
      studentAlternativesAdvice.push(
        'Detail Relevant Academic Coursework: Mention advanced upper-division electives (e.g. Distributed Systems, Compilers).'
      );
      studentAlternativesAdvice.push(
        'Include Technical Volunteering or Club Leadership: Mentoring peers demonstrates communication and teamwork skills.'
      );
    }

    return {
      weakVerbsFound,
      vagueStatements,
      inconsistentDates,
      duplicateSkills,
      completeness: {
        personalInfo: Math.min(100, personalScore),
        education: Math.min(100, educationScore),
        experience: Math.min(100, experienceScore),
        projects: Math.min(100, projectsScore),
        skills: Math.min(100, skillsScore),
        certifications: Math.min(100, certScore),
        achievements: Math.min(100, achieveScore),
        overall: Math.min(100, overallCompleteness),
      },
      studentAlternativesAdvice,
    };
  },
};
