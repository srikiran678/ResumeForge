// Resume and Versioning Data Models
import { 
  EducationItem, 
  ExperienceItem, 
  ProjectItem, 
  CertificationItem, 
  AchievementItem, 
  HackathonItem, 
  VolunteeringItem, 
  PublicationItem 
} from './profile';

export type TemplateId = 
  | 'classic' 
  | 'compact' 
  | 'modern' 
  | 'academic' 
  | 'hackathon' 
  | 'executive' 
  | 'minimal' 
  | 'creative' 
  | 'elegant' 
  | 'technical'
  | 'classic-resume';

export interface DeclarationInfo {
  text: string;
  place: string;
  date: string;
  signature: string;
}

export interface ResumeMeta {
  sectionOrder: string[]; // ['summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'hackathons', 'volunteering']
  hiddenSections: string[];
  fontFamily: 'Inter' | 'Arial' | 'Times New Roman' | 'Georgia' | 'Consolas';
  fontSize: 'sm' | 'base' | 'md';
  spacing: 'compact' | 'normal' | 'relaxed';
  lastModified: string;
  version: string; // e.g. "1.0", "1.1"
  template: TemplateId;
  companyTemplateId?: string;
  targetCompany?: string;
  targetRole?: string;
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
  // Classic Resume & Extended Profile Fields
  careerObjective?: string;
  strengths?: string[];
  extracurricular?: string[];
  declaration?: DeclarationInfo;
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
