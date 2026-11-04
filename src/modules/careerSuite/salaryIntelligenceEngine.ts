// Salary Intelligence & Negotiation Playbook Engine (Derived from ai-job-search salary_lookup)
import { 
  SalaryBenchmark, 
  ExperienceTier, 
  LocationTier, 
  CompanyTier 
} from '@/data/types';

// Multipliers relative to US Tech Hub baseline (1.0)
const LOCATION_MULTIPLIERS: Record<LocationTier, number> = {
  'US Tech Hubs (SF/NYC/Seattle)': 1.0,
  'US Remote / Tier 2': 0.88,
  'Europe / UK': 0.72,
  'India / APAC': 0.45,
  'Global Remote': 0.80
};

// Multipliers relative to Established Tech (1.0)
const COMPANY_MULTIPLIERS: Record<CompanyTier, number> = {
  'Early Startup (Seed-A)': 0.82,
  'Growth Startup (B-D)': 0.95,
  'Established Tech / Enterprise': 1.0,
  'Big Tech / FAANG': 1.25
};

// Base median compensation table by role & seniority in US Tech Hub (USD)
const BASELINE_MEDIAN_TABLE: Record<string, Record<ExperienceTier, number>> = {
  'frontend': {
    'Intern': 45000,
    'Junior (0-2y)': 105000,
    'Mid-Level (2-5y)': 140000,
    'Senior (5-8y)': 175000,
    'Lead / Staff (8y+)': 215000
  },
  'backend': {
    'Intern': 48000,
    'Junior (0-2y)': 110000,
    'Mid-Level (2-5y)': 145000,
    'Senior (5-8y)': 185000,
    'Lead / Staff (8y+)': 225000
  },
  'fullstack': {
    'Intern': 46000,
    'Junior (0-2y)': 108000,
    'Mid-Level (2-5y)': 142000,
    'Senior (5-8y)': 180000,
    'Lead / Staff (8y+)': 220000
  },
  'ai/ml': {
    'Intern': 55000,
    'Junior (0-2y)': 125000,
    'Mid-Level (2-5y)': 165000,
    'Senior (5-8y)': 210000,
    'Lead / Staff (8y+)': 260000
  },
  'devops': {
    'Intern': 48000,
    'Junior (0-2y)': 112000,
    'Mid-Level (2-5y)': 148000,
    'Senior (5-8y)': 185000,
    'Lead / Staff (8y+)': 225000
  },
  'mobile': {
    'Intern': 45000,
    'Junior (0-2y)': 105000,
    'Mid-Level (2-5y)': 140000,
    'Senior (5-8y)': 175000,
    'Lead / Staff (8y+)': 215000
  },
  'design': {
    'Intern': 42000,
    'Junior (0-2y)': 95000,
    'Mid-Level (2-5y)': 130000,
    'Senior (5-8y)': 165000,
    'Lead / Staff (8y+)': 200000
  }
};

/**
 * Normalizes role string to standard baseline key.
 */
function normalizeRole(role: string): string {
  const r = role.toLowerCase();
  if (r.includes('ai') || r.includes('ml') || r.includes('machine learning') || r.includes('data sci')) return 'ai/ml';
  if (r.includes('devops') || r.includes('sre') || r.includes('cloud') || r.includes('infrastructure')) return 'devops';
  if (r.includes('mobile') || r.includes('ios') || r.includes('android') || r.includes('flutter')) return 'mobile';
  if (r.includes('design') || r.includes('ui') || r.includes('ux') || r.includes('product designer')) return 'design';
  if (r.includes('backend') || r.includes('api') || r.includes('server')) return 'backend';
  if (r.includes('fullstack') || r.includes('full stack') || r.includes('software engineer')) return 'fullstack';
  return 'frontend';
}

/**
 * Computes comprehensive benchmark metrics and negotiation strategies.
 */
export function calculateSalaryBenchmark(
  role: string,
  experienceLevel: ExperienceTier,
  locationTier: LocationTier,
  companyType: CompanyTier
): SalaryBenchmark {
  const normRole = normalizeRole(role);
  const rawBaseMedian = BASELINE_MEDIAN_TABLE[normRole]?.[experienceLevel] || 135000;

  const locMult = LOCATION_MULTIPLIERS[locationTier] ?? 1.0;
  const compMult = COMPANY_MULTIPLIERS[companyType] ?? 1.0;

  const medianBase = Math.round((rawBaseMedian * locMult * compMult) / 1000) * 1000;
  const p25 = Math.round((medianBase * 0.87) / 1000) * 1000;
  const p75 = Math.round((medianBase * 1.15) / 1000) * 1000;
  const p90 = Math.round((medianBase * 1.30) / 1000) * 1000;

  // Bonus and Equity estimates
  let bonusPercent = 0.10;
  let equityRatio = 0.15;
  if (companyType === 'Big Tech / FAANG') {
    bonusPercent = 0.15;
    equityRatio = 0.35;
  } else if (companyType === 'Early Startup (Seed-A)') {
    bonusPercent = 0.05;
    equityRatio = 0.40; // high equity value potential
  }

  const annualEquityEst = Math.round((medianBase * equityRatio) / 1000) * 1000;
  const remoteStipend = locationTier.includes('Remote') ? 2400 : 0;

  // Negotiation tactics based on stage
  const negotiationTactics = [
    {
      stage: 'Initial Recruiter Screen',
      headline: 'Deflect Early Number Anchors',
      script: `"At this stage, I am primarily focused on finding the right mutual fit in terms of team, tech stack, and impact. I know ${companyType} compensates competitively for market value, and I'd prefer to discuss compensation once we agree I am the ideal candidate for the role."`,
      tip: 'Never state a single rigid number first; recruiters use early numbers to set the compensation ceiling.'
    },
    {
      stage: 'Offer Stage (First Number Presented)',
      headline: 'Express High Enthusiasm + Request Full Breakdown',
      script: `"Thank you so much for this offer! I am genuinely excited about the team and what we'll build together. I'd love to review the complete package—including base, equity schedule, bonus targets, and healthcare benefits—over the next 48 hours."`,
      tip: 'Do not accept or decline on the initial call. Always give yourself time to analyze total compensation.'
    },
    {
      stage: 'Counter-Offer Negotiation',
      headline: 'Ground in Concrete Market Data & Unique Value',
      script: `"Based on current benchmarks for ${role} in ${locationTier} and my track record in optimizing scalable systems, I was targeting a total compensation package closer to $${Math.round(p75 / 1000)}k. If we can reach that figure, I would be thrilled to sign immediately."`,
      tip: 'Phrasing as "If we can reach X, I will sign immediately" gives the hiring manager leverage with finance.'
    },
    {
      stage: 'Non-Salary Levers (When Base is Capped)',
      headline: 'Negotiate Signing Bonus, Equity & Accelerated Reviews',
      script: `"I understand the base salary band is fixed at $${Math.round(medianBase / 1000)}k. Would you be open to a one-time signing bonus of $15,000 or a 6-month performance review to align compensation with milestone delivery?"`,
      tip: 'Signing bonuses come from separate hiring budgets and are much easier for managers to approve.'
    }
  ];

  const talkingPoints = [
    `Current median base for ${role} at this tier is ~$${(medianBase / 1000).toFixed(0)}k/year.`,
    `Top quartile (75th percentile) performers command $${(p75 / 1000).toFixed(0)}k+ in total cash compensation.`,
    `Total compensation package includes ~$${(annualEquityEst / 1000).toFixed(0)}k/year estimated equity grant value.`
  ];

  return {
    role,
    experienceLevel,
    locationTier,
    companyType,
    percentiles: {
      p25,
      median: medianBase,
      p75,
      p90,
      currency: 'USD'
    },
    compensationBreakdown: {
      baseSalary: medianBase,
      targetBonusPercent: Math.round(bonusPercent * 100),
      annualEquityEst,
      remoteStipend
    },
    negotiationTactics,
    talkingPoints
  };
}
