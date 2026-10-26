import { createClient } from '@insforge/sdk';

// Auth / session event listener pattern for 401 Unauthorized intercepting
type SessionExpiredListener = (details?: { status: number; message: string }) => void;
const sessionExpiredListeners: Set<SessionExpiredListener> = new Set();

export const onSessionExpired = (listener: SessionExpiredListener): (() => void) => {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
};

export const notifySessionExpired = (details: { status: number; message: string } = { status: 401, message: 'Session expired' }) => {
  sessionExpiredListeners.forEach((listener) => {
    try {
      listener(details);
    } catch (e) {
      console.error('Error in sessionExpiredListener:', e);
    }
  });
};

export const handleInsforgeError = (error: any): void => {
  if (!error) return;
  const status = error.status || error.statusCode || (error.response && error.response.status);
  if (status === 401 || error.message?.includes('JWT expired') || error.message?.includes('invalid claim')) {
    notifySessionExpired({ status: 401, message: error.message || 'Unauthorized: Token expired' });
  }
};

// Capture any OAuth errors from Google before the SDK's internal detectAuthCallback cleans them
if (typeof window !== 'undefined') {
  try {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    const errorDesc = params.get('error_description');
    if (errorParam) {
      sessionStorage.setItem(
        'resumeforge_oauth_error',
        errorParam === 'access_denied'
          ? 'Google sign-in was cancelled or access was denied.'
          : errorDesc || errorParam
      );
    }
  } catch {}
}

const getEnvVar = (key: string, fallback: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
    const proc = (globalThis as any).process;
    if (proc && proc.env && proc.env[key]) {
      return proc.env[key];
    }
  } catch {}
  return fallback;
};

const insforgeUrl = getEnvVar('VITE_INSFORGE_URL', 'https://vdkvb6uy.ap-southeast.insforge.app');
const insforgeKey = getEnvVar('VITE_INSFORGE_KEY', 'ik_b97a7fab26dfb80bab9dcb52753d9e4d');

export const isInsforgeConfigured = Boolean(insforgeUrl && insforgeKey);

export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeKey
});
