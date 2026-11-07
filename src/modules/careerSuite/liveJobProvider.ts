import { JobListing } from '@/data/types/careerSuite';

const ARBEITNOW_URL = 'https://www.arbeitnow.com/api/job-board-api?page=1';

type ArbeitnowJob = {
  slug?: string;
  title?: string;
  company_name?: string;
  company_logo?: string;
  location?: string;
  remote?: boolean;
  url?: string;
  tags?: string[];
  description?: string;
  created_at?: number;
};
type ArbeitnowResponse = { data?: ArbeitnowJob[] };

function textFromHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function experienceLevel(title: string, tags: string[]): JobListing['experienceLevel'] {
  const value = `${title} ${tags.join(' ')}`.toLowerCase();
  if (/intern|internship|working student/.test(value)) return 'Intern';
  if (/junior|entry.level|graduate|new.grad|trainee|fresher/.test(value)) return 'Entry Level';
  if (/senior|lead|principal|staff|director|head of/.test(value)) return 'Senior';
  return 'Mid Level';
}

function normalizeJob(job: ArbeitnowJob): JobListing | null {
  if (!job.title?.trim() || !job.company_name?.trim() || !job.url) return null;
  let url: URL;
  try {
    url = new URL(job.url);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;

  const tags = Array.isArray(job.tags)
    ? job.tags.filter((tag): tag is string => typeof tag === 'string')
    : [];

  return {
    id: `arbeitnow_${job.slug || encodeURIComponent(job.url)}`,
    title: job.title.trim(),
    company: job.company_name.trim(),
    companyLogo: job.company_logo,
    tier: 'Enterprise',
    location: job.location || (job.remote ? 'Remote' : 'Location not provided'),
    remoteType: job.remote ? 'Remote' : /hybrid/i.test(job.location || '') ? 'Hybrid' : 'Onsite',
    experienceLevel: experienceLevel(job.title, tags),
    salaryRange: 'Not disclosed',
    minSalary: 0,
    maxSalary: 0,
    postedDate: job.created_at ? new Date(job.created_at * 1000).toISOString() : 'Date not provided',
    applyUrl: url.toString(),
    source: 'Arbeitnow',
    description: textFromHtml(job.description || ''),
    requiredSkills: tags.slice(0, 12),
    preferredSkills: [],
    responsibilities: [],
    benefits: [],
  };
}

/** Fetch current public listings from Arbeitnow. No API key or user credentials are sent. */
export async function fetchLiveJobs(signal?: AbortSignal): Promise<JobListing[]> {
  const response = await fetch(ARBEITNOW_URL, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) throw new Error(`Live job feed returned HTTP ${response.status}.`);

  const payload = await response.json() as ArbeitnowResponse;
  if (!Array.isArray(payload.data)) throw new Error('Live job feed returned an unexpected response.');

  return payload.data
    .map(normalizeJob)
    .filter((job): job is JobListing => job !== null);
}
