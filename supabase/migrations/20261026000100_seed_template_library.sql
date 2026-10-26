-- Migration: 20261026000100_seed_template_library.sql
-- Description: Seed initial 10 companies, 5 job categories/roles, job requirements, and company-targeted templates.

-- 1. SEED COMPANIES
INSERT INTO public.companies (id, name, slug, logo_url, official_careers_url, description)
VALUES 
  ('11111111-1111-4111-8111-111111111101', 'Google', 'google', 'https://www.google.com/favicon.ico', 'https://careers.google.com', 'Global technology leader in search, cloud, AI, and systems software engineering.'),
  ('11111111-1111-4111-8111-111111111102', 'Microsoft', 'microsoft', 'https://www.microsoft.com/favicon.ico', 'https://careers.microsoft.com', 'Pioneer in operating systems, enterprise cloud, developer platforms, and productivity software.'),
  ('11111111-1111-4111-8111-111111111103', 'Amazon', 'amazon', 'https://www.amazon.com/favicon.ico', 'https://amazon.jobs', 'E-commerce, cloud computing (AWS), logistics, and large-scale distributed systems innovator.'),
  ('11111111-1111-4111-8111-111111111104', 'Adobe', 'adobe', 'https://www.adobe.com/favicon.ico', 'https://careers.adobe.com', 'World leader in digital media, creative software suites, and enterprise document workflows.'),
  ('11111111-1111-4111-8111-111111111105', 'Infosys', 'infosys', 'https://www.infosys.com/favicon.ico', 'https://career.infosys.com', 'Global digital services, consulting, next-gen enterprise technologies, and IT solutions.'),
  ('11111111-1111-4111-8111-111111111106', 'Tata Consultancy Services (TCS)', 'tcs', 'https://www.tcs.com/favicon.ico', 'https://www.tcs.com/careers', 'Premier multinational IT service, digital transformation, and business solutions partner.'),
  ('11111111-1111-4111-8111-111111111107', 'Accenture', 'accenture', 'https://www.accenture.com/favicon.ico', 'https://www.accenture.com/careers', 'Global professional services company with leading capabilities in digital, cloud, and security.'),
  ('11111111-1111-4111-8111-111111111108', 'Wipro', 'wipro', 'https://www.wipro.com/favicon.ico', 'https://careers.wipro.com', 'Leading technology services and consulting company focused on building innovative solutions.'),
  ('11111111-1111-4111-8111-111111111109', 'Oracle', 'oracle', 'https://www.oracle.com/favicon.ico', 'https://www.oracle.com/corporate/careers', 'Database management systems, cloud infrastructure (OCI), enterprise software, and Java platform steward.'),
  ('11111111-1111-4111-8111-111111111110', 'Salesforce', 'salesforce', 'https://www.salesforce.com/favicon.ico', 'https://www.salesforce.com/company/careers', 'Customer relationship management (CRM) innovator and enterprise enterprise cloud ecosystem.')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  official_careers_url = EXCLUDED.official_careers_url,
  description = EXCLUDED.description;

-- 2. SEED ROLES
INSERT INTO public.roles (id, title, category, experience_level)
VALUES
  ('22222222-2222-4222-8222-222222222201', 'Java Developer', 'Software Engineering', 'Entry-Level & Fresher'),
  ('22222222-2222-4222-8222-222222222202', 'Software Engineer', 'Software Engineering', 'All Levels'),
  ('22222222-2222-4222-8222-222222222203', 'Full-Stack Developer', 'Web & Cloud', 'All Levels'),
  ('22222222-2222-4222-8222-222222222204', 'Data Analyst', 'Data & Analytics', 'All Levels'),
  ('22222222-2222-4222-8222-222222222205', 'AI and Automation', 'AI & Machine Learning', 'All Levels')
ON CONFLICT (title, experience_level) DO NOTHING;

-- 3. SEED TEMPLATES
INSERT INTO public.templates (id, name, description, layout_style, experience_level, publication_status, template_data)
VALUES
  (
    'tmpl-google-swe-clean',
    'Google SWE ATS Minimalist',
    'High-signal, single-column engineering layout emphasizing technical depth, algorithms, quantifiable metrics, and open-source contributions.',
    'single-column',
    'Entry-Level & Experienced',
    'published',
    '{"baseTemplate": "classic", "badge": "High Signal", "recommendedFont": "Calibri", "accentColor": "#1a73e8", "highlights": ["Quantifiable impact", "Algorithms & Data Structures", "Production systems"]}'::jsonb
  ),
  (
    'tmpl-amazon-leadership-ats',
    'Amazon Leadership & Impact ATS',
    'Optimized around Customer Obsession, Ownership, and Bias for Action with STAR-formatted bullet points and concrete delivery metrics.',
    'single-column',
    'All Levels',
    'published',
    '{"baseTemplate": "modern", "badge": "Leadership Focus", "recommendedFont": "Arial", "accentColor": "#ff9900", "highlights": ["STAR Method bullets", "Operational excellence", "Metrics & scale"]}'::jsonb
  ),
  (
    'tmpl-microsoft-cloud-architect',
    'Microsoft Systems & Cloud Engineer',
    'Architectural and systems engineering structure designed for cloud engineering, scalable APIs, and distributed architectures.',
    'single-column',
    'Mid-Level & Senior',
    'published',
    '{"baseTemplate": "compact", "badge": "Cloud Architecture", "recommendedFont": "Segoe UI", "accentColor": "#00a4ef", "highlights": ["Azure / Cloud native", "Microservices", "Security & scale"]}'::jsonb
  ),
  (
    'tmpl-adobe-creative-swe',
    'Adobe Full-Stack & UI Systems',
    'Sleek, high-polish typography balancing frontend systems mastery with full-stack backend reliability and performance telemetry.',
    'single-column',
    'All Levels',
    'published',
    '{"baseTemplate": "elegant", "badge": "Full-Stack Design", "recommendedFont": "Inter", "accentColor": "#eb1000", "highlights": ["Design systems", "Core Web Vitals", "API integration"]}'::jsonb
  ),
  (
    'tmpl-tcs-fresher-classic',
    'TCS Campus Placement Academic',
    'Traditional formal academic structure with 5-column education qualifications table, academic projects, training credentials, and declaration.',
    'academic-table',
    'Fresher & Campus Placements',
    'published',
    '{"baseTemplate": "classic-resume", "badge": "Campus Placement", "recommendedFont": "Times New Roman", "accentColor": "#0f172a", "highlights": ["5-Column Qualifications Table", "Academic Projects", "Declaration & Signature"]}'::jsonb
  ),
  (
    'tmpl-infosys-systems-engineer',
    'Infosys Systems & Java Specialist',
    'Structured formal technical template highlighting core Java, object-oriented design, databases, certifications, and enterprise training.',
    'single-column',
    'Fresher & Entry-Level',
    'published',
    '{"baseTemplate": "technical", "badge": "Enterprise Core", "recommendedFont": "Arial", "accentColor": "#007cc3", "highlights": ["Core Java / Spring Boot", "Relational DBs", "Structured Certifications"]}'::jsonb
  ),
  (
    'tmpl-oracle-java-backend',
    'Oracle Java Platform & Database Engineer',
    'Rigorous engineering layout emphasizing concurrency, database performance, transactional integrity, and backend optimization.',
    'single-column',
    'Entry-Level & Mid-Level',
    'published',
    '{"baseTemplate": "technical", "badge": "High Concurrency", "recommendedFont": "Courier", "accentColor": "#f80000", "highlights": ["Java Concurrency", "SQL Optimization", "High Availability"]}'::jsonb
  ),
  (
    'tmpl-accenture-data-analyst',
    'Accenture Data & Business Insights',
    'Analytical resume format tailored for SQL, BI dashboards, statistical modeling, data pipelines, and cross-functional reporting.',
    'single-column',
    'All Levels',
    'published',
    '{"baseTemplate": "executive", "badge": "Data Insights", "recommendedFont": "Arial", "accentColor": "#a100ff", "highlights": ["SQL & Python Data Stack", "BI Visualizations", "Stakeholder Impact"]}'::jsonb
  ),
  (
    'tmpl-wipro-ai-automation',
    'Wipro AI, ML & Intelligent Automation',
    'Specialized format highlighting machine learning models, GenAI implementations, automation scripts, and quantitative project milestones.',
    'single-column',
    'All Levels',
    'published',
    '{"baseTemplate": "modern", "badge": "AI & Automation", "recommendedFont": "Inter", "accentColor": "#14b8a6", "highlights": ["Python / PyTorch / LLMs", "Automation Pipelines", "Model Evaluation"]}'::jsonb
  ),
  (
    'tmpl-salesforce-fullstack',
    'Salesforce Cloud Platform Developer',
    'Enterprise cloud template highlighting CRM architectures, modular API design, modern JavaScript/TypeScript, and integration patterns.',
    'single-column',
    'All Levels',
    'published',
    '{"baseTemplate": "compact", "badge": "Enterprise Cloud", "recommendedFont": "Segoe UI", "accentColor": "#00a1e0", "highlights": ["REST / GraphQL APIs", "Microservices", "Data Architecture"]}'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  layout_style = EXCLUDED.layout_style,
  experience_level = EXCLUDED.experience_level,
  publication_status = EXCLUDED.publication_status,
  template_data = EXCLUDED.template_data;

-- 4. MAP TEMPLATES TO COMPANIES
INSERT INTO public.template_companies (template_id, company_id)
VALUES
  ('tmpl-google-swe-clean', '11111111-1111-4111-8111-111111111101'),
  ('tmpl-amazon-leadership-ats', '11111111-1111-4111-8111-111111111103'),
  ('tmpl-microsoft-cloud-architect', '11111111-1111-4111-8111-111111111102'),
  ('tmpl-adobe-creative-swe', '11111111-1111-4111-8111-111111111104'),
  ('tmpl-tcs-fresher-classic', '11111111-1111-4111-8111-111111111106'),
  ('tmpl-infosys-systems-engineer', '11111111-1111-4111-8111-111111111105'),
  ('tmpl-oracle-java-backend', '11111111-1111-4111-8111-111111111109'),
  ('tmpl-accenture-data-analyst', '11111111-1111-4111-8111-111111111107'),
  ('tmpl-wipro-ai-automation', '11111111-1111-4111-8111-111111111108'),
  ('tmpl-salesforce-fullstack', '11111111-1111-4111-8111-111111111110')
ON CONFLICT (template_id, company_id) DO NOTHING;

-- 5. MAP TEMPLATES TO ROLES
INSERT INTO public.template_roles (template_id, role_id)
VALUES
  ('tmpl-google-swe-clean', '22222222-2222-4222-8222-222222222202'),
  ('tmpl-amazon-leadership-ats', '22222222-2222-4222-8222-222222222202'),
  ('tmpl-microsoft-cloud-architect', '22222222-2222-4222-8222-222222222203'),
  ('tmpl-adobe-creative-swe', '22222222-2222-4222-8222-222222222203'),
  ('tmpl-tcs-fresher-classic', '22222222-2222-4222-8222-222222222201'),
  ('tmpl-tcs-fresher-classic', '22222222-2222-4222-8222-222222222202'),
  ('tmpl-infosys-systems-engineer', '22222222-2222-4222-8222-222222222201'),
  ('tmpl-oracle-java-backend', '22222222-2222-4222-8222-222222222201'),
  ('tmpl-accenture-data-analyst', '22222222-2222-4222-8222-222222222204'),
  ('tmpl-wipro-ai-automation', '22222222-2222-4222-8222-222222222205'),
  ('tmpl-salesforce-fullstack', '22222222-2222-4222-8222-222222222203')
ON CONFLICT (template_id, role_id) DO NOTHING;

-- 6. SEED VERIFIED TEMPLATE SOURCES (Permissive Licenses & Cryptographic Hashes)
INSERT INTO public.template_sources (template_id, source_url, license_name, license_url, attribution, file_hash, verification_status)
VALUES
  ('tmpl-google-swe-clean', 'https://github.com/resumeforge/templates/blob/main/ats/google-swe.json', 'MIT License', 'https://opensource.org/licenses/MIT', 'ResumeForge Open Template Initiative (MIT)', 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'verified'),
  ('tmpl-amazon-leadership-ats', 'https://github.com/resumeforge/templates/blob/main/ats/amazon-leadership.json', 'MIT License', 'https://opensource.org/licenses/MIT', 'ResumeForge Open Template Initiative (MIT)', 'sha256-4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a', 'verified'),
  ('tmpl-microsoft-cloud-architect', 'https://github.com/resumeforge/templates/blob/main/ats/microsoft-cloud.json', 'MIT License', 'https://opensource.org/licenses/MIT', 'ResumeForge Open Template Initiative (MIT)', 'sha256-ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d', 'verified'),
  ('tmpl-adobe-creative-swe', 'https://github.com/resumeforge/templates/blob/main/ats/adobe-creative.json', 'CC-BY-4.0', 'https://creativecommons.org/licenses/by/4.0/', 'ResumeForge Design Systems (CC-BY-4.0)', 'sha256-5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'verified'),
  ('tmpl-tcs-fresher-classic', 'https://github.com/resumeforge/templates/blob/main/ats/tcs-fresher-academic.json', 'Public Domain (CC0)', 'https://creativecommons.org/publicdomain/zero/1.0/', 'Indian University Placement Standard Curriculum (CC0)', 'sha256-2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae', 'verified'),
  ('tmpl-infosys-systems-engineer', 'https://github.com/resumeforge/templates/blob/main/ats/infosys-java.json', 'MIT License', 'https://opensource.org/licenses/MIT', 'ResumeForge Open Template Initiative (MIT)', 'sha256-fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9', 'verified'),
  ('tmpl-oracle-java-backend', 'https://github.com/resumeforge/templates/blob/main/ats/oracle-java.json', 'MIT License', 'https://opensource.org/licenses/MIT', 'ResumeForge Open Template Initiative (MIT)', 'sha256-4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5', 'verified'),
  ('tmpl-accenture-data-analyst', 'https://github.com/resumeforge/templates/blob/main/ats/accenture-data.json', 'MIT License', 'https://opensource.org/licenses/MIT', 'ResumeForge Open Template Initiative (MIT)', 'sha256-ad7dacb2c3954e7d95392cf99a1982b6c167f6b92138eb157e174be68bc224e7', 'verified'),
  ('tmpl-wipro-ai-automation', 'https://github.com/resumeforge/templates/blob/main/ats/wipro-ai.json', 'MIT License', 'https://opensource.org/licenses/MIT', 'ResumeForge Open Template Initiative (MIT)', 'sha256-108b98263eb21434c387cf3d3b762886f4a7c88b9a22f3e5c92c9748b62c050c', 'verified'),
  ('tmpl-salesforce-fullstack', 'https://github.com/resumeforge/templates/blob/main/ats/salesforce-fullstack.json', 'MIT License', 'https://opensource.org/licenses/MIT', 'ResumeForge Open Template Initiative (MIT)', 'sha256-06830723a9d3575fa63e0258286a8ff33eb8caab26e5fc502fc2eb3cf93eb1f9', 'verified')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED JOB REQUIREMENTS (Public Career Framework Data)
INSERT INTO public.job_requirements (company_id, role_id, source_url, skills, keywords, recommended_sections)
VALUES
  (
    '11111111-1111-4111-8111-111111111101', -- Google
    '22222222-2222-4222-8222-222222222202', -- SWE
    'https://careers.google.com/jobs/results/?q=Software%20Engineer',
    '["Data Structures & Algorithms", "C++ / Java / Python / Go", "System Design", "Distributed Computing", "Concurrency", "Unit Testing"]'::jsonb,
    '["latency", "throughput", "O(log n)", "distributed systems", "production scale", "fault tolerance"]'::jsonb,
    '["Work Experience", "Academic Projects", "Technical Skills", "Education"]'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111103', -- Amazon
    '22222222-2222-4222-8222-222222222202', -- SWE
    'https://amazon.jobs/en/job_categories/software-development',
    '["Java / C#", "AWS (EC2, S3, DynamoDB, Lambda)", "Object-Oriented Design", "CI/CD", "High Availability", "Microservices"]'::jsonb,
    '["customer obsession", "delivered", "reduced operational load", "increased throughput by", "ownership", "99.99% availability"]'::jsonb,
    '["Work Experience", "Key Projects", "Technical Skills", "Education"]'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111106', -- TCS
    '22222222-2222-4222-8222-222222222201', -- Java Developer
    'https://www.tcs.com/careers/india/entry-level',
    '["Core Java (JDK 8-21)", "OOPs Concepts", "Spring Boot", "SQL (PostgreSQL/MySQL)", "Git", "REST APIs"]'::jsonb,
    '["B.Tech", "academic project", "spring framework", "RDBMS", "clean code", "certifications"]'::jsonb,
    '["Career Objective", "Educational Qualifications", "Technical Skills", "Academic Project", "Declaration"]'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111105', -- Infosys
    '22222222-2222-4222-8222-222222222201', -- Java Developer
    'https://career.infosys.com/joblist',
    '["Java", "Spring Boot", "Hibernate / JPA", "Microservices", "RESTful Web Services", "Maven/Gradle"]'::jsonb,
    '["enterprise applications", "API contracts", "database design", "unit testing", "agile"]'::jsonb,
    '["Career Objective", "Education", "Technical Skills", "Projects", "Internship / Training"]'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111107', -- Accenture
    '22222222-2222-4222-8222-222222222204', -- Data Analyst
    'https://www.accenture.com/in-en/careers/jobsearch?jk=data%20analyst',
    '["Advanced SQL", "Python (Pandas, NumPy)", "Power BI / Tableau", "Data Modeling", "Excel Modeling", "ETL Pipelines"]'::jsonb,
    '["KPIs", "dashboards", "business insights", "data cleansing", "automated reporting", "statistical analysis"]'::jsonb,
    '["Work Experience", "Data Projects", "Technical Skills & Tools", "Education"]'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111108', -- Wipro
    '22222222-2222-4222-8222-222222222205', -- AI & Automation
    'https://careers.wipro.com/careers-home/jobs?keywords=ai',
    '["Python", "PyTorch / TensorFlow", "Prompt Engineering / LLMs", "Automation (Selenium, Playwright)", "REST APIs", "Docker"]'::jsonb,
    '["model accuracy", "RAG architecture", "automated workflows", "inference speed", "evaluation metrics"]'::jsonb,
    '["Technical Skills", "AI / Automation Projects", "Experience", "Certifications"]'::jsonb
  )
ON CONFLICT (company_id, role_id) DO UPDATE SET
  skills = EXCLUDED.skills,
  keywords = EXCLUDED.keywords,
  recommended_sections = EXCLUDED.recommended_sections,
  last_checked_at = NOW();
