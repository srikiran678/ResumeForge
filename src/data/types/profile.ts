// Profile and section data models for Master Career Profile and Resumes

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
