// Cover Letter Intelligence & Formatting Engine (Derived from ai-job-search methodology)
import { CoverLetterData, ResumeData, MasterProfile } from '@/data/types';

export interface GenerateCoverLetterParams {
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateLocation?: string;
  candidateLinkedIn?: string;
  role: string;
  company: string;
  jobDescription?: string;
  resumeData?: ResumeData;
  masterProfile?: MasterProfile;
  recipientName?: string;
}

/**
 * Extracts concrete achievement bullets from user's verified experiences and projects.
 * Avoids hallucinations by exclusively drawing from candidate's real data.
 */
export function extractTopAchievements(
  resumeData?: ResumeData, 
  masterProfile?: MasterProfile,
  jd?: string
): string[] {
  const candidateBullets: string[] = [];

  // 1. Gather bullets from resume
  if (resumeData) {
    if (Array.isArray(resumeData.work)) {
      resumeData.work.forEach((exp) => {
        if (Array.isArray(exp.responsibilities)) {
          candidateBullets.push(...exp.responsibilities.filter((b: string) => b && b.trim().length > 20));
        }
      });
    }
    if (Array.isArray(resumeData.projects)) {
      resumeData.projects.forEach((proj) => {
        if (Array.isArray(proj.highlights)) {
          candidateBullets.push(...proj.highlights.filter((b: string) => b && b.trim().length > 20));
        } else if (proj.description && proj.description.length > 20) {
          candidateBullets.push(proj.description);
        }
      });
    }
  }

  // 2. Fallback to master profile if resume bullets are sparse
  if (candidateBullets.length < 3 && masterProfile) {
    if (Array.isArray(masterProfile.experience)) {
      masterProfile.experience.forEach((exp) => {
        if (Array.isArray(exp.responsibilities)) {
          candidateBullets.push(...exp.responsibilities.filter((b: string) => b && b.trim().length > 20));
        }
      });
    }
    if (Array.isArray(masterProfile.projects)) {
      masterProfile.projects.forEach((proj) => {
        if (Array.isArray(proj.highlights)) {
          candidateBullets.push(...proj.highlights.filter((b: string) => b && b.trim().length > 20));
        } else if (proj.description && proj.description.length > 20) {
          candidateBullets.push(proj.description);
        }
      });
    }
  }

  // If candidate has real bullets, prioritize those with metrics or relevant terms
  if (candidateBullets.length > 0) {
    const scored = candidateBullets.map((bullet) => {
      let score = 0;
      if (/\d+%|\$\d+|\d+x|\b(increased|reduced|engineered|developed|optimized|delivered)\b/i.test(bullet)) {
        score += 3;
      }
      if (jd) {
        const jdWords = jd.toLowerCase().split(/\W+/).filter(w => w.length > 4);
        jdWords.forEach((word) => {
          if (bullet.toLowerCase().includes(word)) score += 1;
        });
      }
      return { bullet, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topThree = scored.slice(0, 3).map(s => s.bullet);
    return topThree;
  }

  // Never invent achievements. An empty list is safer than fabricated candidate evidence.
  return [];
}

/**
 * Generates an ATS-compliant, tailored Cover Letter structure according to ai-job-search standard.
 */
export function generateTailoredCoverLetter(params: GenerateCoverLetterParams): CoverLetterData {
  const {
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateLocation,
    candidateLinkedIn,
    role,
    company,
    jobDescription = '',
    resumeData,
    masterProfile,
    recipientName = 'Hiring Team'
  } = params;

  const topAchievements = extractTopAchievements(resumeData, masterProfile, jobDescription);
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const salutation = recipientName && recipientName !== 'Hiring Team'
    ? `Dear ${recipientName},`
    : `Dear Hiring Team at ${company || 'your organization'},`;

  const openingParagraph = `I am writing to apply for the ${role || '[target role]'} position at ${company || '[company]'}. I would welcome the opportunity to be considered and to explain how the verified experience and projects in my resume relate to this role.`;

  const bodyParagraph = topAchievements.length > 0
    ? `The following examples are drawn from my saved resume or master profile and are the most relevant evidence I can offer for this role:`
    : `My saved profile does not currently contain verified achievement examples to include. Add relevant evidence before sending this letter.`;

  const companyConnectionParagraph = `I would appreciate the opportunity to learn more about the team's priorities and discuss whether my documented skills and interests align with the role.`;

  const closingParagraph = `Thank you for your time and consideration. I would be pleased to discuss my application and provide any additional information needed.`;

  return {
    id: `cl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: `${role || 'Role'} Cover Letter - ${company || 'Company'}`,
    recipientName,
    company: company || '',
    role: role || '',
    jobDescription,
    date: formattedDate,
    salutation,
    openingParagraph,
    bodyParagraph,
    achievementBullets: topAchievements,
    companyConnectionParagraph,
    closingParagraph,
    signoff: 'Sincerely,',
    senderName: candidateName || '',
    senderEmail: candidateEmail || '',
    senderPhone: candidatePhone || '',
    senderLocation: candidateLocation || '',
    senderLinkedIn: candidateLinkedIn || '',
    fontFamily: 'inter',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Formats a CoverLetterData object into clean Markdown text.
 */
export function formatCoverLetterAsMarkdown(cl: CoverLetterData): string {
  const bullets = cl.achievementBullets.map(b => `- ${b}`).join('\n');
  return `# ${cl.senderName}
${cl.senderEmail} | ${cl.senderPhone || ''} | ${cl.senderLocation || ''} ${cl.senderLinkedIn ? `| ${cl.senderLinkedIn}` : ''}

**Date:** ${cl.date}  
**To:** ${cl.recipientName}, ${cl.company}

---

${cl.salutation}

${cl.openingParagraph}

${cl.bodyParagraph}

${bullets}

${cl.companyConnectionParagraph}

${cl.closingParagraph}

${cl.signoff}  
**${cl.senderName}**
`;
}
