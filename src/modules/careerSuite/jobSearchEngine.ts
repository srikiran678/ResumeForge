// Job Search & Aggregation Engine (Inspired by ai-job-search Framework)
import { JobListing, JobFilterCriteria } from '@/data/types/careerSuite';
import { JobApplication } from '@/data/types/application';

const SAVED_JOBS_KEY = 'resumeforge_saved_jobs';

export const CURATED_JOB_LISTINGS: JobListing[] = [
  {
    id: 'job_vercel_swe_intern',
    title: 'Frontend Software Engineer Intern (Summer 2025/2026)',
    company: 'Vercel',
    companyLogo: '▲',
    tier: 'Unicorn',
    location: 'San Francisco, CA / Remote',
    remoteType: 'Remote',
    experienceLevel: 'Intern',
    salaryRange: '$55 - $65 / hr ($115k - $135k annualized)',
    minSalary: 115000,
    maxSalary: 135000,
    postedDate: '2 days ago',
    applyUrl: 'https://vercel.com/careers',
    source: 'Direct',
    description: 'Join the Next.js and frontend infrastructure team at Vercel. You will collaborate on compiler optimizations, React Server Components tooling, and client-side performance dashboards.',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Git'],
    preferredSkills: ['Node.js', 'Vite', 'Turborepo', 'Testing Library', 'Jest'],
    responsibilities: [
      'Build responsive, high-performance UI components with accessibility best practices.',
      'Contribute to Next.js open-source documentation and developer experience workflows.',
      'Profile web applications to improve Core Web Vitals (LCP, INP, CLS).'
    ],
    benefits: ['Remote stipend', 'Mentorship with senior engineers', 'Hardware allowance', 'Potential return offer']
  },
  {
    id: 'job_stripe_swe_entry',
    title: 'Software Engineer - Infrastructure & Billing (New Grad)',
    company: 'Stripe',
    companyLogo: 'S',
    tier: 'Unicorn',
    location: 'Seattle, WA / San Francisco, CA',
    remoteType: 'Hybrid',
    experienceLevel: 'Entry Level',
    salaryRange: '$145,000 - $175,000 + Equity',
    minSalary: 145000,
    maxSalary: 175000,
    postedDate: '1 day ago',
    applyUrl: 'https://stripe.com/jobs',
    source: 'Direct',
    description: 'Help build the financial infrastructure of the internet. You will develop highly available, fault-tolerant distributed ledger systems and developer-facing APIs.',
    requiredSkills: ['Java', 'Go', 'Distributed Systems', 'SQL', 'REST APIs', 'Git'],
    preferredSkills: ['Kubernetes', 'Docker', 'Ruby', 'gRPC', 'Kafka'],
    responsibilities: [
      'Design reliable APIs that handle billions of dollars in daily transaction volume.',
      'Write comprehensive unit, integration, and load tests for mission-critical microservices.',
      'Collaborate with product managers and security specialists to verify zero-downtime migrations.'
    ],
    benefits: ['Top-tier health coverage', 'Generous equity grant', 'Commuter benefits', '401(k) 100% matching']
  },
  {
    id: 'job_anthropic_ai_swe',
    title: 'Full-Stack Engineer - AI Tooling & Evaluation',
    company: 'Anthropic',
    companyLogo: 'A',
    tier: 'Top Startup',
    location: 'San Francisco, CA',
    remoteType: 'Hybrid',
    experienceLevel: 'Entry Level',
    salaryRange: '$160,000 - $210,000 + Equity',
    minSalary: 160000,
    maxSalary: 210000,
    postedDate: '3 days ago',
    applyUrl: 'https://anthropic.com/careers',
    source: 'Direct',
    description: 'Create internal and developer-facing interfaces for steering and evaluating cutting-edge frontier AI models. You will bridge complex LLM inference pipelines with crisp web applications.',
    requiredSkills: ['Python', 'TypeScript', 'React', 'FastAPI', 'PostgreSQL'],
    preferredSkills: ['PyTorch', 'Vector Databases', 'Tailwind CSS', 'Docker', 'GraphQL'],
    responsibilities: [
      'Architect interactive evaluation dashboards for model safety and benchmark assessments.',
      'Develop low-latency streaming client components for multimodal chat applications.',
      'Ensure reliable test coverage and type safety across entire monorepo.'
    ],
    benefits: ['Market-defining equity', 'Catered lunches & dinners', 'Comprehensive health & dental', 'Annual learning budget']
  },
  {
    id: 'job_datadog_platform_eng',
    title: 'Cloud Platform & DevOps Engineer',
    company: 'Datadog',
    companyLogo: 'D',
    tier: 'Enterprise',
    location: 'New York, NY / Remote',
    remoteType: 'Remote',
    experienceLevel: 'Mid Level',
    salaryRange: '$150,000 - $185,000',
    minSalary: 150000,
    maxSalary: 185000,
    postedDate: 'Just now',
    applyUrl: 'https://careers.datadoghq.com',
    source: 'LinkedIn',
    description: 'Scale Datadog global telemetry infrastructure handling trillions of points per day. Automate multi-cloud Kubernetes clusters with Terraform and GitOps.',
    requiredSkills: ['Kubernetes', 'Docker', 'Terraform', 'Go', 'Linux', 'AWS'],
    preferredSkills: ['Prometheus', 'Helm', 'Python', 'CI/CD', 'GitHub Actions'],
    responsibilities: [
      'Deploy and maintain highly resilient cloud infrastructure using Infrastructure as Code.',
      'Build automated self-healing CI/CD pipelines for hundreds of microservices.',
      'Participate in on-call rotation with blameless post-mortem culture.'
    ],
    benefits: ['Full remote flexibility', 'Generous PTO', 'Home office setup grant', 'Stock purchase plan']
  },
  {
    id: 'job_linear_product_eng',
    title: 'Product Engineer - UI Performance & Sync',
    company: 'Linear',
    companyLogo: 'L',
    tier: 'Top Startup',
    location: 'Remote (Global / US / EU)',
    remoteType: 'Remote',
    experienceLevel: 'Mid Level',
    salaryRange: '$170,000 - $220,000 + Equity',
    minSalary: 170000,
    maxSalary: 220000,
    postedDate: '4 days ago',
    applyUrl: 'https://linear.app/careers',
    source: 'Wellfound',
    description: 'Linear is building the operating system for modern software companies. We care deeply about speed, keyboard-first usability, offline-first sync, and handcrafted micro-interactions.',
    requiredSkills: ['TypeScript', 'React', 'GraphQL', 'Tailwind CSS', 'State Management'],
    preferredSkills: ['WebSockets', 'IndexedDB', 'Node.js', 'Figma', 'Electron'],
    responsibilities: [
      'Implement buttery-smooth 60fps animations and instant local-first state mutations.',
      'Collaborate with designers to polish typography, keyboard shortcuts, and dark mode themes.',
      'Maintain sub-100ms response latencies across the entire client application.'
    ],
    benefits: ['Async-first culture', 'Choose your own equipment', 'Unlimited vacation', 'Team retreats twice a year']
  },
  {
    id: 'job_google_swe_app',
    title: 'Software Engineer II - Core Systems',
    company: 'Google',
    companyLogo: 'G',
    tier: 'FAANG',
    location: 'Mountain View, CA / Austin, TX',
    remoteType: 'Hybrid',
    experienceLevel: 'Entry Level',
    salaryRange: '$138,000 - $182,000 + Bonus + Stock',
    minSalary: 138000,
    maxSalary: 182000,
    postedDate: '5 days ago',
    applyUrl: 'https://careers.google.com',
    source: 'Direct',
    description: 'Work on Google large-scale distributed systems, machine learning serving infrastructure, and web scale backend services.',
    requiredSkills: ['C++', 'Java', 'Data Structures & Algorithms', 'Linux', 'SQL'],
    preferredSkills: ['Go', 'Python', 'Distributed Systems', 'gRPC', 'Protocol Buffers'],
    responsibilities: [
      'Write robust, readable, high-performance code adhering to strict engineering guidelines.',
      'Design clean interfaces and collaborate with cross-functional partner teams.',
      'Debug multi-threaded concurrency issues and optimize storage bottlenecks.'
    ],
    benefits: ['On-campus cafes & wellness', 'Parental leave', '401k match', 'Education reimbursement']
  },
  {
    id: 'job_cloudflare_systems',
    title: 'Systems & Edge Infrastructure Engineer (Fresher / Intern)',
    company: 'Cloudflare',
    companyLogo: 'C',
    tier: 'Enterprise',
    location: 'Austin, TX / San Francisco, CA / Remote',
    remoteType: 'Remote',
    experienceLevel: 'Intern',
    salaryRange: '$50 - $60 / hr',
    minSalary: 104000,
    maxSalary: 125000,
    postedDate: '1 week ago',
    applyUrl: 'https://cloudflare.com/careers',
    source: 'Direct',
    description: 'Help build a better, faster, and more secure Internet. You will work on Workers runtime, DDoS defense, edge routing, and WebAssembly protocols.',
    requiredSkills: ['Rust', 'TypeScript', 'Networking (HTTP/TCP/DNS)', 'Linux', 'Git'],
    preferredSkills: ['Go', 'C++', 'WebAssembly', 'Workers', 'V8'],
    responsibilities: [
      'Contribute to edge serverless execution runtime with sub-millisecond cold starts.',
      'Analyze network traffic patterns to improve routing efficiency across 300+ cities.',
      'Write technical blog posts and documentation for developers.'
    ],
    benefits: ['Mentorship', 'Home office budget', 'Full health benefits', 'Tech talks and open source time']
  },
  {
    id: 'job_retool_fullstack',
    title: 'Full-Stack Software Engineer - Core Platform',
    company: 'Retool',
    companyLogo: 'R',
    tier: 'Top Startup',
    location: 'San Francisco, CA / New York, NY',
    remoteType: 'Hybrid',
    experienceLevel: 'Entry Level',
    salaryRange: '$140,000 - $175,000 + Equity',
    minSalary: 140000,
    maxSalary: 175000,
    postedDate: '3 days ago',
    applyUrl: 'https://retool.com/careers',
    source: 'Y Combinator',
    description: 'Retool makes it fast and effortless to build custom internal applications. You will create drag-and-drop components, database connectors, and permission systems.',
    requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'HTML/CSS'],
    preferredSkills: ['Redis', 'Docker', 'GraphQL', 'AWS', 'Security (OWASP)'],
    responsibilities: [
      'Ship new component libraries and visual workflow builder features.',
      'Optimize query execution pipelines connecting to SQL databases and REST APIs.',
      'Partner closely with customer engineers to triage edge cases and friction points.'
    ],
    benefits: ['Full health & dental', 'Flexible vacation', 'Daily catered meals', 'Commuter subsidy']
  }
];

export const JobSearchEngine = {
  // Calculate match percentage and skill alignment between candidate skills and job requirements
  computeJobMatch(
    job: JobListing, 
    candidateSkills: string[], 
    candidateHeadline?: string
  ): { matchScore: number; matchedSkills: string[]; missingSkills: string[] } {
    if (!candidateSkills || candidateSkills.length === 0) {
      return { matchScore: 50, matchedSkills: [], missingSkills: job.requiredSkills };
    }

    const normalizedCandidate = candidateSkills.map(s => s.toLowerCase().trim());
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    // Evaluate required skills (70% weight)
    let requiredHits = 0;
    job.requiredSkills.forEach(req => {
      const isMatch = normalizedCandidate.some(c => 
        c.includes(req.toLowerCase()) || req.toLowerCase().includes(c)
      );
      if (isMatch) {
        requiredHits++;
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    });

    // Evaluate preferred skills (30% weight)
    let preferredHits = 0;
    job.preferredSkills.forEach(pref => {
      const isMatch = normalizedCandidate.some(c => 
        c.includes(pref.toLowerCase()) || pref.toLowerCase().includes(c)
      );
      if (isMatch) {
        preferredHits++;
        if (!matchedSkills.includes(pref)) matchedSkills.push(pref);
      }
    });

    const requiredScore = job.requiredSkills.length > 0 
      ? (requiredHits / job.requiredSkills.length) * 75 
      : 50;

    const preferredScore = job.preferredSkills.length > 0 
      ? (preferredHits / job.preferredSkills.length) * 25 
      : 15;

    // Small bonus if headline matches role
    let titleBonus = 0;
    if (candidateHeadline) {
      const hLower = candidateHeadline.toLowerCase();
      const tLower = job.title.toLowerCase();
      if (hLower.includes('software') || hLower.includes('engineer') || hLower.includes('frontend') || hLower.includes('full-stack') || hLower.includes('developer')) {
        titleBonus = 5;
      }
    }

    const totalRaw = Math.min(100, Math.round(requiredScore + preferredScore + titleBonus));
    const matchScore = Math.max(30, totalRaw); // clamp between 30 and 100

    return {
      matchScore,
      matchedSkills,
      missingSkills
    };
  },

  // Search & filter curated job database
  searchJobs(
    filters: Partial<JobFilterCriteria> = {},
    candidateSkills: string[] = [],
    candidateHeadline?: string
  ): JobListing[] {
    const {
      keyword = '',
      remoteType = 'ALL',
      experienceLevel = 'ALL',
      tier = 'ALL',
      minSalary = 0,
      sortBy = 'match'
    } = filters;

    const query = keyword.toLowerCase().trim();

    const results = CURATED_JOB_LISTINGS.map(job => {
      const match = this.computeJobMatch(job, candidateSkills, candidateHeadline);
      return {
        ...job,
        matchScore: match.matchScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills
      };
    }).filter(job => {
      // Keyword filter
      if (query) {
        const inTitle = job.title.toLowerCase().includes(query);
        const inCompany = job.company.toLowerCase().includes(query);
        const inDesc = job.description.toLowerCase().includes(query);
        const inSkills = job.requiredSkills.some(s => s.toLowerCase().includes(query)) ||
                         job.preferredSkills.some(s => s.toLowerCase().includes(query));
        if (!inTitle && !inCompany && !inDesc && !inSkills) return false;
      }

      // Remote Type filter
      if (remoteType !== 'ALL' && job.remoteType !== remoteType) {
        return false;
      }

      // Experience Level filter
      if (experienceLevel !== 'ALL' && job.experienceLevel !== experienceLevel) {
        return false;
      }

      // Tier filter
      if (tier !== 'ALL' && job.tier !== tier) {
        return false;
      }

      // Min salary filter
      if (minSalary > 0 && job.maxSalary < minSalary) {
        return false;
      }

      return true;
    });

    // Sorting
    return results.sort((a, b) => {
      if (sortBy === 'match') {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      if (sortBy === 'salary') {
        return b.maxSalary - a.maxSalary;
      }
      return 0; // default order
    });
  },

  // Saved Jobs Persistence
  getSavedJobIds(): string[] {
    try {
      const raw = localStorage.getItem(SAVED_JOBS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  toggleSaveJob(jobId: string): boolean {
    const list = this.getSavedJobIds();
    const exists = list.includes(jobId);
    let updated: string[];
    if (exists) {
      updated = list.filter(id => id !== jobId);
    } else {
      updated = [...list, jobId];
    }
    try {
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save bookmark:', e);
    }
    return !exists;
  },

  isJobSaved(jobId: string): boolean {
    return this.getSavedJobIds().includes(jobId);
  },

  // Helper to convert a JobListing into a tracked JobApplication object
  createApplicationFromJob(
    job: JobListing, 
    userId: string, 
    resumeId: string = '', 
    status: 'Interested' | 'Applied' = 'Interested'
  ): JobApplication {
    const now = new Date().toISOString();
    return {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      company: job.company,
      role: job.title,
      jobUrl: job.applyUrl,
      location: job.location,
      salary: job.salaryRange,
      status,
      resumeId,
      resumeVersion: 'v1.0 (Direct Track)',
      notes: `Matched via ResumeForge Job Search (${job.matchScore || 85}% ATS Match).\nKey Requirements: ${job.requiredSkills.join(', ')}.\nTier: ${job.tier}.`,
      applicationDate: status === 'Applied' ? now.split('T')[0] : undefined,
      createdAt: now,
      updatedAt: now
    };
  }
};
