import { callClaude, isClaudeConfigured } from '@/lib/anthropic';

/** Uses the candidate's own configured Claude key. The key is never sent to ResumeForge servers. */
export async function requestCareerAI(
  operation: 'GENERATE_COVER_LETTER' | 'GENERATE_INTERVIEW_PREP',
  payload: Record<string, unknown>,
): Promise<Record<string, unknown> | null> {
  if (!isClaudeConfigured()) return null;

  const response = await callClaude({
    prompt: `Operation: ${operation}\nInput JSON:\n${JSON.stringify(payload)}\n\nReturn one valid JSON object only. Do not include markdown fences or prose outside JSON.`,
    systemPrompt: 'You are ResumeForge Honest Career AI. Truth takes priority over persuasion. Never invent employers, degrees, dates, skills, projects, achievements, metrics, responsibilities, or company research. Use only supplied candidate facts. When evidence is missing, say so or return an empty array. Follow the requested JSON schema exactly.',
    maxTokens: 3000,
    temperature: 0.2,
  });

  const clean = response.text.trim().replace(/^\u0060\u0060\u0060json\s*/i, '').replace(/\s*\u0060\u0060\u0060$/, '');
  const parsed: unknown = JSON.parse(clean);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Career AI returned an invalid JSON object.');
  }
  return parsed as Record<string, unknown>;
}
