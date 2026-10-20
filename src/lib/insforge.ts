import { createClient } from '@insforge/sdk';

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
  } catch (e) {}
}

const insforgeUrl = import.meta.env.VITE_INSFORGE_URL || 'https://vdkvb6uy.ap-southeast.insforge.app';
const insforgeKey = import.meta.env.VITE_INSFORGE_KEY || 'ik_b97a7fab26dfb80bab9dcb52753d9e4d';

export const isInsforgeConfigured = Boolean(insforgeUrl && insforgeKey);

export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeKey
});
