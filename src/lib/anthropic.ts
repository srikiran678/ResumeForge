/**
 * Anthropic Claude API Client for ResumeForge
 * 
 * Supports:
 * - Direct browser-safe calls with 'anthropic-dangerous-direct-browser-access: true'
 * - BYOK (Bring-Your-Own-Key) stored in localStorage or Vite environment (.env.local)
 * - Anti-hallucination system prompt framing
 * - Graceful fallback to ResumeForge Honest Career Intelligence Engine
 */

export interface ClaudeMessageOptions {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ClaudeResponse {
  text: string;
  modelUsed: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export const CLAUDE_DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';

/**
 * Retrieve the active Anthropic API key from localStorage or Vite environment.
 */
export function getAnthropicApiKey(): string {
  try {
    const localKey = localStorage.getItem('resumeforge_custom_api_key');
    if (localKey && localKey.trim().length > 0) {
      return localKey.trim();
    }
  } catch {
    // localStorage might be unavailable in some contexts
  }

  // Fallback to environment variable if configured
  const envKey = (import.meta as any).env?.VITE_ANTHROPIC_API_KEY;
  if (typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }

  return '';
}

/**
 * Check if a valid Anthropic key is configured.
 */
export function isClaudeConfigured(): boolean {
  const key = getAnthropicApiKey();
  return key.startsWith('sk-ant-');
}

/**
 * Call the Anthropic Claude API directly from client or edge environment.
 */
export async function callClaude(options: ClaudeMessageOptions): Promise<ClaudeResponse> {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) {
    throw new Error('Anthropic API key is not configured.');
  }

  const model = options.model || (import.meta as any).env?.VITE_AI_MODEL || CLAUDE_DEFAULT_MODEL;
  const maxTokens = options.maxTokens || 1500;
  const system = options.systemPrompt || `You are ResumeForge Honest AI Career Copilot.
Golden Rule: Never invent employers, degrees, metrics, dates, or skills. Truth wins.
Keep your responses crisp, direct, highly professional, and ATS-optimized.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature: options.temperature ?? 0.3,
      system,
      messages: [
        {
          role: 'user',
          content: options.prompt,
        },
      ],
    }),
  });

  if (!res.ok) {
    let errorMessage = `Anthropic API error (${res.status} ${res.statusText})`;
    try {
      const errJson = await res.json();
      if (errJson?.error?.message) {
        errorMessage = errJson.error.message;
      }
    } catch {
      // response was not JSON
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';

  return {
    text,
    modelUsed: data.model || model,
    usage: data.usage,
  };
}
