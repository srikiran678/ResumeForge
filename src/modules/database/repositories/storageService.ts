import {
  MasterProfile,
  ResumeData,
  ResumeVersion,
  JobApplication,
  AIUsageRecord,
  PublicResumeLink,
  PortfolioProfile
} from '@/data/types';
import { initialAIUsage, samplePortfolio } from '@/data/sampleData';
import { insforge, isInsforgeConfigured, handleInsforgeError } from '../core/insforgeClient';
import { ResumeRepository } from './resumeRepository';
import { MasterProfileRepository } from './masterProfileRepository';
import { ApplicationRepository } from './applicationRepository';

const STORAGE_KEYS = {
  MASTER_PROFILE: 'resumeforge_master_profile',
  RESUMES: 'resumeforge_resumes',
  VERSIONS: 'resumeforge_resume_versions',
  APPLICATIONS: 'resumeforge_applications',
  AI_USAGE: 'resumeforge_ai_usage',
  PUBLIC_LINKS: 'resumeforge_public_links',
  PORTFOLIO: 'resumeforge_portfolio',
  AI_PRIVACY_ACCEPTED: 'resumeforge_ai_privacy_accepted',
};

function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return JSON.parse(JSON.stringify(fallback));
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading key ${key} from storage:`, e);
    return JSON.parse(JSON.stringify(fallback));
  }
}

function safeSave<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving key ${key} to storage:`, e);
  }
}

export const StorageService = {
  // --- Master Profile delegated to MasterProfileRepository ---
  getMasterProfile(userId?: string): MasterProfile {
    return MasterProfileRepository.getMasterProfile(userId);
  },

  async saveMasterProfile(profile: MasterProfile): Promise<any> {
    return MasterProfileRepository.saveMasterProfile(profile);
  },

  async loadMasterProfile(targetUserId?: string): Promise<MasterProfile> {
    return MasterProfileRepository.loadMasterProfile(targetUserId);
  },

  // --- Resumes delegated to ResumeRepository ---
  getResumes(userId?: string): ResumeData[] {
    return ResumeRepository.getResumes(userId);
  },

  getResumeById(id: string, userId?: string): ResumeData | undefined {
    return ResumeRepository.getResumeById(id, userId);
  },

  async saveResume(resume: ResumeData): Promise<any> {
    return ResumeRepository.saveResume(resume);
  },

  async loadResumes(targetUserId?: string): Promise<ResumeData[]> {
    return ResumeRepository.loadResumes(targetUserId);
  },

  duplicateResume(resumeId: string): ResumeData | undefined {
    return ResumeRepository.duplicateResume(resumeId);
  },

  moveToTrash(resumeId: string): void {
    ResumeRepository.moveToTrash(resumeId);
  },

  restoreFromTrash(resumeId: string): void {
    ResumeRepository.restoreFromTrash(resumeId);
  },

  async deletePermanently(resumeId: string): Promise<any> {
    return ResumeRepository.deletePermanently(resumeId);
  },

  // --- Resume Versions delegated to ResumeRepository ---
  getVersions(resumeId: string): ResumeVersion[] {
    return ResumeRepository.getVersions(resumeId);
  },

  createVersion(resume: ResumeData, versionName?: string, note?: string): ResumeVersion {
    return ResumeRepository.createVersion(resume, versionName, note);
  },

  restoreVersion(versionId: string): ResumeData | undefined {
    return ResumeRepository.restoreVersion(versionId);
  },

  // --- Applications delegated to ApplicationRepository ---
  getApplications(userId?: string): JobApplication[] {
    return ApplicationRepository.getApplications(userId);
  },

  getApplicationById(id: string, userId?: string): JobApplication | undefined {
    return ApplicationRepository.getApplicationById(id, userId);
  },

  async saveApplication(app: JobApplication): Promise<any> {
    return ApplicationRepository.saveApplication(app);
  },

  async deleteApplication(id: string): Promise<any> {
    return ApplicationRepository.deleteApplication(id);
  },

  async loadApplications(targetUserId?: string): Promise<JobApplication[]> {
    return ApplicationRepository.loadApplications(targetUserId);
  },

  // --- AI Usage & Quotas ---
  getAIUsage(): AIUsageRecord {
    const record = safeParse<AIUsageRecord>(STORAGE_KEYS.AI_USAGE, initialAIUsage);
    const today = new Date().toISOString().split('T')[0];

    if (record.lastResetDate !== today) {
      record.callsUsedToday = 0;
      record.lastResetDate = today;
      safeSave(STORAGE_KEYS.AI_USAGE, record);
    }
    return record;
  },

  recordAICall(operation: string, success: boolean = true): { allowed: boolean; remaining: number } {
    const usage = this.getAIUsage();
    if (usage.callsUsedToday >= usage.maxDailyCalls) {
      return { allowed: false, remaining: 0 };
    }

    usage.callsUsedToday += 1;
    const logId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `log_${Date.now()}`;
    usage.logs.unshift({
      id: logId,
      timestamp: new Date().toISOString(),
      operation,
      success,
    });

    safeSave(STORAGE_KEYS.AI_USAGE, usage);

    if (isInsforgeConfigured && insforge) {
      (async () => {
        try {
          const { data, error } = await insforge.auth.getCurrentUser();
          if (error) handleInsforgeError(error);
          if (data?.user?.id) {
            const todayStr = new Date().toISOString().split('T')[0];
            await insforge.database
              .from('user_settings')
              .upsert({
                user_id: data.user.id,
                ai_daily_usage: {
                  date: todayStr,
                  callsUsed: usage.callsUsedToday,
                  lastCallAt: new Date().toISOString(),
                },
                updated_at: new Date().toISOString(),
              }, { onConflict: 'user_id' });
          }
        } catch (e) {
          handleInsforgeError(e);
        }
      })();
    }

    return { allowed: true, remaining: usage.maxDailyCalls - usage.callsUsedToday };
  },

  isAIPrivacyAccepted(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.AI_PRIVACY_ACCEPTED) === 'true';
  },

  hasAcceptedAIPrivacy(): boolean {
    return this.isAIPrivacyAccepted();
  },

  setAIPrivacyAccepted(accepted: boolean): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AI_PRIVACY_ACCEPTED, accepted ? 'true' : 'false');
  },

  setAcceptedAIPrivacy(accepted: boolean): void {
    this.setAIPrivacyAccepted(accepted);
  },

  // --- Public Resume Links ---
  getPublicLinks(): PublicResumeLink[] {
    return safeParse<PublicResumeLink[]>(STORAGE_KEYS.PUBLIC_LINKS, []);
  },

  getPublicLinkBySlug(slug: string): PublicResumeLink | undefined {
    return this.getPublicLinks().find((l) => l.slug === slug);
  },

  getPublicLinkForResume(resumeId: string): PublicResumeLink | undefined {
    return this.getPublicLinks().find((l) => l.resumeId === resumeId);
  },

  savePublicLink(link: PublicResumeLink): void {
    const links = this.getPublicLinks();
    const idx = links.findIndex((l) => l.resumeId === link.resumeId);
    if (idx >= 0) {
      links[idx] = link;
    } else {
      links.push(link);
    }
    safeSave(STORAGE_KEYS.PUBLIC_LINKS, links);

    const resume = this.getResumeById(link.resumeId);
    if (resume) {
      (resume as any).isPublic = link.isPublic;
      (resume as any).slug = link.slug;
      this.saveResume(resume);
    }
  },

  revokePublicLink(slug: string): void {
    const links = this.getPublicLinks().filter((l) => l.slug !== slug);
    safeSave(STORAGE_KEYS.PUBLIC_LINKS, links);

    const resumes = this.getResumes();
    const resume = resumes.find((r) => (r as any).slug === slug);
    if (resume) {
      (resume as any).isPublic = false;
      this.saveResume(resume);
    }
  },

  generateSlug(length = 9): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // --- Portfolio Profile ---
  getPortfolio(): PortfolioProfile {
    return safeParse<PortfolioProfile>(STORAGE_KEYS.PORTFOLIO, samplePortfolio);
  },

  savePortfolio(portfolio: PortfolioProfile): void {
    safeSave(STORAGE_KEYS.PORTFOLIO, portfolio);
  },

  // --- User Data Ownership ---
  exportAllData(): string {
    const exportBundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      masterProfile: this.getMasterProfile(),
      resumes: this.getResumes(),
      versions: safeParse<ResumeVersion[]>(STORAGE_KEYS.VERSIONS, []),
      applications: this.getApplications(),
      publicLinks: this.getPublicLinks(),
      portfolio: this.getPortfolio(),
    };
    return JSON.stringify(exportBundle, null, 2);
  },

  deleteAllUserData(): void {
    if (typeof localStorage !== 'undefined') {
      const prefixes = Object.values(STORAGE_KEYS);
      try {
        if (typeof localStorage.length === 'number') {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && prefixes.some((p) => k === p || k.startsWith(`${p}_`))) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach((k) => localStorage.removeItem(k));
        }
      } catch {}
      prefixes.forEach((key) => localStorage.removeItem(key));
    }
  },
};
