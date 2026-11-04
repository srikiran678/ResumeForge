// Interview Preparation & STAR Simulator Engine (Derived from ai-job-search framework)
import { 
  InterviewPrepData, 
  StarStory, 
  ToughQuestion, 
  TechnicalProbe, 
  ReverseQuestion, 
  ResumeData, 
  MasterProfile 
} from '@/data/types';

export interface GenerateInterviewPrepParams {
  role: string;
  company: string;
  jobDescription: string;
  resumeData?: ResumeData;
  masterProfile?: MasterProfile;
}

/**
 * Builds tailored STAR stories based on user's real project & work history.
 */
export function buildStarStories(
  resumeData?: ResumeData,
  masterProfile?: MasterProfile,
  jd = ''
): StarStory[] {
  const stories: StarStory[] = [];

  // Extract from resume experiences
  if (resumeData?.work && resumeData.work.length > 0) {
    resumeData.work.slice(0, 2).forEach((exp, idx) => {
      const bullets = Array.isArray(exp.responsibilities) ? exp.responsibilities : [];
      const primaryBullet = bullets[0] || 'Delivered key engineering milestones and feature sets.';
      const outcomeBullet = bullets[bullets.length - 1] || 'Improved system stability and delivery speed.';

      stories.push({
        id: `star_exp_${idx}_${Date.now()}`,
        projectOrRole: `${exp.position} at ${exp.company}`,
        questionTrigger: idx === 0 
          ? 'Tell me about a time you owned a high-impact technical deliverable under tight constraints.'
          : 'Describe a situation where you diagnosed and resolved a production bottleneck or complex defect.',
        situation: `At ${exp.company}, our engineering team needed to maintain rapid feature velocity while ensuring high availability and robust data integrity.`,
        task: `As ${exp.position}, my responsibility was to lead implementation, establish reliable test coverage, and coordinate releases without regressions.`,
        action: primaryBullet,
        result: outcomeBullet,
        skillsDemonstrated: [exp.position, 'Problem Solving', 'Architecture', 'Execution']
      });
    });
  }

  // Extract from resume projects
  if (resumeData?.projects && resumeData.projects.length > 0) {
    resumeData.projects.slice(0, 2).forEach((proj, idx) => {
      const bullets = Array.isArray(proj.highlights) ? proj.highlights : [];
      const primaryAction = bullets[0] || proj.description || 'Designed and implemented full-stack feature architecture.';
      const techStack = Array.isArray(proj.technologies) ? proj.technologies : ['TypeScript', 'React'];

      stories.push({
        id: `star_proj_${idx}_${Date.now()}`,
        projectOrRole: proj.name,
        questionTrigger: 'Tell me about an end-to-end technical system or project you designed from scratch.',
        situation: `Identified a critical need to solve user friction and eliminate manual workflow overhead through an automated modern application.`,
        task: `I took complete ownership of architecture, state management, API design, and client-side responsiveness for ${proj.name}.`,
        action: primaryAction,
        result: `Successfully launched the solution with clean type safety, sub-second response times, and zero critical production issues.`,
        skillsDemonstrated: [...techStack.slice(0, 3), 'Initiative', 'System Design']
      });
    });
  }

  // Baseline fallback STAR stories if user has limited resume items
  if (stories.length === 0) {
    stories.push(
      {
        id: `star_base_1_${Date.now()}`,
        projectOrRole: 'Full-Stack Web Architecture Optimization',
        questionTrigger: 'Tell me about a time you optimized system performance or user experience.',
        situation: 'The web application suffered from slow bundle loading and sluggish navigation during peak traffic.',
        task: 'Diagnose bundle bottlenecks and implement route-level code splitting and caching.',
        action: 'Analyzed dependency trees, configured dynamic lazy loading with React Suspense, and extracted vendor chunks.',
        result: 'Decreased initial JS entry payload by over 90%, achieving sub-second First Contentful Paint.',
        skillsDemonstrated: ['Performance Optimization', 'React', 'Build Tooling']
      },
      {
        id: `star_base_2_${Date.now()}`,
        projectOrRole: 'Cross-Functional Team Collaboration',
        questionTrigger: 'Tell me about a time you navigated conflicting priorities or ambiguous technical requirements.',
        situation: 'Stakeholders presented conflicting timelines for releasing a complex user dashboard.',
        task: 'Align engineering feasibility with business goals and establish an MVP scope.',
        action: 'Organized a technical RFC walk-through, broke features into 2-week deliverable milestones, and automated QA gates.',
        result: 'Delivered the core dashboard on schedule with 100% test pass rate and high user satisfaction.',
        skillsDemonstrated: ['Communication', 'Prioritization', 'Agile Planning']
      }
    );
  }

  return stories;
}

/**
 * Builds tough question coaching frameworks tailored to role and company.
 */
export function buildToughQuestions(role: string, company: string): ToughQuestion[] {
  return [
    {
      question: `Why are you interested in joining ${company || 'our company'} specifically?`,
      category: 'motivation',
      responseStrategy: 'Anchor to specific engineering challenges, product mission, or technical scale. Avoid generic flattery.',
      sampleAnswer: `I've followed ${company}'s work closely, particularly how you prioritize engineering craft and customer impact. Your focus on scalable systems matches my enthusiasm for building durable, maintainable software. I want to join a team where high standards and technical ownership are foundational.`
    },
    {
      question: 'What is your strategy when a required technology is not part of your daily stack?',
      category: 'gap',
      responseStrategy: 'Bridge to adjacent foundational paradigms, show learning velocity, and cite past rapid-adoption examples.',
      sampleAnswer: `I treat technologies as tools rooted in shared computer science principles. When adopting a new framework, I study official documentation, build a functional sandbox prototype to test edge cases, and leverage my deep foundation in core patterns to become productive within days.`
    },
    {
      question: 'What is your greatest technical development area or weakness?',
      category: 'weakness',
      responseStrategy: 'Share a genuine engineering tendency, along with the concrete guardrail/process you employ to mitigate it.',
      sampleAnswer: `Earlier in my career, I tended to over-optimize code architecture for hypothetical future requirements. I now mitigate this by adhering strictly to YAGNI (You Aren't Gonna Need It) principles, writing lightweight modular implementations first, and refactoring only when concrete requirements demand it.`
    },
    {
      question: `Where do you see yourself progressing in 3 to 5 years?`,
      category: 'transition',
      responseStrategy: 'Demonstrate ambition aligned with deeper technical ownership and cross-functional leadership.',
      sampleAnswer: `In 3 to 5 years, I see myself as a seasoned technical leader who not only architects reliable core systems for ${company}, but also mentors engineers, shapes best practices, and bridges the gap between product strategy and engineering execution.`
    }
  ];
}

/**
 * Generates technical probing prompts derived from the target JD.
 */
export function buildTechnicalProbes(jd: string, role: string): TechnicalProbe[] {
  const probes: TechnicalProbe[] = [];
  const lowerJd = jd.toLowerCase();

  if (lowerJd.includes('react') || lowerJd.includes('frontend')) {
    probes.push({
      topic: 'React State & Rendering Optimization',
      predictedQuestion: 'How do you prevent unnecessary component re-renders and structure complex state in a large application?',
      keyTalkingPoints: [
        'Component memoization (React.memo, useMemo, useCallback) with profiling evidence',
        'Decoupling global state from local leaf nodes to avoid broad tree re-renders',
        'Code splitting via React.lazy and Suspense boundaries for zero-cost routing'
      ],
      conceptSummary: 'Demonstrate awareness that premature memoization adds overhead; emphasize measuring with React DevTools Profiler.'
    });
  }

  if (lowerJd.includes('api') || lowerJd.includes('backend') || lowerJd.includes('node') || lowerJd.includes('sql')) {
    probes.push({
      topic: 'API Design & Database Performance',
      predictedQuestion: 'How do you design idempotent REST/GraphQL APIs and ensure query performance under high load?',
      keyTalkingPoints: [
        'Idempotency keys and proper HTTP status code semantics',
        'Database indexing, N+1 query prevention, and connection pooling',
        'Graceful degradation with circuit breakers and fallback caching'
      ],
      conceptSummary: 'Focus on defensive data handling, ACID transaction boundaries, and pagination strategies.'
    });
  }

  if (lowerJd.includes('cloud') || lowerJd.includes('ci/cd') || lowerJd.includes('docker') || lowerJd.includes('test')) {
    probes.push({
      topic: 'Testing & Continuous Integration Quality Gates',
      predictedQuestion: 'How do you structure an automated testing strategy to guarantee zero-downtime releases?',
      keyTalkingPoints: [
        'The Testing Pyramid: unit tests, fast integration tests, and critical E2E smoke tests',
        'Pre-commit linting (Oxlint/ESLint) and strict TypeScript compiler gates',
        'Automated CI pipelines with branch protection and preview environment verification'
      ],
      conceptSummary: 'Highlight that tests are documentation of behavior and guardrails against regressions.'
    });
  }

  // Baseline probe
  if (probes.length === 0) {
    probes.push({
      topic: 'System Architecture & Modularity',
      predictedQuestion: `How would you architect a core feature for this ${role} role to ensure high maintainability and testability?`,
      keyTalkingPoints: [
        'Separation of concerns across data access, business domain logic, and presentation layers',
        'Strict type safety and clear boundary interfaces',
        'Defensive error logging and observability telemetry'
      ],
      conceptSummary: 'Focus on clean architecture, minimal coupling, and testable standalone modules.'
    });
  }

  return probes;
}

/**
 * Builds high-leverage reverse-interviewing questions for the candidate to ask interviewers.
 */
export function buildReverseQuestions(company: string): ReverseQuestion[] {
  return [
    {
      category: 'role',
      question: 'What would a 10/10 outcome look like for someone in this role within their first 90 days?',
      rationale: 'Clarifies immediate expectations and establishes clear criteria for early success.'
    },
    {
      category: 'team',
      question: 'How does the engineering team balance building new customer features versus paying down technical debt?',
      rationale: 'Reveals true engineering culture, code quality health, and whether the team is constantly firefighting.'
    },
    {
      category: 'tech',
      question: 'What does your continuous delivery cycle look like from pull request approval to production deployment?',
      rationale: 'Gauges deployment automation, CI/CD maturity, and velocity friction.'
    },
    {
      category: 'culture',
      question: `What qualities do the engineers who thrive most at ${company || 'this company'} share in common?`,
      rationale: 'Uncovers implicit cultural values, leadership styles, and operational autonomy.'
    }
  ];
}

/**
 * Complete Generator for Interview Prep Data.
 */
export function generateInterviewPrep(params: GenerateInterviewPrepParams): InterviewPrepData {
  const { role, company, jobDescription, resumeData, masterProfile } = params;

  return {
    id: `prep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    role: role || 'Software Engineer',
    company: company || 'Target Company',
    jobDescription: jobDescription || '',
    starStories: buildStarStories(resumeData, masterProfile, jobDescription),
    toughQuestions: buildToughQuestions(role, company),
    technicalProbes: buildTechnicalProbes(jobDescription, role),
    reverseQuestions: buildReverseQuestions(company),
    practiceNotes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
