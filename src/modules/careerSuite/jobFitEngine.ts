// Job Match & 5-Dimensional Fit Scoring Engine (Derived from ai-job-search framework)
import { JobFitResult, GateEvaluation, ResumeData, MasterProfile } from '@/data/types';

export interface EvaluateJobFitParams {
  role: string;
  company: string;
  jobDescription: string;
  resumeData?: ResumeData;
  masterProfile?: MasterProfile;
  candidateLocation?: string;
  candidateCitizenship?: string;
}

const COMMON_TECH_SKILLS = [
  'react', 'next.js', 'vue', 'angular', 'svelte', 'typescript', 'javascript',
  'python', 'django', 'fastapi', 'flask', 'node.js', 'express', 'nest.js',
  'java', 'spring', 'go', 'golang', 'rust', 'c++', 'c#', '.net',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
  'graphql', 'rest api', 'aws', 'gcp', 'azure', 'docker', 'kubernetes',
  'terraform', 'ci/cd', 'github actions', 'tailwind css', 'vite', 'webpack',
  'html', 'css', 'git', 'linux', 'testing', 'jest', 'vitest', 'playwright',
  'machine learning', 'pytorch', 'tensorflow', 'llm', 'rag', 'pandas'
];

/**
 * Checks the pre-scoring Eligibility Gate (Citizenship, Clearances, Sponsorship).
 */
export function checkEligibilityGate(jd: string, _candidateCitizenship = ''): GateEvaluation {
  const lower = jd.toLowerCase();

  // Hard stop indicators
  if (
    lower.includes('must be a us citizen') ||
    lower.includes('u.s. citizenship required') ||
    lower.includes('security clearance required') ||
    lower.includes('active secret clearance') ||
    lower.includes('ts/sci') ||
    lower.includes('permanent resident only')
  ) {
    const match = jd.match(/(must be a (?:u\.s\. )?citizen|security clearance required|active (?:secret|top secret) clearance|ts\/sci)/i);
    return {
      status: 'FAIL',
      reason: 'Role requires explicit citizenship or national security clearance.',
      quotedRequirement: match ? match[0] : 'Specific citizenship/clearance requirement stated.'
    };
  }

  // No sponsorship indicator
  if (
    lower.includes('no sponsorship') ||
    lower.includes('unable to sponsor') ||
    lower.includes('not offering visa sponsorship') ||
    lower.includes('must be legally authorized to work without sponsorship')
  ) {
    const match = jd.match(/(no sponsorship|unable to sponsor|not offering visa sponsorship|without sponsorship)/i);
    return {
      status: 'FLAG',
      reason: 'Employer does not provide visa sponsorship; requires pre-existing legal work authorization.',
      quotedRequirement: match ? match[0] : 'Sponsorship limitation noted.'
    };
  }

  // Clear or welcoming
  if (
    lower.includes('visa sponsorship available') ||
    lower.includes('will sponsor') ||
    lower.includes('international applicants welcome')
  ) {
    return {
      status: 'PASS',
      reason: 'Employer explicitly supports international candidates or sponsorship.',
      quotedRequirement: 'Visa sponsorship available / international applicants welcomed.'
    };
  }

  return {
    status: 'PASS',
    reason: 'Standard eligibility; no restrictive citizenship or clearance gates detected in posting.'
  };
}

/**
 * Checks the Language Gate.
 */
export function checkLanguageGate(jd: string): GateEvaluation {
  const foreignLanguages = [
    { lang: 'german', regex: /\b(fluent|native|professional)\s+(?:in\s+)?german\b/i },
    { lang: 'french', regex: /\b(fluent|native|professional)\s+(?:in\s+)?french\b/i },
    { lang: 'japanese', regex: /\b(fluent|native|professional|n1|n2)\s+(?:in\s+)?japanese\b/i },
    { lang: 'mandarin', regex: /\b(fluent|native|professional)\s+(?:in\s+)?(mandarin|chinese)\b/i },
    { lang: 'spanish', regex: /\b(fluent|native|professional)\s+(?:in\s+)?spanish\b/i },
  ];

  for (const item of foreignLanguages) {
    const match = jd.match(item.regex);
    if (match) {
      return {
        status: 'FLAG',
        reason: `Posting indicates specialized working proficiency in ${item.lang}. Verify candidate language capability.`,
        quotedRequirement: match[0]
      };
    }
  }

  return {
    status: 'PASS',
    reason: 'Primary working language is English with no blocking secondary language gates.'
  };
}

/**
 * Extracts recognized technical skills from candidate data and job description.
 */
function extractSkillTokens(text: string): string[] {
  const lower = text.toLowerCase();
  return COMMON_TECH_SKILLS.filter(skill => {
    const regex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
    return regex.test(lower);
  });
}

/**
 * Evaluates candidate against target role across the 5 dimensions.
 */
export function evaluateJobFit(params: EvaluateJobFitParams): JobFitResult {
  const {
    role,
    company,
    jobDescription,
    resumeData,
    masterProfile
  } = params;

  const eligibility = checkEligibilityGate(jobDescription);
  const language = checkLanguageGate(jobDescription);

  // 1. Gather candidate skills
  const candidateSkillsSet = new Set<string>();

  if (Array.isArray(resumeData?.skills)) {
    resumeData.skills.forEach(s => {
      if (Array.isArray(s.items)) {
        s.items.forEach(k => candidateSkillsSet.add(k.toLowerCase()));
      }
    });
  }
  if (masterProfile?.skills) {
    const categories = Object.values(masterProfile.skills);
    categories.forEach((arr) => {
      if (Array.isArray(arr)) {
        arr.forEach(k => candidateSkillsSet.add(k.toLowerCase()));
      }
    });
  }

  // Also extract from full text
  const resumeText = JSON.stringify(resumeData || masterProfile || {});
  const resumeTokens = extractSkillTokens(resumeText);
  resumeTokens.forEach(t => candidateSkillsSet.add(t));

  // 2. Extract JD required skills
  const jdSkills = extractSkillTokens(jobDescription);
  const candidateSkillsArray = Array.from(candidateSkillsSet);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  jdSkills.forEach(skill => {
    const isMatched = candidateSkillsArray.some(cs => cs.includes(skill) || skill.includes(cs));
    if (isMatched) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // 3. Compute Dimension Scores (0 - 100)
  // Dim 1: Technical Skills Match (Weight 30%)
  const totalRequired = Math.max(jdSkills.length, 1);
  const techScore = Math.min(100, Math.round((matchedSkills.length / totalRequired) * 100));

  // Dim 2: Experience & Domain Match (Weight 25%)
  const experienceCount = (resumeData?.work?.length || 0) + (resumeData?.projects?.length || 0);
  let expScore = 70;
  if (experienceCount >= 4) expScore = 92;
  else if (experienceCount >= 2) expScore = 82;
  else if (experienceCount >= 1) expScore = 72;
  else expScore = 55;

  // Dim 3: Behavioral & Culture Fit (Weight 15%)
  let behavioralScore = 85;
  const lowerJd = jobDescription.toLowerCase();
  if (lowerJd.includes('fast-paced') || lowerJd.includes('ownership') || lowerJd.includes('autonomous')) {
    behavioralScore = 88;
  }

  // Dim 4: Location & Logistics (Weight 15%)
  let locationScore = 90;
  if (lowerJd.includes('remote')) {
    locationScore = 98;
  } else if (lowerJd.includes('hybrid')) {
    locationScore = 85;
  } else if (lowerJd.includes('on-site') || lowerJd.includes('relocation required')) {
    locationScore = 70;
  }

  // Dim 5: Career Alignment (Weight 15%)
  const careerScore = 88;

  // Weighted overall calculation
  const weightedOverall = Math.round(
    techScore * 0.30 +
    expScore * 0.25 +
    behavioralScore * 0.15 +
    locationScore * 0.15 +
    careerScore * 0.15
  );

  // Determine Recommended Action
  let recommendedAction: JobFitResult['recommendedAction'] = 'GOOD_MATCH';
  if (eligibility.status === 'FAIL') {
    recommendedAction = 'DISQUALIFIED';
  } else if (weightedOverall >= 85) {
    recommendedAction = 'STRONG_APPLY';
  } else if (weightedOverall >= 70) {
    recommendedAction = 'GOOD_MATCH';
  } else if (weightedOverall >= 55) {
    recommendedAction = 'STRETCH_ROLE';
  } else {
    recommendedAction = 'CAUTION_GAPS';
  }

  // Synthesize strengths and gaps
  const strengths: string[] = [];
  if (matchedSkills.length > 0) {
    strengths.push(`Core competencies aligned: ${matchedSkills.slice(0, 4).join(', ')}.`);
  }
  if (expScore >= 80) {
    strengths.push('Demonstrated project and work experience directly covers expected role seniority.');
  }
  if (locationScore >= 90) {
    strengths.push('Work format and logistics align with flexible/remote arrangement.');
  }

  const gapsAndRisks: string[] = [];
  if (missingSkills.length > 0) {
    gapsAndRisks.push(`Key technical skills not explicitly declared in resume: ${missingSkills.slice(0, 4).join(', ')}.`);
  }
  if (eligibility.status === 'FLAG') {
    gapsAndRisks.push(eligibility.reason);
  }
  if (language.status === 'FLAG') {
    gapsAndRisks.push(language.reason);
  }

  return {
    id: `fit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    role: role || 'Target Role',
    company: company || 'Company',
    jobDescription,
    gates: {
      eligibility,
      language
    },
    scores: {
      technicalSkills: techScore,
      experienceMatch: expScore,
      behavioralCulture: behavioralScore,
      locationLogistics: locationScore,
      careerAlignment: careerScore,
      overallFitScore: weightedOverall
    },
    matchedSkills,
    missingSkills,
    strengths,
    gapsAndRisks,
    recommendedAction,
    evaluatedAt: new Date().toISOString()
  };
}
