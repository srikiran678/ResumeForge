// Job Application Data Models
import { ResumeData } from './resume';

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
