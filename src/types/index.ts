// Core ResumeForge Data Models

export interface PersonalInfo {
  fullName: string;
  label: string; // e.g. "Computer Science Undergraduate | Full Stack Developer"
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  summary: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string; // YYYY-MM or YYYY
  endDate: string; // YYYY-MM or "Present"
  current?: boolean;
  cgpa: string; // e.g. "8.9 / 10.0" or "3.8 / 4.0"
  coursework: string[]; // e.g. ["Data Structures", "Algorithms", "Operating Systems", "DBMS"]
  location?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  responsibilities: string[]; // Bullets
  technologies?: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url?: string;
  githubUrl?: string;
  technologies: string[];
  highlights: string[]; // Bullets
  date?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
}

export interface HackathonItem {
  id: string;
  name: string;
  organization: string;
  role: string;
  project: string;
  technologies: string[];
  achievement: string; // e.g. "1st Place Winner", "Top 10 Finalist"
  githubUrl?: string;
  demoUrl?: string;
  date?: string;
}

export interface VolunteeringItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  contributions: string[];
}

export interface OpenSourceItem {
  id: string;
  project: string;
  contribution: string;
  repository: string;
  technologies: string[];
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
}

// Master Career Profile
export interface MasterProfile {
  id: string;
  userId: string;
  personalInfo: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: {
    languages: string[];
    frameworks: string[];
    libraries: string[];
    databases: string[];
    cloud: string[];
    tools: string[];
    other: string[];
  };
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  hackathons: HackathonItem[];
  volunteering: VolunteeringItem[];
  openSource: OpenSourceItem[];
  publications: PublicationItem[];
  updatedAt: string;
}

export type TemplateId = 'classic' | 'compact' | 'modern' | 'academic' | 'hackathon';

export interface ResumeMeta {
  sectionOrder: string[]; // ['summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'hackathons', 'volunteering']
  hiddenSections: string[];
  fontFamily: 'Inter' | 'Arial' | 'Times New Roman' | 'Georgia' | 'Consolas';
  fontSize: 'sm' | 'base' | 'md';
  spacing: 'compact' | 'normal' | 'relaxed';
  lastModified: string;
  version: string; // e.g. "1.0", "1.1"
  template: TemplateId;
}

// Resume Data Structure (Compatible with JSON export and ATS generation)
export interface ResumeData {
  id: string;
  userId: string;
  title: string; // e.g. "Backend SWE Resume"
  targetRole?: string;
  targetCompany?: string;
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    location: string;
    url: string;
    summary: string;
    profiles: { network: string; username: string; url: string }[];
  };
  education: EducationItem[];
  work: ExperienceItem[];
  projects: ProjectItem[];
  skills: {
    category: string;
    items: string[];
  }[];
  certificates: CertificationItem[];
  achievements: AchievementItem[];
  hackathons: HackathonItem[];
  volunteering: VolunteeringItem[];
  publications?: PublicationItem[];
  meta: ResumeMeta;
  isArchived?: boolean;
  isTrash?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  versionNumber: string;
  name: string;
  data: ResumeData;
  createdAt: string;
  note?: string;
}

export type ApplicationStatus =
  | 'Interested'
  | 'Preparing'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  role: string;
  jobUrl?: string;
  location?: string;
  deadline?: string;
  applicationDate?: string;
  resumeId: string;
  resumeVersion: string;
  resumeSnapshot?: ResumeData; // Immutable snapshot when Applied
  status: ApplicationStatus;
  notes: string;
  interviewDate?: string;
  contactName?: string;
  contactEmail?: string;
  salary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIUsageRecord {
  callsUsedToday: number;
  maxDailyCalls: number; // 20
  lastResetDate: string; // YYYY-MM-DD
  logs: {
    id: string;
    timestamp: string;
    operation: string;
    success: boolean;
  }[];
}

export interface AISuggestion {
  id: string;
  original: string;
  suggested: string;
  reason: string;
  evidence: string;
  evidenceStatus: 'Supported' | 'Rephrased' | 'Unsupported';
  accepted?: boolean;
  rejected?: boolean;
}

export interface JobDescriptionAnalysis {
  jobTitle: string;
  company: string;
  requiredSkills: string[];
  preferredSkills: string[];
  technologies: string[];
  responsibilities: string[];
  keywords: string[];
  matchScore: number;
  strongMatches: string[];
  partialMatches: string[];
  gaps: string[];
  tailoringSuggestions: {
    id: string;
    section: string;
    type: 'order' | 'bullet' | 'keyword' | 'emphasis';
    before: string;
    after: string;
    reason: string;
    evidence: string;
    evidenceStatus: 'Supported' | 'Rephrased' | 'Unsupported';
  }[];
}

export interface ATSAnalysisResult {
  overallScore: number; // 0-100
  categories: {
    parsing: number;
    structure: number;
    contactInfo: number;
    formatting: number;
    sections: number;
  };
  checks: {
    id: string;
    category: 'parsing' | 'structure' | 'contactInfo' | 'formatting' | 'sections';
    status: 'PASS' | 'WARNING' | 'FAIL';
    title: string;
    problem?: string;
    whyItMatters: string;
    suggestion: string;
  }[];
  extractedTextStream: string;
  stats: {
    wordCount: number;
    bulletCount: number;
    readingTimeMinutes: number;
    estimatedPages: number;
    specialGlyphCount: number;
  };
}

export interface QualityAnalysisResult {
  weakVerbsFound: { word: string; suggestion: string; location: string }[];
  vagueStatements: { text: string; suggestion: string; reason: string }[];
  inconsistentDates: { item: string; issue: string; fix: string }[];
  duplicateSkills: { skill: string; occurrences: string[] }[];
  completeness: {
    personalInfo: number;
    education: number;
    experience: number;
    projects: number;
    skills: number;
    certifications: number;
    achievements: number;
    overall: number;
  };
  studentAlternativesAdvice: string[];
}

export interface PublicResumeLink {
  id: string;
  slug: string; // Random non-sequential slug e.g. "a8F4k29Lm"
  resumeId: string;
  isPublic: boolean;
  accessType: 'public' | 'unlisted' | 'private';
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
}

export interface PortfolioProfile {
  id: string;
  userId: string;
  slug: string;
  tagline: string;
  bio: string;
  theme: 'clean' | 'slate' | 'editorial';
  showQrCode: boolean;
  includedSections: string[];
  customLinks: { label: string; url: string }[];
}
