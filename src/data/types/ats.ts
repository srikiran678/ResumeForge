// ATS and Quality Analysis Data Models

export interface AIUsageRecord {
  callsUsedToday: number;
  maxDailyCalls: number; // 20
  lastResetDate: string; // YYYY-MM-DD
  logs: {
    id: string;
    timestamp: string;
    operation: string;
    success: boolean;
  }[];
}

export interface AISuggestion {
  id: string;
  original: string;
  suggested: string;
  reason: string;
  evidence: string;
  evidenceStatus: 'Supported' | 'Rephrased' | 'Unsupported';
  accepted?: boolean;
  rejected?: boolean;
}

export interface JobDescriptionAnalysis {
  jobTitle: string;
  company: string;
  requiredSkills: string[];
  preferredSkills: string[];
  technologies: string[];
  responsibilities: string[];
  keywords: string[];
  matchScore: number;
  strongMatches: string[];
  partialMatches: string[];
  gaps: string[];
  tailoringSuggestions: {
    id: string;
    section: string;
    type: 'order' | 'bullet' | 'keyword' | 'emphasis';
    before: string;
    after: string;
    reason: string;
    evidence: string;
    evidenceStatus: 'Supported' | 'Rephrased' | 'Unsupported';
  }[];
}

export interface ATSAnalysisResult {
  overallScore: number; // 0-100
  categories: {
    parsing: number;
    structure: number;
    contactInfo: number;
    formatting: number;
    sections: number;
  };
  checks: {
    id: string;
    category: 'parsing' | 'structure' | 'contactInfo' | 'formatting' | 'sections';
    status: 'PASS' | 'WARNING' | 'FAIL';
    title: string;
    problem?: string;
    whyItMatters: string;
    suggestion: string;
  }[];
  extractedTextStream: string;
  stats: {
    wordCount: number;
    bulletCount: number;
    readingTimeMinutes: number;
    estimatedPages: number;
    specialGlyphCount: number;
  };
}

export interface QualityAnalysisResult {
  weakVerbsFound: { word: string; suggestion: string; location: string }[];
  vagueStatements: { text: string; suggestion: string; reason: string }[];
  inconsistentDates: { item: string; issue: string; fix: string }[];
  duplicateSkills: { skill: string; occurrences: string[] }[];
  completeness: {
    personalInfo: number;
    education: number;
    experience: number;
    projects: number;
    skills: number;
    certifications: number;
    achievements: number;
    overall: number;
  };
  studentAlternativesAdvice: string[];
}
