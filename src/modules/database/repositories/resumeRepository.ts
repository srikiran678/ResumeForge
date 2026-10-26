import { ResumeData, ResumeVersion } from '@/data/types';
import { insforge, isInsforgeConfigured, handleInsforgeError } from '../core/insforgeClient';

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

const STORAGE_KEYS = {
  RESUMES: 'resumeforge_resumes',
  VERSIONS: 'resumeforge_resume_versions',
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

export const ResumeRepository = {
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
        const { data: authData, error: authError } = await insforge.auth.getCurrentUser();
        if (authError) handleInsforgeError(authError);

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
        if (error) {
          handleInsforgeError(error);
          console.error('InsForge resume save error:', error);
        }
        return { data, error };
      } catch (err) {
        handleInsforgeError(err);
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
          const { data: authData, error: authError } = await insforge.auth.getCurrentUser();
          if (authError) handleInsforgeError(authError);
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
            handleInsforgeError(error);
            console.warn('InsForge loadResumes query error, falling back to local storage:', error);
            return this.getResumes(userId);
          }
        }
      }
    } catch (e) {
      handleInsforgeError(e);
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
        if (error) {
          handleInsforgeError(error);
          console.error('InsForge delete resume error:', error);
        }
        return { data, error };
      } catch (err) {
        handleInsforgeError(err);
        console.error('InsForge delete resume exception:', err);
        return { error: err };
      }
    }
    return { success: true };
  },

  // --- Resume Versions / Snapshots ---
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
          const { data: authData } = await insforge.auth.getCurrentUser();
          if (!authData?.user) return; // Skip remote sync if not logged in to InsForge
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
          if (error) {
            handleInsforgeError(error);
            console.error('InsForge resume_snapshots sync error:', error);
          }
        } catch (err) {
          handleInsforgeError(err);
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
};
