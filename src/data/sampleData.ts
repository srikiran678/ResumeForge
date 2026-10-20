import { MasterProfile, ResumeData, JobApplication, AIUsageRecord, PublicResumeLink, PortfolioProfile } from '../types';

export const initialMasterProfile: MasterProfile = {
  id: 'master_profile_default',
  userId: '',
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: '',
    label: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: {
    languages: [],
    frameworks: [],
    libraries: [],
    databases: [],
    cloud: [],
    tools: [],
    other: [],
  },
  certifications: [],
  achievements: [],
  hackathons: [],
  volunteering: [],
  openSource: [],
  publications: [],
};

export const sampleResumes: ResumeData[] = [];

export const sampleApplications: JobApplication[] = [];

export const initialAIUsage: AIUsageRecord = {
  callsUsedToday: 0,
  maxDailyCalls: 20,
  lastResetDate: new Date().toISOString().split('T')[0],
  logs: [],
};

export const samplePublicLink: PublicResumeLink = {
  id: '',
  slug: '',
  resumeId: '',
  isPublic: false,
  accessType: 'public',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  viewsCount: 0,
};

export const samplePortfolio: PortfolioProfile = {
  id: 'port_default',
  userId: '',
  slug: '',
  tagline: '',
  bio: '',
  theme: 'clean',
  showQrCode: false,
  includedSections: ['projects', 'experience', 'skills', 'education'],
  customLinks: [],
};
