// Skill Gap & Upskilling Roadmap Engine (Derived from ai-job-search /upskill)
import { 
  UpskillPlan, 
  SkillGapItem, 
  RoadmapSprint, 
  CuratedStudyResource, 
  ResumeData, 
  MasterProfile 
} from '@/data/types';

export interface GenerateUpskillPlanParams {
  targetRole: string;
  targetCompany?: string;
  jobDescription?: string;
  resumeData?: ResumeData;
  masterProfile?: MasterProfile;
}

const HIGH_DEMAND_SKILLS_CATALOG: Record<string, { demand: string; curve: string; docUrl: string }> = {
  'typescript': { demand: 'Very High (Top 3 JD requirement)', curve: 'Moderate (2-3 weeks)', docUrl: 'https://www.typescriptlang.org/docs/' },
  'react': { demand: 'Extremely High', curve: 'Moderate', docUrl: 'https://react.dev' },
  'next.js': { demand: 'High (Standard for React SSR)', curve: 'Fast (1-2 weeks)', docUrl: 'https://nextjs.org/docs' },
  'node.js': { demand: 'High (Ubiquitous backend)', curve: 'Moderate', docUrl: 'https://nodejs.org/en/docs' },
  'postgresql': { demand: 'Very High (Dominant relational DB)', curve: 'Moderate', docUrl: 'https://www.postgresql.org/docs/' },
  'docker': { demand: 'High (Containerization standard)', curve: 'Fast (1 week)', docUrl: 'https://docs.docker.com/' },
  'kubernetes': { demand: 'High (Enterprise Cloud Native)', curve: 'Steep (3-4 weeks)', docUrl: 'https://kubernetes.io/docs/' },
  'aws': { demand: 'Extremely High', curve: 'Moderate to Steep', docUrl: 'https://aws.amazon.com/documentation/' },
  'graphql': { demand: 'Moderate to High', curve: 'Fast (1 week)', docUrl: 'https://graphql.org/learn/' },
  'tailwind css': { demand: 'High (Modern UI styling)', curve: 'Very Fast (3-5 days)', docUrl: 'https://tailwindcss.com/docs' },
  'python': { demand: 'Extremely High (AI/Data/Backend)', curve: 'Fast', docUrl: 'https://docs.python.org/3/' },
  'pytorch': { demand: 'Very High (AI/LLM inference & training)', curve: 'Steep (4-6 weeks)', docUrl: 'https://pytorch.org/docs/' },
  'ci/cd': { demand: 'High (Automated delivery)', curve: 'Fast (1 week)', docUrl: 'https://docs.github.com/en/actions' }
};

/**
 * Generates an end-to-end Upskilling Plan with actionable Proof-of-Work projects.
 */
export function generateUpskillPlan(params: GenerateUpskillPlanParams): UpskillPlan {
  const { targetRole, targetCompany, jobDescription = '', resumeData, masterProfile } = params;

  // 1. Collect candidate skills
  const candidateSkills = new Set<string>();
  if (Array.isArray(resumeData?.skills)) {
    resumeData.skills.forEach(s => {
      if (Array.isArray(s.items)) {
        s.items.forEach(k => candidateSkills.add(k.toLowerCase()));
      }
    });
  }
  if (masterProfile?.skills) {
    const categories = Object.values(masterProfile.skills);
    categories.forEach((arr) => {
      if (Array.isArray(arr)) {
        arr.forEach(k => candidateSkills.add(k.toLowerCase()));
      }
    });
  }

  // Also parse resume text
  const resumeString = JSON.stringify(resumeData || masterProfile || {}).toLowerCase();

  // 2. Identify missing skills from catalog
  const hardGaps: SkillGapItem[] = [];
  const lowerJd = jobDescription.toLowerCase();

  Object.entries(HIGH_DEMAND_SKILLS_CATALOG).forEach(([skill, meta]) => {
    // If JD mentions it or it's a staple for this role, and candidate lacks it
    const isRelevantToRole = lowerJd.includes(skill) || targetRole.toLowerCase().includes(skill);
    const candidateHasSkill = candidateSkills.has(skill) || resumeString.includes(skill);

    if (isRelevantToRole && !candidateHasSkill) {
      hardGaps.push({
        skill: skill.toUpperCase(),
        priority: 'CRITICAL',
        marketDemand: meta.demand,
        learningCurve: meta.curve
      });
    } else if (!candidateHasSkill && hardGaps.length < 4) {
      hardGaps.push({
        skill: skill.toUpperCase(),
        priority: 'HIGH',
        marketDemand: meta.demand,
        learningCurve: meta.curve
      });
    }
  });

  // Default gaps if candidate already has everything
  if (hardGaps.length === 0) {
    hardGaps.push(
      { skill: 'ADVANCED SYSTEM DESIGN', priority: 'HIGH', marketDemand: 'Crucial for Mid/Senior', learningCurve: '3-4 weeks' },
      { skill: 'CLOUD OBSERVABILITY & TRACING', priority: 'MEDIUM', marketDemand: 'High in Production', learningCurve: '1-2 weeks' }
    );
  }

  // 3. Domain and Process Gaps
  const domainAndProcessGaps = [
    {
      topic: 'Automated CI/CD & Test Automation',
      context: 'Employers look for engineers who write automated unit and integration tests as first-class citizens.',
      recommendedFocus: 'Set up GitHub Actions with automated linting, test runners, and preview branch deployments.'
    },
    {
      topic: 'API Rate Limiting & Idempotency',
      context: 'High-scale backends must handle duplicate network retries safely without corrupting database state.',
      recommendedFocus: 'Implement Redis token-bucket rate limiting and header-based idempotency keys in REST handlers.'
    },
    {
      topic: 'Web Performance & Core Web Vitals',
      context: 'Frontend roles increasingly scrutinize bundle weight, LCP, INP, and client-side rendering bottlenecks.',
      recommendedFocus: 'Practice route-level lazy splitting, image optimization, and Lighthouse score audits.'
    }
  ];

  // 4. Actionable Sprints with Proof-of-Work Projects
  const sprintRoadmap: RoadmapSprint[] = [
    {
      phase: 'Sprint 1: Core Fundamentals & Quick Wins',
      timeframe: 'Weeks 1–2 (10–12 Hours / Week)',
      goal: `Master foundational syntax, design patterns, and idiomatic conventions for ${hardGaps[0]?.skill || 'the target stack'}.`,
      actionableSteps: [
        'Complete the official interactive documentation and build 3 small exploratory sandbox components.',
        'Read through open-source production repositories to observe file directory conventions and error handling.',
        'Write strict unit tests with 90%+ code coverage for pure business logic functions.'
      ],
      proofOfWorkProject: {
        title: 'Lightweight Typed CLI Utility',
        description: 'Build a standalone command-line tool that parses structured JSON or fetches remote data with defensive validation.',
        deliverable: 'Publish a clean GitHub repository with README, badges, animated demo GIF, and automated tests.',
        techStack: ['TypeScript', 'Node.js', 'Vitest']
      }
    },
    {
      phase: 'Sprint 2: Production-Grade Proof-of-Work Project',
      timeframe: 'Weeks 3–4 (12–15 Hours / Week)',
      goal: 'Build and deploy a full-scale application that demonstrates the exact skills demanded in the target job description.',
      actionableSteps: [
        'Architect a multi-tenant or authenticated web application with modular domain decoupling.',
        'Implement resilient database schema with foreign key indexes and migrations.',
        'Deploy the project to a public URL (e.g. Vercel) and record a 60-second Loom/GIF walkthrough for your portfolio.'
      ],
      proofOfWorkProject: {
        title: `${targetRole || 'Full-Stack'} Portfolio Showcase App`,
        description: `An end-to-end cloud-synchronized application featuring real-time state, accessible UI, and automated CI/CD pipeline.`,
        deliverable: 'Live production URL + open-source GitHub repo with architectural RFC and documentation.',
        techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Docker']
      }
    }
  ];

  // 5. Curated Study Resources
  const curatedResources: CuratedStudyResource[] = [
    {
      title: 'The System Design Primer (GitHub)',
      type: 'github',
      url: 'https://github.com/donnemartin/system-design-primer',
      note: 'Industry standard open-source guide for scalable web systems and architectural trade-offs.'
    },
    {
      title: 'React Official Documentation & Guides',
      type: 'doc',
      url: 'https://react.dev',
      note: 'Deep dive into concurrent features, state decoupling, and performant component lifecycles.'
    },
    {
      title: 'Clean Code JavaScript / TypeScript Guides',
      type: 'github',
      url: 'https://github.com/labs42io/clean-code-typescript',
      note: 'Readable, maintainable engineering patterns based on Robert C. Martin principles adapted for TS.'
    },
    {
      title: 'PostgreSQL Performance Optimization Handbook',
      type: 'tutorial',
      url: 'https://use-the-index-luke.com/',
      note: 'Essential index design, query analysis, and execution plan optimization.'
    }
  ];

  return {
    id: `upskill_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    targetRole: targetRole || 'Software Engineer',
    targetCompany,
    hardSkillGaps: hardGaps,
    domainAndProcessGaps,
    sprintRoadmap,
    curatedResources,
    createdAt: new Date().toISOString()
  };
}
