import { insforge, isInsforgeConfigured } from '../lib/insforge';
import { 
  Company, 
  JobRole, 
  CompanyTemplate, 
  JobRequirement, 
  AgentRun, 
  TemplateReview,
  TemplateFilterState 
} from '../data/types';

// Fallback seed data in case network/offline mode is active
export const FALLBACK_COMPANIES: Company[] = [
  { id: '11111111-1111-4111-8111-111111111101', name: 'Google', slug: 'google', logo_url: 'https://www.google.com/favicon.ico', official_careers_url: 'https://careers.google.com', description: 'Global technology leader in search, cloud, AI, and systems software engineering.' },
  { id: '11111111-1111-4111-8111-111111111102', name: 'Microsoft', slug: 'microsoft', logo_url: 'https://www.microsoft.com/favicon.ico', official_careers_url: 'https://careers.microsoft.com', description: 'Pioneer in operating systems, enterprise cloud, developer platforms, and productivity software.' },
  { id: '11111111-1111-4111-8111-111111111103', name: 'Amazon', slug: 'amazon', logo_url: 'https://www.amazon.com/favicon.ico', official_careers_url: 'https://amazon.jobs', description: 'E-commerce, cloud computing (AWS), logistics, and large-scale distributed systems innovator.' },
  { id: '11111111-1111-4111-8111-111111111104', name: 'Adobe', slug: 'adobe', logo_url: 'https://www.adobe.com/favicon.ico', official_careers_url: 'https://careers.adobe.com', description: 'World leader in digital media, creative software suites, and enterprise document workflows.' },
  { id: '11111111-1111-4111-8111-111111111105', name: 'Infosys', slug: 'infosys', logo_url: 'https://www.infosys.com/favicon.ico', official_careers_url: 'https://career.infosys.com', description: 'Global digital services, consulting, next-gen enterprise technologies, and IT solutions.' },
  { id: '11111111-1111-4111-8111-111111111106', name: 'Tata Consultancy Services (TCS)', slug: 'tcs', logo_url: 'https://www.tcs.com/favicon.ico', official_careers_url: 'https://www.tcs.com/careers', description: 'Premier multinational IT service, digital transformation, and business solutions partner.' },
  { id: '11111111-1111-4111-8111-111111111107', name: 'Accenture', slug: 'accenture', logo_url: 'https://www.accenture.com/favicon.ico', official_careers_url: 'https://www.accenture.com/careers', description: 'Global professional services company with leading capabilities in digital, cloud, and security.' },
  { id: '11111111-1111-4111-8111-111111111108', name: 'Wipro', slug: 'wipro', logo_url: 'https://www.wipro.com/favicon.ico', official_careers_url: 'https://careers.wipro.com', description: 'Leading technology services and consulting company focused on building innovative solutions.' },
  { id: '11111111-1111-4111-8111-111111111109', name: 'Oracle', slug: 'oracle', logo_url: 'https://www.oracle.com/favicon.ico', official_careers_url: 'https://www.oracle.com/corporate/careers', description: 'Database management systems, cloud infrastructure (OCI), enterprise software, and Java platform steward.' },
  { id: '11111111-1111-4111-8111-111111111110', name: 'Salesforce', slug: 'salesforce', logo_url: 'https://www.salesforce.com/favicon.ico', official_careers_url: 'https://www.salesforce.com/company/careers', description: 'Customer relationship management (CRM) innovator and enterprise enterprise cloud ecosystem.' }
];

export const FALLBACK_ROLES: JobRole[] = [
  { id: '22222222-2222-4222-8222-222222222201', title: 'Java Developer', category: 'Software Engineering', experience_level: 'Entry-Level & Fresher' },
  { id: '22222222-2222-4222-8222-222222222202', title: 'Software Engineer', category: 'Software Engineering', experience_level: 'All Levels' },
  { id: '22222222-2222-4222-8222-222222222203', title: 'Full-Stack Developer', category: 'Web & Cloud', experience_level: 'All Levels' },
  { id: '22222222-2222-4222-8222-222222222204', title: 'Data Analyst', category: 'Data & Analytics', experience_level: 'All Levels' },
  { id: '22222222-2222-4222-8222-222222222205', title: 'AI and Automation', category: 'AI & Machine Learning', experience_level: 'All Levels' }
];

export const FALLBACK_TEMPLATES: CompanyTemplate[] = [
  {
    id: 'tmpl-google-swe-clean',
    name: 'Google SWE ATS Minimalist',
    description: 'High-signal, single-column engineering layout emphasizing technical depth, algorithms, quantifiable metrics, and open-source contributions.',
    layout_style: 'single-column',
    experience_level: 'Entry-Level & Experienced',
    publication_status: 'published',
    template_data: { baseTemplate: 'classic', badge: 'High Signal', recommendedFont: 'Calibri', accentColor: '#1a73e8', highlights: ['Quantifiable impact', 'Algorithms & Data Structures', 'Production systems'] },
    companies: [FALLBACK_COMPANIES[0]],
    roles: [FALLBACK_ROLES[1]],
    source: {
      source_url: 'https://github.com/resumeforge/templates/blob/main/ats/google-swe.json',
      license_name: 'MIT License',
      license_url: 'https://opensource.org/licenses/MIT',
      attribution: 'ResumeForge Open Template Initiative (MIT)',
      file_hash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      verification_status: 'verified'
    }
  },
  {
    id: 'tmpl-amazon-leadership-ats',
    name: 'Amazon Leadership & Impact ATS',
    description: 'Optimized around Customer Obsession, Ownership, and Bias for Action with STAR-formatted bullet points and concrete delivery metrics.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    publication_status: 'published',
    template_data: { baseTemplate: 'modern', badge: 'Leadership Focus', recommendedFont: 'Arial', accentColor: '#ff9900', highlights: ['STAR Method bullets', 'Operational excellence', 'Metrics & scale'] },
    companies: [FALLBACK_COMPANIES[2]],
    roles: [FALLBACK_ROLES[1]],
    source: {
      source_url: 'https://github.com/resumeforge/templates/blob/main/ats/amazon-leadership.json',
      license_name: 'MIT License',
      license_url: 'https://opensource.org/licenses/MIT',
      attribution: 'ResumeForge Open Template Initiative (MIT)',
      file_hash: 'sha256-4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      verification_status: 'verified'
    }
  },
  {
    id: 'tmpl-microsoft-cloud-architect',
    name: 'Microsoft Systems & Cloud Engineer',
    description: 'Architectural and systems engineering structure designed for cloud engineering, scalable APIs, and distributed architectures.',
    layout_style: 'single-column',
    experience_level: 'Mid-Level & Senior',
    publication_status: 'published',
    template_data: { baseTemplate: 'compact', badge: 'Cloud Architecture', recommendedFont: 'Segoe UI', accentColor: '#00a4ef', highlights: ['Azure / Cloud native', 'Microservices', 'Security & scale'] },
    companies: [FALLBACK_COMPANIES[1]],
    roles: [FALLBACK_ROLES[2]],
    source: {
      source_url: 'https://github.com/resumeforge/templates/blob/main/ats/microsoft-cloud.json',
      license_name: 'MIT License',
      license_url: 'https://opensource.org/licenses/MIT',
      attribution: 'ResumeForge Open Template Initiative (MIT)',
      file_hash: 'sha256-ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      verification_status: 'verified'
    }
  },
  {
    id: 'tmpl-adobe-creative-swe',
    name: 'Adobe Full-Stack & UI Systems',
    description: 'Sleek, high-polish typography balancing frontend systems mastery with full-stack backend reliability and performance telemetry.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    publication_status: 'published',
    template_data: { baseTemplate: 'elegant', badge: 'Full-Stack Design', recommendedFont: 'Inter', accentColor: '#eb1000', highlights: ['Design systems', 'Core Web Vitals', 'API integration'] },
    companies: [FALLBACK_COMPANIES[3]],
    roles: [FALLBACK_ROLES[2]],
    source: {
      source_url: 'https://github.com/resumeforge/templates/blob/main/ats/adobe-creative.json',
      license_name: 'CC-BY-4.0',
      license_url: 'https://creativecommons.org/licenses/by/4.0/',
      attribution: 'ResumeForge Design Systems (CC-BY-4.0)',
      file_hash: 'sha256-5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',
      verification_status: 'verified'
    }
  },
  {
    id: 'tmpl-tcs-fresher-classic',
    name: 'TCS Campus Placement Academic',
    description: 'Traditional formal academic structure with 5-column education qualifications table, academic projects, training credentials, and declaration.',
    layout_style: 'academic-table',
    experience_level: 'Fresher & Campus Placements',
    publication_status: 'published',
    template_data: { baseTemplate: 'classic-resume', badge: 'Campus Placement', recommendedFont: 'Times New Roman', accentColor: '#0f172a', highlights: ['5-Column Qualifications Table', 'Academic Projects', 'Declaration & Signature'] },
    companies: [FALLBACK_COMPANIES[5]],
    roles: [FALLBACK_ROLES[0], FALLBACK_ROLES[1]],
    source: {
      source_url: 'https://github.com/resumeforge/templates/blob/main/ats/tcs-fresher-academic.json',
      license_name: 'Public Domain (CC0)',
      license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
      attribution: 'Indian University Placement Standard Curriculum (CC0)',
      file_hash: 'sha256-2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
      verification_status: 'verified'
    }
  },
  {
    id: 'tmpl-infosys-systems-engineer',
    name: 'Infosys Systems & Java Specialist',
    description: 'Structured formal technical template highlighting core Java, object-oriented design, databases, certifications, and enterprise training.',
    layout_style: 'single-column',
    experience_level: 'Fresher & Entry-Level',
    publication_status: 'published',
    template_data: { baseTemplate: 'technical', badge: 'Enterprise Core', recommendedFont: 'Arial', accentColor: '#007cc3', highlights: ['Core Java / Spring Boot', 'Relational DBs', 'Structured Certifications'] },
    companies: [FALLBACK_COMPANIES[4]],
    roles: [FALLBACK_ROLES[0]],
    source: {
      source_url: 'https://github.com/resumeforge/templates/blob/main/ats/infosys-java.json',
      license_name: 'MIT License',
      license_url: 'https://opensource.org/licenses/MIT',
      attribution: 'ResumeForge Open Template Initiative (MIT)',
      file_hash: 'sha256-fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9',
      verification_status: 'verified'
    }
  },
  {
    id: 'tmpl-oracle-java-backend',
    name: 'Oracle Java Platform & Database Engineer',
    description: 'Rigorous engineering layout emphasizing concurrency, database performance, transactional integrity, and backend optimization.',
    layout_style: 'single-column',
    experience_level: 'Entry-Level & Mid-Level',
    publication_status: 'published',
    template_data: { baseTemplate: 'technical', badge: 'High Concurrency', recommendedFont: 'Courier', accentColor: '#f80000', highlights: ['Java Concurrency', 'SQL Optimization', 'High Availability'] },
    companies: [FALLBACK_COMPANIES[8]],
    roles: [FALLBACK_ROLES[0]],
    source: {
      source_url: 'https://github.com/resumeforge/templates/blob/main/ats/oracle-java.json',
      license_name: 'MIT License',
      license_url: 'https://opensource.org/licenses/MIT',
      attribution: 'ResumeForge Open Template Initiative (MIT)',
      file_hash: 'sha256-4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5',
      verification_status: 'verified'
    }
  },
  {
    id: 'tmpl-accenture-data-analyst',
    name: 'Accenture Data & Business Insights',
    description: 'Analytical resume format tailored for SQL, BI dashboards, statistical modeling, data pipelines, and cross-functional reporting.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    publication_status: 'published',
    template_data: { baseTemplate: 'executive', badge: 'Data Insights', recommendedFont: 'Arial', accentColor: '#a100ff', highlights: ['SQL & Python Data Stack', 'BI Visualizations', 'Stakeholder Impact'] },
    companies: [FALLBACK_COMPANIES[6]],
    roles: [FALLBACK_ROLES[3]],
    source: {
      source_url: 'https://github.com/resumeforge/templates/blob/main/ats/accenture-data.json',
      license_name: 'MIT License',
      license_url: 'https://opensource.org/licenses/MIT',
      attribution: 'ResumeForge Open Template Initiative (MIT)',
      file_hash: 'sha256-ad7dacb2c3954e7d95392cf99a1982b6c167f6b92138eb157e174be68bc224e7',
      verification_status: 'verified'
    }
  },
  {
    id: 'tmpl-wipro-ai-automation',
    name: 'Wipro AI, ML & Intelligent Automation',
    description: 'Specialized format highlighting machine learning models, GenAI implementations, automation scripts, and quantitative project milestones.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    publication_status: 'published',
    template_data: { baseTemplate: 'modern', badge: 'AI & Automation', recommendedFont: 'Inter', accentColor: '#14b8a6', highlights: ['Python / PyTorch / LLMs', 'Automation Pipelines', 'Model Evaluation'] },
    companies: [FALLBACK_COMPANIES[7]],
    roles: [FALLBACK_ROLES[4]],
    source: {
      source_url: 'https://github.com/resumeforge/templates/blob/main/ats/wipro-ai.json',
      license_name: 'MIT License',
      license_url: 'https://opensource.org/licenses/MIT',
      attribution: 'ResumeForge Open Template Initiative (MIT)',
      file_hash: 'sha256-108b98263eb21434c387cf3d3b762886f4a7c88b9a22f3e5c92c9748b62c050c',
      verification_status: 'verified'
    }
  },
  {
    id: 'tmpl-salesforce-fullstack',
    name: 'Salesforce Cloud Platform Developer',
    description: 'Enterprise cloud template highlighting CRM architectures, modular API design, modern JavaScript/TypeScript, and integration patterns.',
    layout_style: 'single-column',
    experience_level: 'All Levels',
    publication_status: 'published',
    template_data: { baseTemplate: 'compact', badge: 'Enterprise Cloud', recommendedFont: 'Segoe UI', accentColor: '#00a1e0', highlights: ['REST / GraphQL APIs', 'Microservices', 'Data Architecture'] },
    companies: [FALLBACK_COMPANIES[9]],
    roles: [FALLBACK_ROLES[2]],
    source: {
      source_url: 'https://github.com/resumeforge/templates/blob/main/ats/salesforce-fullstack.json',
      license_name: 'MIT License',
      license_url: 'https://opensource.org/licenses/MIT',
      attribution: 'ResumeForge Open Template Initiative (MIT)',
      file_hash: 'sha256-06830723a9d3575fa63e0258286a8ff33eb8caab26e5fc502fc2eb3cf93eb1f9',
      verification_status: 'verified'
    }
  }
];

export const FALLBACK_JOB_REQUIREMENTS: JobRequirement[] = [
  {
    id: '33333333-3333-4333-8333-333333333301',
    company_id: '11111111-1111-4111-8111-111111111101',
    role_id: '22222222-2222-4222-8222-222222222202',
    source_url: 'https://careers.google.com/jobs/results/?q=Software%20Engineer',
    skills: ['Data Structures & Algorithms', 'C++ / Java / Python / Go', 'System Design', 'Distributed Computing', 'Concurrency', 'Unit Testing'],
    keywords: ['latency', 'throughput', 'O(log n)', 'distributed systems', 'production scale', 'fault tolerance'],
    recommended_sections: ['Work Experience', 'Academic Projects', 'Technical Skills', 'Education']
  },
  {
    id: '33333333-3333-4333-8333-333333333302',
    company_id: '11111111-1111-4111-8111-111111111103',
    role_id: '22222222-2222-4222-8222-222222222202',
    source_url: 'https://amazon.jobs/en/job_categories/software-development',
    skills: ['Java / C#', 'AWS (EC2, S3, DynamoDB, Lambda)', 'Object-Oriented Design', 'CI/CD', 'High Availability', 'Microservices'],
    keywords: ['customer obsession', 'delivered', 'reduced operational load', 'increased throughput by', 'ownership', '99.99% availability'],
    recommended_sections: ['Work Experience', 'Key Projects', 'Technical Skills', 'Education']
  },
  {
    id: '33333333-3333-4333-8333-333333333303',
    company_id: '11111111-1111-4111-8111-111111111106',
    role_id: '22222222-2222-4222-8222-222222222201',
    source_url: 'https://www.tcs.com/careers/india/entry-level',
    skills: ['Core Java (JDK 8-21)', 'OOPs Concepts', 'Spring Boot', 'SQL (PostgreSQL/MySQL)', 'Git', 'REST APIs'],
    keywords: ['B.Tech', 'academic project', 'spring framework', 'RDBMS', 'clean code', 'certifications'],
    recommended_sections: ['Career Objective', 'Educational Qualifications', 'Technical Skills', 'Academic Project', 'Declaration']
  },
  {
    id: '33333333-3333-4333-8333-333333333304',
    company_id: '11111111-1111-4111-8111-111111111105',
    role_id: '22222222-2222-4222-8222-222222222201',
    source_url: 'https://career.infosys.com/joblist',
    skills: ['Java', 'Spring Boot', 'Hibernate / JPA', 'Microservices', 'RESTful Web Services', 'Maven/Gradle'],
    keywords: ['enterprise applications', 'API contracts', 'database design', 'unit testing', 'agile'],
    recommended_sections: ['Career Objective', 'Education', 'Technical Skills', 'Projects', 'Internship / Training']
  },
  {
    id: '33333333-3333-4333-8333-333333333305',
    company_id: '11111111-1111-4111-8111-111111111107',
    role_id: '22222222-2222-4222-8222-222222222204',
    source_url: 'https://www.accenture.com/in-en/careers/jobsearch?jk=data%20analyst',
    skills: ['Advanced SQL', 'Python (Pandas, NumPy)', 'Power BI / Tableau', 'Data Modeling', 'Excel Modeling', 'ETL Pipelines'],
    keywords: ['KPIs', 'dashboards', 'business insights', 'data cleansing', 'automated reporting', 'statistical analysis'],
    recommended_sections: ['Work Experience', 'Data Projects', 'Technical Skills & Tools', 'Education']
  },
  {
    id: '33333333-3333-4333-8333-333333333306',
    company_id: '11111111-1111-4111-8111-111111111108',
    role_id: '22222222-2222-4222-8222-222222222205',
    source_url: 'https://careers.wipro.com/careers-home/jobs?keywords=ai',
    skills: ['Python', 'PyTorch / TensorFlow', 'Prompt Engineering / LLMs', 'Automation (Selenium, Playwright)', 'REST APIs', 'Docker'],
    keywords: ['model accuracy', 'RAG architecture', 'automated workflows', 'inference speed', 'evaluation metrics'],
    recommended_sections: ['Technical Skills', 'AI / Automation Projects', 'Experience', 'Certifications']
  }
];

export const CompanyTemplateService = {
  async getCompanies(): Promise<Company[]> {
    if (isInsforgeConfigured) {
      try {
        const { data, error } = await insforge.database
          .from('companies')
          .select('*')
          .order('name', { ascending: true });
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('InsForge getCompanies error, using fallback:', err);
      }
    }
    return FALLBACK_COMPANIES;
  },

  async addCompany(company: { name: string; slug: string; logo_url?: string; official_careers_url?: string; description?: string }): Promise<{ data?: Company; error?: any }> {
    if (isInsforgeConfigured) {
      try {
        const { data, error } = await insforge.database
          .from('companies')
          .insert({
            name: company.name,
            slug: company.slug.toLowerCase().trim(),
            logo_url: company.logo_url || null,
            official_careers_url: company.official_careers_url || null,
            description: company.description || null,
          })
          .select()
          .single();
        if (error) return { error };
        return { data };
      } catch (err) {
        return { error: err };
      }
    }
    const newComp: Company = {
      id: `comp_${Date.now()}`,
      ...company,
      created_at: new Date().toISOString()
    };
    FALLBACK_COMPANIES.push(newComp);
    return { data: newComp };
  },

  async getRoles(): Promise<JobRole[]> {
    if (isInsforgeConfigured) {
      try {
        const { data, error } = await insforge.database
          .from('roles')
          .select('*')
          .order('title', { ascending: true });
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('InsForge getRoles error, using fallback:', err);
      }
    }
    return FALLBACK_ROLES;
  },

  async getTemplates(filter?: TemplateFilterState, includeUnpublished = false): Promise<CompanyTemplate[]> {
    if (isInsforgeConfigured) {
      try {
        let query = insforge.database
          .from('templates')
          .select(`
            *,
            template_companies ( company_id, companies (*) ),
            template_roles ( role_id, roles (*) ),
            template_sources (*)
          `);

        if (!includeUnpublished) {
          query = query.eq('publication_status', 'published');
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          const templates: CompanyTemplate[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            layout_style: item.layout_style,
            experience_level: item.experience_level,
            publication_status: item.publication_status,
            preview_url: item.preview_url,
            asset_url: item.asset_url,
            template_data: item.template_data,
            created_at: item.created_at,
            updated_at: item.updated_at,
            companies: item.template_companies?.map((tc: any) => tc.companies).filter(Boolean) || [],
            roles: item.template_roles?.map((tr: any) => tr.roles).filter(Boolean) || [],
            source: item.template_sources?.[0] || undefined
          }));
          return this.applyFilters(templates, filter);
        }
      } catch (err) {
        console.warn('InsForge getTemplates error, using fallback:', err);
      }
    }
    return this.applyFilters(FALLBACK_TEMPLATES, filter);
  },

  applyFilters(templates: CompanyTemplate[], filter?: TemplateFilterState): CompanyTemplate[] {
    if (!filter) return templates;
    return templates.filter((tmpl) => {
      if (filter.companySlug && filter.companySlug !== 'all') {
        const matchesComp = tmpl.companies?.some(c => c.slug === filter.companySlug);
        if (!matchesComp) return false;
      }
      if (filter.roleCategory && filter.roleCategory !== 'all') {
        const matchesRole = tmpl.roles?.some(r => r.category === filter.roleCategory || r.title === filter.roleCategory);
        if (!matchesRole) return false;
      }
      if (filter.experienceLevel && filter.experienceLevel !== 'all') {
        const matchesExp = tmpl.experience_level.toLowerCase().includes(filter.experienceLevel.toLowerCase()) || tmpl.experience_level === 'All Levels';
        if (!matchesExp) return false;
      }
      if (filter.layoutStyle && filter.layoutStyle !== 'all') {
        if (tmpl.layout_style !== filter.layoutStyle) return false;
      }
      if (filter.searchQuery && filter.searchQuery.trim() !== '') {
        const q = filter.searchQuery.toLowerCase();
        const matchesText = 
          tmpl.name.toLowerCase().includes(q) ||
          (tmpl.description && tmpl.description.toLowerCase().includes(q)) ||
          tmpl.companies?.some(c => c.name.toLowerCase().includes(q)) ||
          tmpl.roles?.some(r => r.title.toLowerCase().includes(q));
        if (!matchesText) return false;
      }
      if (filter.selectedSkill && filter.selectedSkill.trim() !== '') {
        const sk = filter.selectedSkill.toLowerCase();
        const highlights = tmpl.template_data?.highlights || [];
        const matchesSkill = highlights.some((h: string) => h.toLowerCase().includes(sk));
        if (!matchesSkill) return false;
      }
      return true;
    });
  },

  async getJobRequirements(companyId?: string, roleId?: string): Promise<JobRequirement[]> {
    if (isInsforgeConfigured) {
      try {
        let query = insforge.database
          .from('job_requirements')
          .select(`
            *,
            company:companies (*),
            role:roles (*)
          `);
        if (companyId) query = query.eq('company_id', companyId);
        if (roleId) query = query.eq('role_id', roleId);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('InsForge getJobRequirements error, using fallback:', err);
      }
    }
    return FALLBACK_JOB_REQUIREMENTS.filter(req => {
      if (companyId && req.company_id !== companyId) return false;
      if (roleId && req.role_id !== roleId) return false;
      return true;
    });
  },

  async updateTemplateStatus(templateId: string, status: 'published' | 'rejected' | 'pending_review' | 'archived', reviewerNotes?: string): Promise<boolean> {
    if (isInsforgeConfigured) {
      try {
        const { error: updateError } = await insforge.database
          .from('templates')
          .update({ publication_status: status, updated_at: new Date().toISOString() })
          .eq('id', templateId);
        if (updateError) {
          console.error('Error updating template status:', updateError);
          return false;
        }

        if (reviewerNotes) {
          const { data: authData } = await insforge.auth.getCurrentUser();
          await insforge.database
            .from('template_reviews')
            .insert({
              template_id: templateId,
              reviewer_id: authData?.user?.id || null,
              reviewer_email: authData?.user?.email || 'admin@resumeforge.dev',
              decision: status === 'published' ? 'approved' : 'rejected',
              notes: reviewerNotes,
            });
        }
        return true;
      } catch (e) {
        console.error('Exception updating template status:', e);
        return false;
      }
    }
    const tmpl = FALLBACK_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) tmpl.publication_status = status;
    return true;
  },

  async getAgentRuns(limit = 10): Promise<AgentRun[]> {
    if (isInsforgeConfigured) {
      try {
        const { data, error } = await insforge.database
          .from('agent_runs')
          .select('*')
          .order('started_at', { ascending: false })
          .limit(limit);
        if (!error && data) {
          return data;
        }
      } catch (e) {
        console.warn('Failed to fetch agent runs:', e);
      }
    }
    return [];
  }
};
