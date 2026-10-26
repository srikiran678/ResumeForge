import { insforge, isInsforgeConfigured } from '../lib/insforge';
import { CompanyTemplate, TemplateSource, AgentRun } from '../data/types';
import { CompanyTemplateService } from './companyTemplateService';

// Permissive open licenses approved for redistribution
export const APPROVED_LICENSES = [
  'MIT License',
  'MIT',
  'Apache-2.0',
  'Apache License 2.0',
  'CC-BY-4.0',
  'Creative Commons Attribution 4.0',
  'CC0-1.0',
  'Public Domain (CC0)',
  'BSD-3-Clause',
  'BSD-2-Clause'
];

export interface DiscoveredCandidate {
  name: string;
  description: string;
  layout_style: string;
  experience_level: string;
  target_company_slug: string;
  target_role_category: string;
  source_url: string;
  license_name: string;
  license_url?: string;
  attribution: string;
  template_data: Record<string, any>;
  raw_content: string; // for hash calculation & safety scanning
}

// Approved public repositories and career frameworks
export const PUBLIC_TEMPLATE_SOURCES: DiscoveredCandidate[] = [
  {
    name: 'Google Distributed Systems & SRE ATS',
    description: 'Designed for Google Site Reliability & Cloud Infrastructure engineering roles, prioritizing observability, SLIs/SLOs, and automation scripts.',
    layout_style: 'single-column',
    experience_level: 'Mid-Level & Senior',
    target_company_slug: 'google',
    target_role_category: 'Software Engineering',
    source_url: 'https://github.com/resumeforge-community/ats-curated/tree/main/google-sre.json',
    license_name: 'MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
    attribution: 'ResumeForge Open SRE Template Group (MIT)',
    template_data: {
      baseTemplate: 'technical',
      badge: 'SRE & Systems',
      recommendedFont: 'Calibri',
      accentColor: '#1a73e8',
      highlights: ['SLO/SLA Management', 'Distributed Tracing', 'Go & Python Systems']
    },
    raw_content: 'template_id:google-sre-v1;license:MIT;system:distributed;concurrency:high'
  },
  {
    name: 'Amazon Full-Stack DynamoDB Specialist',
    description: 'High-velocity e-commerce and AWS cloud architecture format prioritizing high availability, low-latency microservices, and operational metrics.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    target_company_slug: 'amazon',
    target_role_category: 'Web & Cloud',
    source_url: 'https://github.com/resumeforge-community/ats-curated/tree/main/amazon-fullstack.json',
    license_name: 'MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
    attribution: 'AWS Builders Community Templates (MIT)',
    template_data: {
      baseTemplate: 'modern',
      badge: 'AWS Serverless',
      recommendedFont: 'Arial',
      accentColor: '#ff9900',
      highlights: ['DynamoDB Single-Table Design', 'Lambda & EventBridge', 'TypeScript Microservices']
    },
    raw_content: 'template_id:amazon-fullstack-v1;license:MIT;aws:serverless;nosql:dynamo'
  },
  {
    name: 'Microsoft Azure Data Engineer ATS',
    description: 'Optimized for Synapse Analytics, Databricks, Spark ETL pipelines, and scalable enterprise data warehousing on Microsoft Azure.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    target_company_slug: 'microsoft',
    target_role_category: 'Data & Analytics',
    source_url: 'https://github.com/resumeforge-community/ats-curated/tree/main/azure-data-engineer.json',
    license_name: 'MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
    attribution: 'Azure Data Community (MIT)',
    template_data: {
      baseTemplate: 'compact',
      badge: 'Azure Data Stack',
      recommendedFont: 'Segoe UI',
      accentColor: '#00a4ef',
      highlights: ['PySpark ETL', 'Azure Data Factory', 'Delta Lake Architecture']
    },
    raw_content: 'template_id:azure-data-engineer-v1;license:MIT;data:spark;lake:delta'
  },
  {
    name: 'Adobe Creative Suite & UI Platform',
    description: 'Targeted for Adobe Experience Cloud, WebAssembly canvas performance, and high-fidelity design systems integration.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    target_company_slug: 'adobe',
    target_role_category: 'Web & Cloud',
    source_url: 'https://github.com/resumeforge-community/ats-curated/tree/main/adobe-ui-platform.json',
    license_name: 'CC-BY-4.0',
    license_url: 'https://creativecommons.org/licenses/by/4.0/',
    attribution: 'Open Web UI Design Standard (CC-BY-4.0)',
    template_data: {
      baseTemplate: 'elegant',
      badge: 'Canvas & UI Systems',
      recommendedFont: 'Inter',
      accentColor: '#eb1000',
      highlights: ['WebAssembly / WebGL', 'Design Tokens', 'Complex React State']
    },
    raw_content: 'template_id:adobe-ui-platform-v1;license:CC-BY-4.0;canvas:webgl;ui:tokens'
  },
  {
    name: 'TCS Java Microservices Enterprise',
    description: 'Enterprise consulting format featuring Spring Boot 3, Hibernate JPA, Apache Kafka, and banking domain transaction processing.',
    layout_style: 'single-column',
    experience_level: 'Fresher & Entry-Level',
    target_company_slug: 'tcs',
    target_role_category: 'Software Engineering',
    source_url: 'https://github.com/resumeforge-community/ats-curated/tree/main/tcs-java-microservices.json',
    license_name: 'Public Domain (CC0)',
    license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    attribution: 'Enterprise Java Placement Curriculum (CC0)',
    template_data: {
      baseTemplate: 'technical',
      badge: 'Spring Boot & Kafka',
      recommendedFont: 'Arial',
      accentColor: '#0f172a',
      highlights: ['Spring Cloud & Eureka', 'Kafka Event Streaming', 'JUnit 5 & Mockito']
    },
    raw_content: 'template_id:tcs-java-microservices-v1;license:CC0;spring:boot3;broker:kafka'
  },
  {
    name: 'Infosys Automation & Selenium Test Framework',
    description: 'Targeted for QA automation, CI/CD pipeline integration, API test frameworks, and performance regression suites.',
    layout_style: 'single-column',
    experience_level: 'Entry-Level & Mid-Level',
    target_company_slug: 'infosys',
    target_role_category: 'AI & Machine Learning',
    source_url: 'https://github.com/resumeforge-community/ats-curated/tree/main/infosys-qa-automation.json',
    license_name: 'MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
    attribution: 'Open QA Automation Collective (MIT)',
    template_data: {
      baseTemplate: 'classic',
      badge: 'QA & Test Automation',
      recommendedFont: 'Arial',
      accentColor: '#007cc3',
      highlights: ['Selenium & Playwright', 'Postman / RestAssured', 'Jenkins CI/CD']
    },
    raw_content: 'template_id:infosys-qa-automation-v1;license:MIT;test:playwright;ci:jenkins'
  },
  {
    name: 'Accenture Cloud Transformation & DevOps',
    description: 'DevOps & SRE blueprint featuring Kubernetes (EKS/GKE), Terraform infrastructure as code, and automated security scans.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    target_company_slug: 'accenture',
    target_role_category: 'Software Engineering',
    source_url: 'https://github.com/resumeforge-community/ats-curated/tree/main/accenture-devops.json',
    license_name: 'MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
    attribution: 'Cloud Native Foundation Templates (MIT)',
    template_data: {
      baseTemplate: 'compact',
      badge: 'Kubernetes & IaC',
      recommendedFont: 'Segoe UI',
      accentColor: '#a100ff',
      highlights: ['Terraform Modular IaC', 'Kubernetes Helm Deployments', 'GitHub Actions CI/CD']
    },
    raw_content: 'template_id:accenture-devops-v1;license:MIT;iac:terraform;k8s:helm'
  },
  {
    name: 'Wipro LLM Fine-Tuning & GenAI Engineer',
    description: 'Cutting-edge Generative AI structure highlighting LangChain, LlamaIndex, vector databases (Pinecone, pgvector), and Hugging Face models.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    target_company_slug: 'wipro',
    target_role_category: 'AI & Machine Learning',
    source_url: 'https://github.com/resumeforge-community/ats-curated/tree/main/wipro-genai.json',
    license_name: 'MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
    attribution: 'Open AI Engineer Initiative (MIT)',
    template_data: {
      baseTemplate: 'modern',
      badge: 'GenAI & RAG',
      recommendedFont: 'Inter',
      accentColor: '#14b8a6',
      highlights: ['RAG Architectures', 'Vector Embeddings & Retrieval', 'LoRA / QLoRA Tuning']
    },
    raw_content: 'template_id:wipro-genai-v1;license:MIT;ai:rag;vector:pgvector;llm:eval'
  },
  {
    name: 'Oracle Core Database & High-Throughput SQL',
    description: 'Focused on relational optimization, B-tree indexes, execution plans, ACID compliance, and zero-downtime database migrations.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    target_company_slug: 'oracle',
    target_role_category: 'Data & Analytics',
    source_url: 'https://github.com/resumeforge-community/ats-curated/tree/main/oracle-rdbms.json',
    license_name: 'MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
    attribution: 'Database Performance Guild (MIT)',
    template_data: {
      baseTemplate: 'technical',
      badge: 'DB Optimization',
      recommendedFont: 'Courier',
      accentColor: '#f80000',
      highlights: ['Query Optimization (EXPLAIN ANALYZE)', 'Partitioning & Sharding', 'Zero Data Loss Replication']
    },
    raw_content: 'template_id:oracle-rdbms-v1;license:MIT;rdbms:oracle;tuning:indexes'
  },
  {
    name: 'Salesforce Enterprise Apex & Lightning Web Components',
    description: 'Full-stack cloud template detailing Lightning Web Components (LWC), Apex triggers, SOQL optimization, and enterprise integration.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    target_company_slug: 'salesforce',
    target_role_category: 'Web & Cloud',
    source_url: 'https://github.com/resumeforge-community/ats-curated/tree/main/salesforce-lwc.json',
    license_name: 'MIT License',
    license_url: 'https://opensource.org/licenses/MIT',
    attribution: 'Salesforce Developer Ecosystem Open Templates (MIT)',
    template_data: {
      baseTemplate: 'compact',
      badge: 'LWC & Apex',
      recommendedFont: 'Segoe UI',
      accentColor: '#00a1e0',
      highlights: ['Lightning Web Components', 'Apex Enterprise Patterns', 'Bulk API & Platform Events']
    },
    raw_content: 'template_id:salesforce-lwc-v1;license:MIT;crm:salesforce;lwc:modern'
  }
];

// Helper to compute SHA-256 hash
export async function computeSHA256(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'sha256-' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback hash
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `sha256-fallback-${(h >>> 0).toString(16).padStart(8, '0')}`;
}

// Content safety & sanitation scanner
export function scanSafety(content: string): { safe: boolean; reason?: string } {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror\s*=/gi,
    /onload\s*=/gi,
    /onclick\s*=/gi,
    /<iframe/gi,
    /data:text\/html/gi
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      return { safe: false, reason: `Unsafe script or handler detected: ${pattern}` };
    }
  }

  // Size guard: ensure payload is <= 500KB
  if (content.length > 500 * 1024) {
    return { safe: false, reason: 'File exceeds maximum permitted size (500KB)' };
  }

  return { safe: true };
}

export const ResumeLibraryAgent = {
  /**
   * Run automated template discovery and ingestion pipeline
   */
  async runDiscovery(triggerType: 'manual' | 'scheduled' | 'cron' = 'manual'): Promise<AgentRun> {
    const startedAt = new Date().toISOString();
    const log: Array<{ timestamp: string; level: 'info' | 'warn' | 'error'; message: string }> = [];

    const addLog = (level: 'info' | 'warn' | 'error', message: string) => {
      log.push({ timestamp: new Date().toISOString(), level, message });
    };

    addLog('info', `Starting Resume Library Agent discovery cycle (trigger: ${triggerType})...`);

    let discoveredCount = 0;
    let importedCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    // 1. Fetch existing template sources to check duplicate file hashes
    const existingHashes = new Set<string>();
    if (isInsforgeConfigured) {
      try {
        const { data: sources } = await insforge.database
          .from('template_sources')
          .select('file_hash');
        if (sources) {
          sources.forEach((s: any) => existingHashes.add(s.file_hash));
        }
      } catch (err) {
        addLog('warn', `Could not fetch existing template hashes from database: ${err}`);
      }
    }

    // 2. Fetch existing companies and roles for relational mapping
    const companies = await CompanyTemplateService.getCompanies();
    const roles = await CompanyTemplateService.getRoles();

    // 3. Process candidate sources
    for (const candidate of PUBLIC_TEMPLATE_SOURCES) {
      discoveredCount++;
      addLog('info', `Evaluating discovery: "${candidate.name}" from ${candidate.source_url}`);

      // Verify License
      const isLicenseApproved = APPROVED_LICENSES.some(lic => 
        candidate.license_name.toLowerCase().includes(lic.toLowerCase())
      );

      const verificationStatus: 'verified' | 'license_review_required' | 'rejected' = isLicenseApproved
        ? 'verified'
        : 'license_review_required';

      if (!isLicenseApproved) {
        addLog('warn', `Unverified or missing permissive license for "${candidate.name}". License found: ${candidate.license_name}. Queued for License Review.`);
      }

      // Security & Safety Scanning
      const safety = scanSafety(candidate.raw_content);
      if (!safety.safe) {
        addLog('error', `Security check failed for "${candidate.name}": ${safety.reason}`);
        errorCount++;
        continue;
      }

      // Calculate SHA-256 cryptographic hash
      const fileHash = await computeSHA256(candidate.raw_content);
      if (existingHashes.has(fileHash)) {
        addLog('info', `Duplicate detected for "${candidate.name}" with hash ${fileHash}. Skipping import.`);
        duplicateCount++;
        continue;
      }

      // Add to set to prevent within-batch duplicates
      existingHashes.add(fileHash);

      // Map to company and role
      const matchedCompany = companies.find(c => c.slug === candidate.target_company_slug);
      const matchedRole = roles.find(r => r.category === candidate.target_role_category || r.title.toLowerCase().includes(candidate.target_role_category.toLowerCase()));

      const templateId = `tmpl-${candidate.target_company_slug}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      const publicationStatus: 'pending_review' | 'published' = isLicenseApproved ? 'published' : 'pending_review';

      // Insert template into database if configured
      if (isInsforgeConfigured) {
        try {
          // A. Insert Template
          const { error: tmplError } = await insforge.database
            .from('templates')
            .insert({
              id: templateId,
              name: candidate.name,
              description: candidate.description,
              layout_style: candidate.layout_style,
              experience_level: candidate.experience_level,
              publication_status: publicationStatus,
              template_data: candidate.template_data,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (tmplError) {
            addLog('error', `Failed to insert template "${candidate.name}": ${tmplError.message}`);
            errorCount++;
            continue;
          }

          // B. Insert Company Mapping
          if (matchedCompany) {
            await insforge.database
              .from('template_companies')
              .insert({ template_id: templateId, company_id: matchedCompany.id });
          }

          // C. Insert Role Mapping
          if (matchedRole) {
            await insforge.database
              .from('template_roles')
              .insert({ template_id: templateId, role_id: matchedRole.id });
          }

          // D. Insert Verified Source with Cryptographic Hash
          await insforge.database
            .from('template_sources')
            .insert({
              template_id: templateId,
              source_url: candidate.source_url,
              license_name: candidate.license_name,
              license_url: candidate.license_url || null,
              attribution: candidate.attribution,
              file_hash: fileHash,
              verification_status: verificationStatus,
              verified_at: new Date().toISOString(),
            });

          importedCount++;
          addLog('info', `Imported "${candidate.name}" successfully (status: ${publicationStatus}, hash: ${fileHash.slice(0, 16)}...).`);
        } catch (dbErr: any) {
          addLog('error', `Database exception for "${candidate.name}": ${dbErr?.message || dbErr}`);
          errorCount++;
        }
      } else {
        // Fallback in-memory
        importedCount++;
        addLog('info', `Imported "${candidate.name}" into local memory (status: ${publicationStatus}).`);
      }
    }

    const finishedAt = new Date().toISOString();
    const runResult: AgentRun = {
      id: `run_${Date.now()}`,
      status: errorCount > 0 && importedCount === 0 ? 'failed' : 'completed',
      started_at: startedAt,
      finished_at: finishedAt,
      trigger_type: triggerType,
      results: {
        discovered: discoveredCount,
        imported: importedCount,
        duplicates: duplicateCount,
        errors: errorCount,
        sourcesChecked: PUBLIC_TEMPLATE_SOURCES.length,
        log
      },
      error_summary: errorCount > 0 ? `${errorCount} imports encountered issues during processing` : null
    };

    // Record agent run in DB
    if (isInsforgeConfigured) {
      try {
        await insforge.database
          .from('agent_runs')
          .insert({
            status: runResult.status,
            started_at: startedAt,
            finished_at: finishedAt,
            trigger_type: triggerType,
            results: runResult.results,
            error_summary: runResult.error_summary,
          });
      } catch (err) {
        console.warn('Could not record agent run in database:', err);
      }
    }

    addLog('info', `Agent run completed: ${importedCount} imported, ${duplicateCount} duplicates, ${errorCount} errors.`);
    return runResult;
  }
};
