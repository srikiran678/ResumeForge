// Career Suite Local-First Persistence Engine
import { 
  CoverLetterData, 
  InterviewPrepData, 
  JobFitResult, 
  UpskillPlan 
} from '@/data/types';

const CAREER_KEYS = {
  COVER_LETTERS: 'resumeforge_career_cover_letters',
  INTERVIEW_PREPS: 'resumeforge_career_interview_preps',
  JOB_FITS: 'resumeforge_career_job_fits',
  UPSKILL_PLANS: 'resumeforge_career_upskill_plans',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading career storage key [${key}]:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing career storage key [${key}]:`, err);
  }
}

export const CareerStorageService = {
  // --- Cover Letters ---
  getCoverLetters(): CoverLetterData[] {
    return safeGet<CoverLetterData[]>(CAREER_KEYS.COVER_LETTERS, []);
  },

  getCoverLetterById(id: string): CoverLetterData | undefined {
    return this.getCoverLetters().find((cl) => cl.id === id);
  },

  saveCoverLetter(letter: CoverLetterData): void {
    const list = this.getCoverLetters();
    const index = list.findIndex((item) => item.id === letter.id);
    if (index >= 0) {
      list[index] = { ...letter, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...letter, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    safeSet(CAREER_KEYS.COVER_LETTERS, list);
  },

  deleteCoverLetter(id: string): void {
    const list = this.getCoverLetters().filter((item) => item.id !== id);
    safeSet(CAREER_KEYS.COVER_LETTERS, list);
  },

  // --- Interview Preps ---
  getInterviewPreps(): InterviewPrepData[] {
    return safeGet<InterviewPrepData[]>(CAREER_KEYS.INTERVIEW_PREPS, []);
  },

  getInterviewPrepById(id: string): InterviewPrepData | undefined {
    return this.getInterviewPreps().find((item) => item.id === id);
  },

  saveInterviewPrep(prep: InterviewPrepData): void {
    const list = this.getInterviewPreps();
    const index = list.findIndex((item) => item.id === prep.id);
    if (index >= 0) {
      list[index] = { ...prep, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...prep, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    safeSet(CAREER_KEYS.INTERVIEW_PREPS, list);
  },

  deleteInterviewPrep(id: string): void {
    const list = this.getInterviewPreps().filter((item) => item.id !== id);
    safeSet(CAREER_KEYS.INTERVIEW_PREPS, list);
  },

  // --- Job Fits ---
  getJobFits(): JobFitResult[] {
    return safeGet<JobFitResult[]>(CAREER_KEYS.JOB_FITS, []);
  },

  saveJobFit(fit: JobFitResult): void {
    const list = this.getJobFits();
    const index = list.findIndex((item) => item.id === fit.id);
    if (index >= 0) {
      list[index] = fit;
    } else {
      list.unshift(fit);
    }
    safeSet(CAREER_KEYS.JOB_FITS, list.slice(0, 50)); // store top 50 recent fits
  },

  // --- Upskill Plans ---
  getUpskillPlans(): UpskillPlan[] {
    return safeGet<UpskillPlan[]>(CAREER_KEYS.UPSKILL_PLANS, []);
  },

  saveUpskillPlan(plan: UpskillPlan): void {
    const list = this.getUpskillPlans();
    const index = list.findIndex((item) => item.id === plan.id);
    if (index >= 0) {
      list[index] = plan;
    } else {
      list.unshift(plan);
    }
    safeSet(CAREER_KEYS.UPSKILL_PLANS, list.slice(0, 30));
  }
};
