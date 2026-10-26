import { JobApplication } from '@/data/types';
import { insforge, isInsforgeConfigured, handleInsforgeError } from '../core/insforgeClient';
import { ResumeRepository } from './resumeRepository';

function isUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function toValidUuid(id: string): string {
  if (isUUID(id)) return id;
  let h1 = 0xdeadbeef, h2 = 0x41c64e6d, h3 = 0x12345678, h4 = 0x9abcdef0;
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

const STORAGE_KEY = 'resumeforge_applications';

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

export const ApplicationRepository = {
  getApplications(userId?: string): JobApplication[] {
    const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    return safeParse<JobApplication[]>(key, []);
  },

  getApplicationById(id: string, userId?: string): JobApplication | undefined {
    return this.getApplications(userId).find((a) => a.id === id);
  },

  async saveApplication(app: JobApplication): Promise<any> {
    const userId = app.userId || undefined;
    const userKey = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    const apps = this.getApplications(userId);
    const index = apps.findIndex((a) => a.id === app.id);
    const updated = { ...app, updatedAt: new Date().toISOString() };

    // When status is "Applied", create immutable resume snapshot
    if (app.status === 'Applied' && !app.resumeSnapshot && app.resumeId) {
      const resume = ResumeRepository.getResumeById(app.resumeId);
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
    if (userKey !== STORAGE_KEY) {
      safeSave(STORAGE_KEY, apps);
    }

    if (isInsforgeConfigured && insforge && userId) {
      const appId = isUUID(app.id) ? app.id : toValidUuid(app.id);
      const validUserId = isUUID(userId) ? userId : toValidUuid(userId);
      const resumeId = (app.resumeId && isUUID(app.resumeId)) ? app.resumeId : null;

      try {
        const { data: authData, error: authError } = await insforge.auth.getCurrentUser();
        if (authError) handleInsforgeError(authError);

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
        if (error) {
          handleInsforgeError(error);
          console.error('InsForge application sync error:', error);
        }
        return { data, error };
      } catch (err) {
        handleInsforgeError(err);
        console.error('InsForge application sync exception:', err);
        return { error: err };
      }
    }
    return { data: updated };
  },

  async deleteApplication(id: string): Promise<any> {
    const apps = this.getApplications().filter((a) => a.id !== id);
    safeSave(STORAGE_KEY, apps);

    if (isInsforgeConfigured && insforge) {
      const appId = isUUID(id) ? id : toValidUuid(id);
      try {
        const { data, error } = await insforge.database
          .from('applications')
          .delete()
          .eq('id', appId);
        if (error) {
          handleInsforgeError(error);
          console.error('InsForge delete application error:', error);
        }
        return { data, error };
      } catch (err) {
        handleInsforgeError(err);
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
          const { data: authData, error: authError } = await insforge.auth.getCurrentUser();
          if (authError) handleInsforgeError(authError);
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
              safeSave(`${STORAGE_KEY}_${userId}`, loadedApps);
              safeSave(STORAGE_KEY, loadedApps);
              return loadedApps;
            } else {
              return this.getApplications(userId);
            }
          }
          if (error) {
            handleInsforgeError(error);
            console.warn('InsForge loadApplications query error, falling back to local storage:', error);
            return this.getApplications(userId);
          }
        }
      }
    } catch (e) {
      handleInsforgeError(e);
      console.warn('Failed to load applications from InsForge, falling back to local storage:', e);
    }
    return this.getApplications();
  },
};
