import { 
  MasterProfile, 
  ResumeData, 
  ResumeVersion, 
  JobApplication, 
  AIUsageRecord, 
  PublicResumeLink, 
  PortfolioProfile 
} from '../types';
import { 
  initialMasterProfile, 
  initialAIUsage, 
  samplePortfolio 
} from '../data/sampleData';
import { insforge, isInsforgeConfigured } from './insforge';

// UUID validation and fallback generator
function isUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function toValidUuid(id: string): string {
  if (isUUID(id)) {
    return id;
  }
  let h1 = 0xdeadbeef;
  let h2 = 0x41c64e6d;
  let h3 = 0x12345678;
  let h4 = 0x9abcdef0;
  for (let i = 0; i < id.length; i++) {
    const ch = id.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489909);
  }
  const hex = [h1, h2, h3, h4].map((h) => (h >>> 0).toString(16).padStart(8, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

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

// Purge any legacy demo data / cached demo accounts on load
if (typeof localStorage !== 'undefined') {
  try {
    const cachedUser = localStorage.getItem('resumeforge_current_user');
    if (cachedUser && (cachedUser.includes('user_demo_001') || cachedUser.includes('aarav.sharma@example.edu'))) {
      localStorage.removeItem('resumeforge_current_user');
    }
    const cachedProfile = localStorage.getItem(STORAGE_KEYS.MASTER_PROFILE);
    if (cachedProfile && (cachedProfile.includes('Aarav Sharma') || cachedProfile.includes('user_demo_001'))) {
      localStorage.removeItem(STORAGE_KEYS.MASTER_PROFILE);
    }
    const cachedResumes = localStorage.getItem(STORAGE_KEYS.RESUMES);
    if (cachedResumes && (cachedResumes.includes('user_demo_001') || cachedResumes.includes('res_001'))) {
      localStorage.removeItem(STORAGE_KEYS.RESUMES);
    }
    const cachedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (cachedApps && (cachedApps.includes('user_demo_001') || cachedApps.includes('app_001'))) {
      localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    }
    const cachedLinks = localStorage.getItem(STORAGE_KEYS.PUBLIC_LINKS);
    if (cachedLinks && cachedLinks.includes('pub_001')) {
      localStorage.removeItem(STORAGE_KEYS.PUBLIC_LINKS);
    }
    const cachedPort = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
    if (cachedPort && (cachedPort.includes('aarav-sharma') || cachedPort.includes('user_demo_001'))) {
      localStorage.removeItem(STORAGE_KEYS.PORTFOLIO);
    }
  } catch (e) {
    // Non-critical local cleanup
  }
}

// Safe JSON parser
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
  // --- Master Profile ---
  getMasterProfile(userId?: string): MasterProfile {
    const key = userId ? `${STORAGE_KEYS.MASTER_PROFILE}_${userId}` : STORAGE_KEYS.MASTER_PROFILE;
    return safeParse<MasterProfile>(key, initialMasterProfile);
  },

  async saveMasterProfile(profile: MasterProfile): Promise<any> {
    const userId = profile.userId || undefined;
    const userKey = userId ? `${STORAGE_KEYS.MASTER_PROFILE}_${userId}` : STORAGE_KEYS.MASTER_PROFILE;
    const updated = { ...profile, updatedAt: new Date().toISOString() };
    safeSave(userKey, updated);

    if (isInsforgeConfigured && insforge && userId) {
      const validUserId = isUUID(userId) ? userId : toValidUuid(userId);
      try {
        const { data: authData } = await insforge.auth.getCurrentUser();
        if (!authData?.user || (authData.user.id !== userId && toValidUuid(authData.user.id) !== validUserId)) {
          return {
            data: updated,
            error: { message: 'Unauthenticated: session does not match user_id' }
          };
        }

        const { data, error } = await insforge.database
          .from('master_profiles')
          .upsert(
            {
              user_id: validUserId,
              data: profile,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
        if (error) console.error('InsForge master_profile sync error:', error);
        return { data, error };
      } catch (err) {
        console.error('InsForge master_profile sync exception:', err);
        return { error: err };
      }
    }
    return { data: updated };
  },

  async loadMasterProfile(targetUserId?: string): Promise<MasterProfile> {
    try {
      if (isInsforgeConfigured && insforge) {
        let userId = targetUserId;
        if (!userId) {
          const { data: authData } = await insforge.auth.getCurrentUser();
          userId = authData?.user?.id;
        }
        if (userId) {
          const queryUserId = isUUID(userId) ? userId : toValidUuid(userId);
          const { data, error } = await insforge.database
            .from('master_profiles')
            .select('*')
            .eq('user_id', queryUserId)
            .maybeSingle();

          if (!error && data && data.data) {
            const profile: MasterProfile = {
              ...data.data,
              id: data.id || data.data.id || 'master_profile_001',
              userId: data.user_id || userId,
              updatedAt: data.updated_at || data.data.updatedAt || new Date().toISOString(),
            };
            safeSave(`${STORAGE_KEYS.MASTER_PROFILE}_${userId}`, profile);
            return profile;
          }
          if (error) {
            console.warn('InsForge loadMasterProfile query error, falling back to local storage:', error);
            return this.getMasterProfile(userId);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load master profile from InsForge, falling back to local storage:', e);
    }
    return this.getMasterProfile();
  },

  // --- Resumes ---
  getResumes(userId?: string): ResumeData[] {
    const key = userId ? `${STORAGE_KEYS.RESUMES}_${userId}` : STORAGE_KEYS.RESUMES;
    return safeParse<ResumeData[]>(key, []);
  },

  getResumeById(id: string, userId?: string): ResumeData | undefined {
    const resumes = this.getResumes(userId);
    return resumes.find((r) => r.id === id);
  },

  async saveResume(resume: ResumeData): Promise<any> {
    const userId = resume.userId || undefined;
    const userKey = userId ? `${STORAGE_KEYS.RESUMES}_${userId}` : STORAGE_KEYS.RESUMES;
    const resumes = this.getResumes(userId);
    const index = resumes.findIndex((r) => r.id === resume.id);
    const updatedResume: ResumeData = {
      ...resume,
      updatedAt: new Date().toISOString(),
      meta: {
        ...resume.meta,
        lastModified: new Date().toISOString(),
      },
    };

    if (index >= 0) {
      resumes[index] = updatedResume;
    } else {
      resumes.push(updatedResume);
    }

    safeSave(userKey, resumes);
    if (userKey !== STORAGE_KEYS.RESUMES) {
      safeSave(STORAGE_KEYS.RESUMES, resumes);
    }

    if (isInsforgeConfigured && insforge && userId) {
      const resumeId = isUUID(resume.id) ? resume.id : toValidUuid(resume.id);
      const validUserId = isUUID(userId) ? userId : toValidUuid(userId);
      const isPublic = Boolean((resume as any).isPublic);
      const slug = (resume as any).slug || null;

      try {
        const { data: authData } = await insforge.auth.getCurrentUser();
        if (!authData?.user || (authData.user.id !== userId && toValidUuid(authData.user.id) !== validUserId)) {
          return {
            data: updatedResume,
            error: { message: 'Unauthenticated: session does not match user_id' }
          };
        }

        const { data, error } = await insforge.database
          .from('resumes')
          .upsert({
            id: resumeId,
            user_id: validUserId,
            title: resume.title,
            template: resume.meta?.template || 'classic',
            data: updatedResume,
            is_public: isPublic,
            slug: slug,
            updated_at: new Date().toISOString(),
          });
        if (error) console.error('InsForge resume save error:', error);
        return { data, error };
      } catch (err) {
        console.error('InsForge resume save exception:', err);
        return { error: err };
      }
    }
    return { data: updatedResume };
  },

  async loadResumes(targetUserId?: string): Promise<ResumeData[]> {
    try {
      if (isInsforgeConfigured && insforge) {
        let userId = targetUserId;
        if (!userId) {
          const { data: authData } = await insforge.auth.getCurrentUser();
          userId = authData?.user?.id;
        }
        if (userId) {
          const queryUserId = isUUID(userId) ? userId : toValidUuid(userId);
          const { data, error } = await insforge.database
            .from('resumes')
            .select('*')
            .eq('user_id', queryUserId)
            .order('updated_at', { ascending: false });

          if (!error && Array.isArray(data)) {
            if (data.length > 0) {
              const loadedResumes: ResumeData[] = data.map((row: any) => {
                const resumeObj = (typeof row.data === 'object' && row.data !== null) ? row.data : {};
                return {
                  ...resumeObj,
                  id: row.id || resumeObj.id,
                  userId: row.user_id || resumeObj.userId || userId,
                  title: row.title || resumeObj.title || 'Untitled Resume',
                  isPublic: Boolean(row.is_public),
                  slug: row.slug || resumeObj.slug,
                  updatedAt: row.updated_at || resumeObj.updatedAt || new Date().toISOString(),
                  meta: {
                    ...(resumeObj.meta || {}),
                    template: row.template || resumeObj.meta?.template || 'classic',
                    lastModified: row.updated_at || resumeObj.meta?.lastModified || new Date().toISOString(),
                  },
                };
              });
              safeSave(`${STORAGE_KEYS.RESUMES}_${userId}`, loadedResumes);
              safeSave(STORAGE_KEYS.RESUMES, loadedResumes);
              return loadedResumes;
            } else {
              return this.getResumes(userId);
            }
          }
          if (error) {
            console.warn('InsForge loadResumes query error, falling back to local storage:', error);
            return this.getResumes(userId);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load resumes from InsForge, falling back to local storage:', e);
    }
    return this.getResumes();
  },

  duplicateResume(resumeId: string): ResumeData | undefined {
    const original = this.getResumeById(resumeId);
    if (!original) return undefined;

    const newId = `res_${Date.now()}`;
    const duplicated: ResumeData = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      meta: {
        ...original.meta,
        version: '1.0',
        lastModified: new Date().toISOString(),
      },
    };

    const resumes = this.getResumes();
    resumes.unshift(duplicated);
    safeSave(STORAGE_KEYS.RESUMES, resumes);
    return duplicated;
  },

  moveToTrash(resumeId: string): void {
    const resumes = this.getResumes();
    const resume = resumes.find((r) => r.id === resumeId);
    if (resume) {
      resume.isTrash = true;
      resume.updatedAt = new Date().toISOString();
      safeSave(STORAGE_KEYS.RESUMES, resumes);
    }
  },

  restoreFromTrash(resumeId: string): void {
    const resumes = this.getResumes();
    const resume = resumes.find((r) => r.id === resumeId);
    if (resume) {
      resume.isTrash = false;
      resume.updatedAt = new Date().toISOString();
      safeSave(STORAGE_KEYS.RESUMES, resumes);
    }
  },

  async deletePermanently(resumeId: string): Promise<any> {
    const resumes = this.getResumes().filter((r) => r.id !== resumeId);
    safeSave(STORAGE_KEYS.RESUMES, resumes);

    // Also delete any versions
    const versions = this.getVersions(resumeId);
    if (versions.length > 0) {
      const allVersions = safeParse<ResumeVersion[]>(STORAGE_KEYS.VERSIONS, []).filter(
        (v) => v.resumeId !== resumeId
      );
      safeSave(STORAGE_KEYS.VERSIONS, allVersions);
    }

    if (isInsforgeConfigured && insforge) {
      const targetId = isUUID(resumeId) ? resumeId : toValidUuid(resumeId);
      try {
        const { data, error } = await insforge.database
          .from('resumes')
          .delete()
          .eq('id', targetId);
        if (error) console.error('InsForge delete resume error:', error);
        return { data, error };
      } catch (err) {
        console.error('InsForge delete resume exception:', err);
        return { error: err };
      }
    }
    return { success: true };
  },

  // --- Resume Versions ---
  getVersions(resumeId: string): ResumeVersion[] {
    const all = safeParse<ResumeVersion[]>(STORAGE_KEYS.VERSIONS, []);
    return all.filter((v) => v.resumeId === resumeId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createVersion(resume: ResumeData, versionName?: string, note?: string): ResumeVersion {
    const versions = safeParse<ResumeVersion[]>(STORAGE_KEYS.VERSIONS, []);
    const existingCount = versions.filter((v) => v.resumeId === resume.id).length;
    const versionNum = resume.meta?.version || `1.${existingCount}`;

    const newVersionId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `ver_${Date.now()}`;
    const newVersion: ResumeVersion = {
      id: newVersionId,
      resumeId: resume.id,
      versionNumber: versionNum,
      name: versionName || `Version ${versionNum}`,
      data: JSON.parse(JSON.stringify(resume)),
      createdAt: new Date().toISOString(),
      note,
    };

    versions.unshift(newVersion);
    safeSave(STORAGE_KEYS.VERSIONS, versions);

    if (isInsforgeConfigured && insforge && resume.userId) {
      const versionId = isUUID(newVersion.id) ? newVersion.id : toValidUuid(newVersion.id);
      const resumeId = isUUID(resume.id) ? resume.id : toValidUuid(resume.id);
      const userId = isUUID(resume.userId) ? resume.userId : toValidUuid(resume.userId);

      (async () => {
        try {
          const { error } = await insforge.database
            .from('resume_snapshots')
            .insert({
              id: versionId,
              resume_id: resumeId,
              user_id: userId,
              version_name: newVersion.name,
              note: newVersion.note || null,
              data: newVersion.data,
              created_at: new Date().toISOString(),
            });
          if (error) console.error('InsForge resume_snapshots sync error:', error);
        } catch (err) {
          console.error('InsForge resume_snapshots sync exception:', err);
        }
      })();
    }

    return newVersion;
  },

  restoreVersion(versionId: string): ResumeData | undefined {
    const versions = safeParse<ResumeVersion[]>(STORAGE_KEYS.VERSIONS, []);
    const version = versions.find((v) => v.id === versionId);
    if (!version) return undefined;

    const restored: ResumeData = {
      ...JSON.parse(JSON.stringify(version.data)),
      updatedAt: new Date().toISOString(),
      meta: {
        ...version.data.meta,
        lastModified: new Date().toISOString(),
      },
    };

    this.saveResume(restored);
    return restored;
  },

  // --- Job Applications ---
  getApplications(userId?: string): JobApplication[] {
    const key = userId ? `${STORAGE_KEYS.APPLICATIONS}_${userId}` : STORAGE_KEYS.APPLICATIONS;
    return safeParse<JobApplication[]>(key, []);
  },

  getApplicationById(id: string, userId?: string): JobApplication | undefined {
    return this.getApplications(userId).find((a) => a.id === id);
  },

  async saveApplication(app: JobApplication): Promise<any> {
    const userId = app.userId || undefined;
    const userKey = userId ? `${STORAGE_KEYS.APPLICATIONS}_${userId}` : STORAGE_KEYS.APPLICATIONS;
    const apps = this.getApplications(userId);
    const index = apps.findIndex((a) => a.id === app.id);
    const updated = { ...app, updatedAt: new Date().toISOString() };

    // SECTION 32: APPLICATION SNAPSHOTS
    // When a user marks an application as "Applied", automatically save an immutable snapshot
    if (app.status === 'Applied' && !app.resumeSnapshot && app.resumeId) {
      const resume = this.getResumeById(app.resumeId);
      if (resume) {
        updated.resumeSnapshot = JSON.parse(JSON.stringify(resume));
        updated.resumeVersion = resume.meta?.version || '1.0';
        if (!updated.applicationDate) {
          updated.applicationDate = new Date().toISOString().split('T')[0];
        }
      }
    }

    if (index >= 0) {
      apps[index] = updated;
    } else {
      apps.unshift(updated);
    }

    safeSave(userKey, apps);
    if (userKey !== STORAGE_KEYS.APPLICATIONS) {
      safeSave(STORAGE_KEYS.APPLICATIONS, apps);
    }

    if (isInsforgeConfigured && insforge && userId) {
      const appId = isUUID(app.id) ? app.id : toValidUuid(app.id);
      const validUserId = isUUID(userId) ? userId : toValidUuid(userId);
      const resumeId = (app.resumeId && isUUID(app.resumeId)) ? app.resumeId : null;

      try {
        const { data: authData } = await insforge.auth.getCurrentUser();
        if (!authData?.user || (authData.user.id !== userId && toValidUuid(authData.user.id) !== validUserId)) {
          return {
            data: updated,
            error: { message: 'Unauthenticated: session does not match user_id' }
          };
        }

        const { data, error } = await insforge.database
          .from('applications')
          .upsert({
            id: appId,
            user_id: validUserId,
            company: app.company,
            position: app.role || (app as any).position,
            job_url: app.jobUrl || null,
            status: app.status,
            applied_date: updated.applicationDate || null,
            follow_up_date: app.deadline || null,
            notes: app.notes || null,
            resume_id: resumeId,
            resume_snapshot: updated.resumeSnapshot || null,
            updated_at: new Date().toISOString(),
          });
        if (error) console.error('InsForge application sync error:', error);
        return { data, error };
      } catch (err) {
        console.error('InsForge application sync exception:', err);
        return { error: err };
      }
    }
    return { data: updated };
  },

  async deleteApplication(id: string): Promise<any> {
    const apps = this.getApplications().filter((a) => a.id !== id);
    safeSave(STORAGE_KEYS.APPLICATIONS, apps);

    if (isInsforgeConfigured && insforge) {
      const appId = isUUID(id) ? id : toValidUuid(id);
      try {
        const { data, error } = await insforge.database
          .from('applications')
          .delete()
          .eq('id', appId);
        if (error) console.error('InsForge delete application error:', error);
        return { data, error };
      } catch (err) {
        console.error('InsForge delete application exception:', err);
        return { error: err };
      }
    }
    return { success: true };
  },

  async loadApplications(targetUserId?: string): Promise<JobApplication[]> {
    try {
      if (isInsforgeConfigured && insforge) {
        let userId = targetUserId;
        if (!userId) {
          const { data: authData } = await insforge.auth.getCurrentUser();
          userId = authData?.user?.id;
        }
        if (userId) {
          const queryUserId = isUUID(userId) ? userId : toValidUuid(userId);
          const { data, error } = await insforge.database
            .from('applications')
            .select('*')
            .eq('user_id', queryUserId)
            .order('updated_at', { ascending: false });

          if (!error && Array.isArray(data)) {
            if (data.length > 0) {
              const loadedApps: JobApplication[] = data.map((row: any) => ({
                id: row.id,
                userId: row.user_id,
                company: row.company,
                role: row.position,
                jobUrl: row.job_url || undefined,
                status: row.status,
                applicationDate: row.applied_date || undefined,
                deadline: row.follow_up_date || undefined,
                notes: row.notes || '',
                resumeId: row.resume_id || '',
                resumeVersion: row.resume_snapshot?.meta?.version || '1.0',
                resumeSnapshot: row.resume_snapshot || undefined,
                createdAt: row.created_at || new Date().toISOString(),
                updatedAt: row.updated_at || new Date().toISOString(),
              }));
              safeSave(`${STORAGE_KEYS.APPLICATIONS}_${userId}`, loadedApps);
              safeSave(STORAGE_KEYS.APPLICATIONS, loadedApps);
              return loadedApps;
            } else {
              return this.getApplications(userId);
            }
          }
          if (error) {
            console.warn('InsForge loadApplications query error, falling back to local storage:', error);
            return this.getApplications(userId);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load applications from InsForge, falling back to local storage:', e);
    }
    return this.getApplications();
  },

  // --- AI Usage & Quotas (20 calls/day) ---
  getAIUsage(): AIUsageRecord {
    const record = safeParse<AIUsageRecord>(STORAGE_KEYS.AI_USAGE, initialAIUsage);
    const today = new Date().toISOString().split('T')[0];

    // Reset quota if new day
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
          const { data } = await insforge.auth.getCurrentUser();
          if (data?.user?.id) {
            const aiUsageId = isUUID(logId) ? logId : toValidUuid(logId);
            const { error } = await insforge.database.from('ai_usage').insert({
              id: aiUsageId,
              user_id: data.user.id,
              feature: operation,
              prompt_tokens: 0,
              response_tokens: 0,
              created_at: new Date().toISOString(),
            });
            if (error) console.error('InsForge ai_usage sync error:', error);
          }
        } catch (err) {
          console.error('InsForge ai_usage sync exception:', err);
        }
      })();
    }

    return {
      allowed: true,
      remaining: usage.maxDailyCalls - usage.callsUsedToday,
    };
  },

  hasAcceptedAIPrivacy(): boolean {
    return safeParse<boolean>(STORAGE_KEYS.AI_PRIVACY_ACCEPTED, false);
  },

  setAcceptedAIPrivacy(accepted: boolean): void {
    safeSave(STORAGE_KEYS.AI_PRIVACY_ACCEPTED, accepted);
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
    const index = links.findIndex((l) => l.id === link.id);
    if (index >= 0) {
      links[index] = link;
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

  // Non-sequential random slug generator (e.g. "a8F4k29Lm")
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

  // --- User Data Ownership (Import / Export / Delete) ---
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
      } catch (e) {
        // Fallback for mocked environments
      }
      prefixes.forEach((key) => localStorage.removeItem(key));
    }
  },
};
