import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/** Calls the authenticated server-side career AI proxy. Never sends provider keys to the browser. */
export async function requestCareerAI(
  operation: 'GENERATE_COVER_LETTER' | 'GENERATE_INTERVIEW_PREP',
  payload: Record<string, unknown>,
): Promise<Record<string, unknown> | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.functions.invoke('claude-ai', {
    body: { operation, payload },
  });
  if (error) throw new Error(error.message || 'Career AI request failed.');
  if (!data?.success || !data?.data || data.data.notice) return null;
  return data.data as Record<string, unknown>;
}
