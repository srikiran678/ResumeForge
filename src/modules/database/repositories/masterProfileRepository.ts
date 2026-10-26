import { MasterProfile } from '@/data/types';
import { initialMasterProfile } from '@/data/sampleData';
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

const STORAGE_KEY = 'resumeforge_master_profile';

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

export const MasterProfileRepository = {
  getMasterProfile(userId?: string): MasterProfile {
    const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    return safeParse<MasterProfile>(key, initialMasterProfile);
  },

  async saveMasterProfile(profile: MasterProfile): Promise<any> {
    const userId = profile.userId || undefined;
    const userKey = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    const updated = { ...profile, updatedAt: new Date().toISOString() };
    safeSave(userKey, updated);

    if (isInsforgeConfigured && insforge && userId) {
      const validUserId = isUUID(userId) ? userId : toValidUuid(userId);
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
          .from('master_profiles')
          .upsert(
            {
              user_id: validUserId,
              data: profile,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
        if (error) {
          handleInsforgeError(error);
          console.error('InsForge master_profile sync error:', error);
        }
        return { data, error };
      } catch (err) {
        handleInsforgeError(err);
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
          const { data: authData, error: authErr } = await insforge.auth.getCurrentUser();
          if (authErr) handleInsforgeError(authErr);
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
            safeSave(`${STORAGE_KEY}_${userId}`, profile);
            return profile;
          }
          if (error) {
            handleInsforgeError(error);
            console.warn('InsForge loadMasterProfile query error, falling back to local storage:', error);
            return this.getMasterProfile(userId);
          }
        }
      }
    } catch (e) {
      handleInsforgeError(e);
      console.warn('Failed to load master profile from InsForge, falling back to local storage:', e);
    }
    return this.getMasterProfile();
  }
};
