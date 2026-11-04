// Career Suite Domain Types & Models (Inspired by ai-job-search framework)

// -------------------------------------------------------------
// 1. Cover Letter Models
// -------------------------------------------------------------
export interface CoverLetterData {
  id: string;
  userId?: string;
  resumeId?: string;
  applicationId?: string;
  title: string;
  recipientName: string;
  recipientTitle?: string;
  company: string;
  companyAddress?: string;
  role: string;
  jobDescription?: string;
  date: string;
  salutation: string;
  openingParagraph: string;
  bodyParagraph: string;
  achievementBullets: string[];
  companyConnectionParagraph: string;
  closingParagraph: string;
  signoff: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  senderLocation?: string;
  senderLinkedIn?: string;
  fontFamily?: 'inter' | 'serif' | 'mono';
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// 2. Interview Prep Models (STAR Framework)
// -------------------------------------------------------------
export interface StarStory {
  id: string;
  projectOrRole: string;
  questionTrigger: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  skillsDemonstrated: string[];
}

export interface ToughQuestion {
  question: string;
  category: 'gap' | 'transition' | 'weakness' | 'motivation';
  responseStrategy: string;
  sampleAnswer: string;
}

export interface TechnicalProbe {
  topic: string;
  predictedQuestion: string;
  keyTalkingPoints: string[];
  conceptSummary?: string;
}

export interface ReverseQuestion {
  category: 'role' | 'team' | 'tech' | 'culture';
  question: string;
  rationale: string;
}

export interface InterviewPrepData {
  id: string;
  userId?: string;
  role: string;
  company: string;
  jobDescription: string;
  starStories: StarStory[];
  toughQuestions: ToughQuestion[];
  technicalProbes: TechnicalProbe[];
  reverseQuestions: ReverseQuestion[];
  practiceNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// 3. Job Match & 5-Dimensional Fit Models
// -------------------------------------------------------------
export type GateStatus = 'PASS' | 'FAIL' | 'FLAG';

export interface GateEvaluation {
  status: GateStatus;
  reason: string;
  quotedRequirement?: string;
}

export interface JobFitResult {
  id: string;
  role: string;
  company: string;
  jobDescription: string;
  gates: {
    eligibility: GateEvaluation;
    language: GateEvaluation;
  };
  scores: {
    technicalSkills: number; // 0 - 100
    experienceMatch: number; // 0 - 100
    behavioralCulture: number; // 0 - 100
    locationLogistics: number; // 0 - 100
    careerAlignment: number; // 0 - 100
    overallFitScore: number; // 0 - 100
  };
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  gapsAndRisks: string[];
  recommendedAction: 'STRONG_APPLY' | 'GOOD_MATCH' | 'STRETCH_ROLE' | 'CAUTION_GAPS' | 'DISQUALIFIED';
  evaluatedAt: string;
}

// -------------------------------------------------------------
// 4. Salary Intelligence Models
// -------------------------------------------------------------
export type ExperienceTier = 
  | 'Intern' 
  | 'Junior (0-2y)' 
  | 'Mid-Level (2-5y)' 
  | 'Senior (5-8y)' 
  | 'Lead / Staff (8y+)';

export type LocationTier = 
  | 'US Tech Hubs (SF/NYC/Seattle)' 
  | 'US Remote / Tier 2' 
  | 'Europe / UK' 
  | 'India / APAC' 
  | 'Global Remote';

export type CompanyTier = 
  | 'Early Startup (Seed-A)' 
  | 'Growth Startup (B-D)' 
  | 'Established Tech / Enterprise' 
  | 'Big Tech / FAANG';

export interface SalaryBenchmark {
  role: string;
  experienceLevel: ExperienceTier;
  locationTier: LocationTier;
  companyType: CompanyTier;
  percentiles: {
    p25: number;
    median: number;
    p75: number;
    p90: number;
    currency: string;
  };
  compensationBreakdown: {
    baseSalary: number;
    targetBonusPercent: number;
    annualEquityEst: number;
    remoteStipend: number;
  };
  negotiationTactics: Array<{
    stage: string;
    headline: string;
    script: string;
    tip: string;
  }>;
  talkingPoints: string[];
}

// -------------------------------------------------------------
// 5. Upskilling & Learning Roadmap Models
// -------------------------------------------------------------
export interface SkillGapItem {
  skill: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  marketDemand: string;
  learningCurve: string;
}

export interface ProofOfWorkProject {
  title: string;
  description: string;
  deliverable: string;
  techStack: string[];
}

export interface RoadmapSprint {
  phase: string;
  timeframe: string;
  goal: string;
  actionableSteps: string[];
  proofOfWorkProject: ProofOfWorkProject;
}

export interface CuratedStudyResource {
  title: string;
  type: 'doc' | 'tutorial' | 'course' | 'github';
  url: string;
  note: string;
}

export interface UpskillPlan {
  id: string;
  targetRole: string;
  targetCompany?: string;
  hardSkillGaps: SkillGapItem[];
  domainAndProcessGaps: Array<{
    topic: string;
    context: string;
    recommendedFocus: string;
  }>;
  sprintRoadmap: RoadmapSprint[];
  curatedResources: CuratedStudyResource[];
  createdAt: string;
}

// -------------------------------------------------------------
// 6. Job Search Models (Derived from ai-job-search framework)
// -------------------------------------------------------------
export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  tier: 'FAANG' | 'Unicorn' | 'Top Startup' | 'Enterprise' | 'Seed/Series A';
  location: string;
  remoteType: 'Remote' | 'Hybrid' | 'Onsite';
  experienceLevel: 'Intern' | 'Entry Level' | 'Mid Level' | 'Senior';
  salaryRange: string;
  minSalary: number;
  maxSalary: number;
  postedDate: string;
  applyUrl: string;
  source: 'Direct' | 'LinkedIn' | 'Wellfound' | 'Y Combinator' | 'Indeed';
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  benefits: string[];
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
}

export interface JobFilterCriteria {
  keyword: string;
  remoteType: 'ALL' | 'Remote' | 'Hybrid' | 'Onsite';
  experienceLevel: 'ALL' | 'Intern' | 'Entry Level' | 'Mid Level' | 'Senior';
  tier: 'ALL' | 'FAANG' | 'Unicorn' | 'Top Startup' | 'Enterprise';
  minSalary: number;
  sortBy: 'match' | 'recent' | 'salary';
}

// -------------------------------------------------------------
// 7. Application Analytics & Funnel Models
// -------------------------------------------------------------
export interface FunnelStageMetric {
  stage: string;
  count: number;
  conversionRate: number; // percentage from previous stage or total
  color: string;
}

export interface ApplicationAnalyticsSummary {
  totalApplications: number;
  activeCount: number;
  interviewRate: number;
  offerRate: number;
  rejectionRate: number;
  avgResponseDays: number;
  stageFunnel: FunnelStageMetric[];
  statusDistribution: Record<string, number>;
  weeklyVolume: Array<{ week: string; count: number }>;
  topCompanies: Array<{ company: string; count: number }>;
  recommendations: string[];
}

