// Application Funnel & Intelligence Analytics Engine (Inspired by ai-job-search Framework)
import { JobApplication, ApplicationStatus } from '@/data/types/application';
import { ApplicationAnalyticsSummary, FunnelStageMetric } from '@/data/types/careerSuite';

export const AnalyticsEngine = {
  // Aggregate comprehensive funnel, velocity, and conversion telemetry
  computeAnalytics(applications: JobApplication[]): ApplicationAnalyticsSummary {
    const totalApplications = applications.length;

    if (totalApplications === 0) {
      return {
        totalApplications: 0,
        activeCount: 0,
        interviewRate: 0,
        offerRate: 0,
        rejectionRate: 0,
        avgResponseDays: 0,
        stageFunnel: [
          { stage: 'Wishlist / Interested', count: 0, conversionRate: 0, color: '#6366f1' },
          { stage: 'Applied', count: 0, conversionRate: 0, color: '#3b82f6' },
          { stage: 'Assessment / OA', count: 0, conversionRate: 0, color: '#8b5cf6' },
          { stage: 'Interview', count: 0, conversionRate: 0, color: '#f59e0b' },
          { stage: 'Offer', count: 0, conversionRate: 0, color: '#10b981' },
        ],
        statusDistribution: {},
        weeklyVolume: [],
        topCompanies: [],
        recommendations: [
          'No applications tracked yet. Use the Job Search Explorer or + New Application button to begin tracking your pipeline.',
          'Students who track at least 15 active applications increase their interview likelihood by over 3.2x.'
        ]
      };
    }

    // Counts by status
    const statusCounts: Record<string, number> = {};
    applications.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    const interestedCount = statusCounts['Interested'] || 0;
    const preparingCount = statusCounts['Preparing'] || 0;
    const appliedCount = statusCounts['Applied'] || 0;
    const assessmentCount = statusCounts['Assessment'] || 0;
    const interviewCount = statusCounts['Interview'] || 0;
    const offerCount = statusCounts['Offer'] || 0;
    const rejectedCount = statusCounts['Rejected'] || 0;
    const withdrawnCount = statusCounts['Withdrawn'] || 0;

    const totalEverApplied = appliedCount + assessmentCount + interviewCount + offerCount + rejectedCount;
    const totalEverInterviewed = interviewCount + offerCount;

    const interviewRate = totalEverApplied > 0 
      ? Math.round((totalEverInterviewed / totalEverApplied) * 100) 
      : 0;

    const offerRate = totalEverInterviewed > 0 
      ? Math.round((offerCount / totalEverInterviewed) * 100) 
      : 0;

    const rejectionRate = totalEverApplied > 0 
      ? Math.round((rejectedCount / totalEverApplied) * 100) 
      : 0;

    const activeCount = totalApplications - (rejectedCount + withdrawnCount);

    // Funnel progression
    const stageFunnel: FunnelStageMetric[] = [
      {
        stage: 'Wishlist / Interested',
        count: interestedCount + preparingCount,
        conversionRate: 100,
        color: '#6366f1'
      },
      {
        stage: 'Applied',
        count: totalEverApplied,
        conversionRate: totalApplications > 0 ? Math.round((totalEverApplied / totalApplications) * 100) : 0,
        color: '#3b82f6'
      },
      {
        stage: 'Assessment / OA',
        count: assessmentCount + interviewCount + offerCount,
        conversionRate: totalEverApplied > 0 ? Math.round(((assessmentCount + totalEverInterviewed) / totalEverApplied) * 100) : 0,
        color: '#8b5cf6'
      },
      {
        stage: 'Interview Stages',
        count: totalEverInterviewed,
        conversionRate: totalEverApplied > 0 ? Math.round((totalEverInterviewed / totalEverApplied) * 100) : 0,
        color: '#f59e0b'
      },
      {
        stage: 'Offers Received',
        count: offerCount,
        conversionRate: totalEverInterviewed > 0 ? Math.round((offerCount / totalEverInterviewed) * 100) : 0,
        color: '#10b981'
      }
    ];

    // Response time estimation (days between applicationDate and interviewDate or now)
    let totalResponseDays = 0;
    let responseCount = 0;
    applications.forEach(app => {
      if (app.applicationDate && (app.interviewDate || app.status === 'Interview' || app.status === 'Offer')) {
        const appD = new Date(app.applicationDate).getTime();
        const resD = app.interviewDate ? new Date(app.interviewDate).getTime() : new Date(app.updatedAt).getTime();
        const diffDays = Math.max(1, Math.round((resD - appD) / (1000 * 60 * 60 * 24)));
        totalResponseDays += diffDays;
        responseCount++;
      }
    });

    const avgResponseDays = responseCount > 0 ? Math.round(totalResponseDays / responseCount) : 9;

    // Weekly Volume calculation (last 4 weeks)
    const weeklyMap: Record<string, number> = {
      '3 Wks Ago': 0,
      '2 Wks Ago': 0,
      'Last Week': 0,
      'This Week': 0
    };

    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    applications.forEach(app => {
      const appTime = new Date(app.applicationDate || app.createdAt).getTime();
      const diffMs = now - appTime;
      if (diffMs <= oneWeekMs) {
        weeklyMap['This Week']++;
      } else if (diffMs <= oneWeekMs * 2) {
        weeklyMap['Last Week']++;
      } else if (diffMs <= oneWeekMs * 3) {
        weeklyMap['2 Wks Ago']++;
      } else if (diffMs <= oneWeekMs * 4) {
        weeklyMap['3 Wks Ago']++;
      }
    });

    const weeklyVolume = Object.entries(weeklyMap).map(([week, count]) => ({ week, count }));

    // Top Companies
    const companyMap: Record<string, number> = {};
    applications.forEach(app => {
      const c = app.company.trim();
      if (c) companyMap[c] = (companyMap[c] || 0) + 1;
    });

    const topCompanies = Object.entries(companyMap)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // AI Heuristic Recommendations
    const recommendations: string[] = [];
    if (interviewRate > 25) {
      recommendations.push(`Outstanding interview conversion rate (${interviewRate}%)! Your resume is clearing ATS filters effectively. Dedicate more time to STAR behavioral prep.`);
    } else if (totalEverApplied >= 10 && interviewRate < 10) {
      recommendations.push(`Your application-to-interview conversion is currently ${interviewRate}%. Try tailoring your resume keywords with ATS Analyzer for each target role.`);
    }

    if (interestedCount > 5 && appliedCount === 0) {
      recommendations.push(`You have ${interestedCount} bookmarked roles in "Interested". Set a goal to submit at least 3 customized applications this week.`);
    }

    if (interviewCount > 0) {
      recommendations.push(`You currently have active interview rounds! Review the STAR Interview Prep Studio to rehearse your technical probing scenarios.`);
    }

    if (recommendations.length < 2) {
      recommendations.push('Keep tracking all application touchpoints to generate statistically significant response patterns.');
      recommendations.push('Upload company-specific resume snapshots to review exactly which keywords generated callbacks.');
    }

    return {
      totalApplications,
      activeCount,
      interviewRate,
      offerRate,
      rejectionRate,
      avgResponseDays,
      stageFunnel,
      statusDistribution: statusCounts,
      weeklyVolume,
      topCompanies,
      recommendations
    };
  },

  // -------------------------------------------------------------
  // CSV Export & Import System
  // -------------------------------------------------------------
  exportToCSV(applications: JobApplication[]): string {
    const headers = [
      'Company',
      'Role',
      'Status',
      'Location',
      'Salary',
      'Application Date',
      'Interview Date',
      'Job URL',
      'Notes'
    ];

    const escapeCSV = (str: string | undefined): string => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = applications.map(app => [
      escapeCSV(app.company),
      escapeCSV(app.role),
      escapeCSV(app.status),
      escapeCSV(app.location),
      escapeCSV(app.salary),
      escapeCSV(app.applicationDate),
      escapeCSV(app.interviewDate),
      escapeCSV(app.jobUrl),
      escapeCSV(app.notes)
    ].join(','));

    return [headers.join(','), ...rows].join('\r\n');
  },

  importFromCSV(csvText: string, userId: string): JobApplication[] {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    // Parse CSV line taking quotes into account
    const parseCSVLine = (text: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
          if (inQuotes && text[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const parsedApps: JobApplication[] = [];
    const validStatuses: ApplicationStatus[] = [
      'Interested',
      'Preparing',
      'Applied',
      'Assessment',
      'Interview',
      'Offer',
      'Rejected',
      'Withdrawn'
    ];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const parts = parseCSVLine(lines[i]);
      if (parts.length >= 2) {
        const company = parts[0]?.trim();
        const role = parts[1]?.trim();
        if (!company && !role) continue;

        let status = (parts[2]?.trim() || 'Applied') as ApplicationStatus;
        if (!validStatuses.includes(status)) {
          status = 'Applied';
        }

        const location = parts[3]?.trim();
        const salary = parts[4]?.trim();
        const applicationDate = parts[5]?.trim();
        const interviewDate = parts[6]?.trim();
        const jobUrl = parts[7]?.trim();
        const notes = parts[8]?.trim() || '';

        const now = new Date().toISOString();
        parsedApps.push({
          id: `app_import_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
          userId,
          company: company || 'Unnamed Company',
          role: role || 'Software Engineer',
          status,
          location,
          salary,
          applicationDate: applicationDate || (status === 'Applied' ? now.split('T')[0] : undefined),
          interviewDate: interviewDate || undefined,
          jobUrl,
          notes,
          resumeId: '',
          resumeVersion: 'Imported CSV',
          createdAt: now,
          updatedAt: now
        });
      }
    }

    return parsedApps;
  },

  generateSampleCSV(): string {
    return [
      'Company,Role,Status,Location,Salary,Application Date,Interview Date,Job URL,Notes',
      '"Vercel","Frontend SWE Intern","Interview","Remote","$120,000","2025-02-15","2025-03-01","https://vercel.com/careers","Passed take-home assignment on React Server Components"',
      '"Stripe","Infrastructure Engineer","Applied","Seattle, WA","$155,000","2025-02-18","","https://stripe.com/jobs","Referred by alumni"',
      '"Datadog","Cloud Platform Engineer","Assessment","Remote","$160,000","2025-02-20","","https://datadog.com","Completed online HackerRank test"',
      '"Anthropic","Full-Stack AI Tooling","Offer","San Francisco, CA","$180,000","2025-01-10","2025-02-05","https://anthropic.com/careers","Received formal offer letter!"',
      '"Google","Software Engineer II","Rejected","Mountain View, CA","$145,000","2025-01-05","","https://careers.google.com","Role filled internally"'
    ].join('\r\n');
  }
};
