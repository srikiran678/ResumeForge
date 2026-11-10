# ResumeForge — Project Memory & Context

> **Document Version:** 1.0.0  
> **Target Audience:** Engineering, AI Coding Agents, Architecture Review  
> **Status:** Active / Source of Truth  
> **Last Updated:** October 2026  

---

## 1. Product Identity & Non-Negotiable Requirements

- **Mission:** ResumeForge is a 100% free, privacy-first career workspace and resume builder engineered for students, freshers, internship applicants, campus placements, and hackathon builders.
- **Non-Negotiables:**
  1. **Free Core Guarantee:** Resume creation, section editing, local/cloud saving, and PDF downloads must remain 100% free forever without paywalls or watermarks.
  2. **Strict ATS Readability:** Single-column layout with standard hierarchical headings. All contact info rendered as copy-pasteable text—never raw icons/images.
  3. **Genuine Vector PDFs:** Exported PDFs must be searchable, high-resolution vector documents generated via `@react-pdf/renderer` (no `html2canvas` raster screenshots).
  4. **Zero-Hallucination AI:** AI tools may only rephrase or refine user-verified achievements. Never fabricate employers, degrees, GPA/grades, dates, tools, or metrics.
  5. **Data Ownership:** Local-first storage with optional InsForge PostgreSQL cloud sync; complete JSON export/import.

---

## 2. Confirmed Technology Stack

| Category | Confirmed Technology | Verified Source |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`react` & `react-dom` v19.3.1) | `package.json` |
| **Language** | TypeScript v6.0.3 (`typescript`, `tsc -b`) | `package.json`, `tsconfig.json` |
| **Build Tooling** | Vite v8.3.4 + Rolldown | `package.json`, `vite.config.ts` |
| **Styling & Theme** | Tailwind CSS v3.4.17 (Class-based dark/light mode) | `tailwind.config.js`, `index.css` |
| **Routing** | React Router DOM v7.18.4 (`react-router-dom`) | `src/App.tsx` |
| **Icons & Motion** | Lucide React (`lucide-react` v1.59) & Framer Motion v14.4 | `package.json` |
| **Vector PDF Engine**| @react-pdf/renderer v4.9.0 | `src/modules/templates/components/ResumePDF.tsx` |
| **Database & Cloud** | InsForge PostgreSQL (`@insforge/sdk` v1.5.2) | `src/modules/database/core/insforgeClient.ts` |
| **Serverless & Edge**| Vercel Serverless (`api/*`) & Supabase Edge Functions | `vercel.json`, `supabase/functions/` |
| **Linter** | Oxlint v1.88.0 (`oxlint`) | `package.json` |

---

## 3. Important Architectural Decisions (ADRs)

### ADR-1: Modular Workspace Domain Partitioning (`@/modules/*`)
- **Decision:** Partitioned monolithic codebase into four decoupled domain modules:
  - `@/modules/database`: InsForge client, session interceptor, repository CRUD.
  - `@/modules/ats`: Pure ATS parsing engine, AST reading order `#01..#0N`, text extractor, and quality engine.
  - `@/modules/templates`: 11 standardized template definitions, dynamic `TemplateRegistry`, vector PDF compilation.
  - `@/modules/editor`: Drafting state hook (`useResumeEditor`), `SectionManager`, `ResumeFormManager`, and modals.
- **Rationale:** Prevents circular dependencies, isolates pure business logic from React DOM, and allows standalone CLI testing (`tsx`).
- **Backward Compatibility:** All previous import paths (`src/lib/storage.ts`, `src/lib/insforge.ts`, `src/lib/atsAnalyzer.ts`, `src/components/resume/ResumeDocument.tsx`) re-export from the new modules.

### ADR-2: Dual-Tier Local-First Persistence
- **Decision:** User state is saved synchronously to browser `LocalStorage` via [`StorageService`](file:///C:/project/src/modules/database/repositories/storageService.ts), then asynchronously debounced and synced to InsForge PostgreSQL for authenticated users.
- **Rationale:** Ensures zero UI latency during typing, complete offline capability, and protection against accidental tab closure.

### ADR-3: Pure Vector PDF Compilation over DOM Screenshots
- **Decision:** Built [`ResumePDF.tsx`](file:///C:/project/src/modules/templates/components/ResumePDF.tsx) using `@react-pdf/renderer` primitives (`<Document>`, `<Page>`, `<Text>`, `<View>`) instead of rendering HTML to `<canvas>`.
- **Rationale:** Guarantees crisp text at any zoom level, small file sizes (<100KB), and 100% selectable text recognized by ATS OCR robots.

### ADR-4: Multi-Tiered AI Architecture with Evidence Tracing
- **Decision:** Primary AI suggestions execute locally through a deterministic rule engine verifying against the user's `MasterProfile`. Optional cloud LLM execution is supported via Supabase Edge Function (`claude-ai`) or client-side BYOK (`resumeforge_custom_api_key`).
- **Rationale:** Completely eliminates AI hallucinations, eliminates recurring API costs for free users, and protects user privacy.

### ADR-5: Route-Level Dynamic Code Splitting and Vendor Chunk Isolation
- **Decision:** Implemented `React.lazy()` route-level code splitting across all 15 page routes in [`App.tsx`](file:///C:/project/src/App.tsx) wrapped in accessible `Suspense` with [`PageLoadingSkeleton`](file:///C:/project/src/components/common/PageLoadingSkeleton.tsx). Configured Vite/Rollup `manualChunks` in [`vite.config.ts`](file:///C:/project/vite.config.ts) to isolate heavy dependencies (`vendor-pdf` for `@react-pdf/renderer`, `vendor-motion`, `vendor-backend`, `vendor-react`).
- **Rationale:** Reduces the initial application entry bundle from **2,327 kB down to 72.8 kB (96.8% reduction)**, dramatically improving First Contentful Paint (FCP) and Time-To-Interactive (TTI) on mobile and low-bandwidth connections. Isolated heavy PDF rendering engines so they only load when users actually view/export resumes.

### ADR-6: AI-Job-Search Framework Integration & Career Suite Architecture
- **Decision:** Translated the advanced methodologies and algorithms from the [`ai-job-search`](https://github.com/ai-job-search-dev/ai-job-search.git) command-line framework into a unified, responsive **Career Suite** web module (`@/modules/careerSuite`):
  1. **Cover Letter Studio (`/cover-letters`)**: 1-page ATS document format, automatic extraction of 3 concrete achievement bullets mapped to target JD requirements, company connection section ("Why this company"), and dual export (ATS vector/print PDF + Markdown).
  2. **Interview Prep & STAR Simulator (`/interview-prep`)**: Dynamic STAR (Situation, Task, Action, Result) answers synthesized strictly from verified candidate projects, tough questions coach with framing strategies, and technical probing concepts.
  3. **Job Match Radar & Pre-scoring Gates (`/job-match`)**: Pre-evaluation Eligibility (citizenship, clearance, work permit) and Language Gates + 5-dimensional scoring model (Technical Skills, Experience, Behavioral Fit, Location Logistics, Career Alignment).

### ADR-7: Accessible Modal Pattern & Elimination of Native Blocking Dialogs
- **Decision:** Replaced all browser-native blocking dialogs (`window.alert()`, `window.confirm()`, and `window.prompt()`) with the accessible obsidian `ConfirmModal` component (`src/components/common/ConfirmModal.tsx`).
- **Rationale:** Native blocking popups disrupt keyboard navigation, break accessible screen reader trees, cannot be styled in dark mode, and can be suppressed by modern browsers causing dead-end flows.

### ADR-8: Multi-Agent QA Audit & Enterprise UX Hardening
- **Decision:** Executed an end-to-end multi-agent audit spanning all 20 routes of ResumeForge, cataloging and resolving 38 functional, edge-case, and accessibility findings (`TEST_REPORT.md`). Added complete archive/restore lifecycle transitions, real-profile fallbacks for portfolios, defensive form input sanitization, and full WCAG keyboard navigation (`role="button"`, `tabIndex={0}`, `onKeyDown` listeners).
- **Rationale:** Ensures that all interactive buttons, filters, forms, and workflows operate reliably without broken state, silent errors, or untracked task progress.
  4. **Salary Intelligence & Benchmark Calculator (`/salary-intel`)**: Percentile compensation distributions across roles, seniority, locations, and company tiers, total compensation calculator, and stage-by-stage negotiation playbooks.
  5. **Skill Gap Analyzer & Upskilling Roadmap (`/upskilling`)**: Missing high-demand skill detection, 4-week sprint roadmap with actionable proof-of-work project blueprints and curated open-source resources.
- **Rationale:** Positions ResumeForge far beyond standard resume editors into an end-to-end career acceleration platform while strictly adhering to local-first zero-hallucination guardrails and free-forever access. All new pages code-split dynamically, maintaining a lightning-fast sub-80kB initial JS bundle.

### ADR-7: Direct Anthropic Claude 3.5 Sonnet Integration with BYOK & Intelligent Account Diagnostic Fallback
- **Decision:** Integrated native Anthropic Claude 3.5 Sonnet client capabilities into `AIChatWidget` and `aiTailoringService` (`improveBullet` and `analyzeJobDescription`):
  1. **Direct Browser Execution:** Configured client requests with `'anthropic-dangerous-direct-browser-access': 'true'`, `'x-api-key'`, and `'anthropic-version': '2023-06-01'`.
  2. **Multi-Source Key Resolution:** Key resolves seamlessly from browser `localStorage` (`resumeforge_custom_api_key`) or gitignored `.env.local` (`VITE_ANTHROPIC_API_KEY`).
  3. **Diagnostic Account Fallback:** When the Anthropic API signals a depleted balance ("credit balance is too low"), the UI displays an informative diagnostic badge and automatically falls back to ResumeForge's deterministic Honest Career Engine, preventing any application freezes or user disruption.
  4. **Secrets Hygiene:** Stored user-provided key exclusively in `.env.local` (ignored in `.gitignore`) and in local browser storage, ensuring 0 secrets committed to public Git repository.
- **Rationale:** Allows students and developers to bring their own Claude models for real-time career guidance without compromising security, paywalling core free features, or leaking tokens.

### ADR-8: Job Search Explorer & Application Funnel Analytics Expansion
- **Decision:** Expanded the Career Suite with two major additions extracted from the `ai-job-search` repository:
  1. **Job Search Explorer (`/jobs`)**: Curated tech roles with real-time ATS match scoring (0–100%) against candidate skills and headline, instant bookmarked jobs in `localStorage`, and 1-click conversion into tracked applications in `/applications`.
  2. **Application Funnel Analytics (`/analytics`)**: End-to-end recruitment funnel tracking, conversion rate benchmarks (Applied -> Interview -> Offer), response lag telemetry, and two-way RFC-4180 CSV export/import with validation.
- **Rationale:** Connects resume preparation with job discovery and pipeline intelligence, equipping candidates with comprehensive feedback to maximize interview callbacks.

### ADR-9: Autonomous Dev Team Audit, Dialog Modernization & Enterprise Parity
- **Decision:** Conducted an exhaustive full-stack review using autonomous engineering agents (`ceo-orchestrator`, `qa-engineer`), executing 7 high-impact enterprise hardening updates:
  1. **Native Dialog Purge:** Eliminated blocking `alert()`, `confirm()`, and `prompt()` browser dialogs; introduced accessible `ConfirmModal.tsx` supporting typed text confirmation (e.g. "DELETE EVERYTHING").
  2. **AI Tailoring Mutation & Persistence:** Connected "Accept Suggestion" in `AIToolsPage.tsx` to directly mutate summary, work, and project highlights in `currentResume` and persist to `localStorage`.
  3. **11 ATS Templates Everywhere:** Expanded `CreateResumeModal.tsx` to render all 11 registered ATS templates with badges and descriptions.
  4. **Master Profile Hydration for Company Templates:** "Use Template" in `CompanyTemplatesPage.tsx` now pre-populates newly created resumes from `masterProfile` rather than presenting blank fields.
  5. **Command Palette Route Fix:** Repaired dead `/analyzer` route to resolve to `/analyzer/:id` and added direct navigation actions for all 7 Career Suite flagship tools.
  6. **Form Validation Hardening:** Enforced `required` and 6-character minimum on signup password in `LoginPage.tsx`.
  7. **Obsidian Dark Mode Visual Parity:** Upgraded `ApplicationDetailPage.tsx` to dark mode (`rgb(17, 18, 24)`), connected all 7 Career Suite tools in `DashboardPage.tsx` and `Footer.tsx`.
- **Rationale:** Guarantees consumer-grade polish, zero headless test breakage, fluid UX, and deep synergy across the application ecosystem.

### ADR-10: Visual Template Previews, Interactive Live Inspection & Mobile Compact Mode
- **Decision:** Architected a high-fidelity visual preview and inspection subsystem for all 11 ATS templates across `TemplateGalleryModal`, `CreateResumeModal`, and `CompanyTemplatesPage`:
  1. **Miniature Visual Thumbnails (`TemplateThumbnail.tsx`)**: Replaced abstract layout icons and blank colored boxes with rendered vector document mini-cards displaying authentic template headers, accent bars, typographic hierarchy, multi-column tables (`classic-resume`), and tag chips (`hackathon`).
  2. **Interactive Live Inspection Modal (`TemplateFullPreviewModal.tsx`)**: Full-screen modal rendering real `TemplateComponent` with continuous zoom (45%–140%), template switcher, and live toggle between standard sample data (`SAMPLE_PREVIEW_RESUME`) and active user resume data.
  3. **Mobile-First Compact View Toggle**: On small screens (smartphones/touch), users can toggle between "Visual Grid" and a high-density "Compact List" (64px mini-thumbnail + name + tags + 1-tap select) to eliminate long vertical scrolling.
- **Rationale:** Greatly reduces friction during template selection on both desktop and mobile viewports, allowing candidates to evaluate real typographic styling and layout density before committing.

---

## 4. Existing Database & Authentication Setup

### Database Tables (PostgreSQL / InsForge)
1. `profiles`: User profile records linked to `auth.users`.
2. `master_profiles`: Central career archive storing all experiences, education, projects, and skills as JSONB.
3. `resumes`: Target-specific resume documents with metadata, section orders, and hidden sections.
4. `resume_versions`: Named snapshot checkpoints supporting rollback.
5. `applications`: Application pipeline tracker with Kanban stages.
6. `resume_snapshots`: Immutable JSON snapshots captured when an application status changes to "Applied".
7. `ai_usage`: Server-side tracking enforcing a 20 calls/day quota.
8. `ai_logs`: Audit trail for AI operations.
9. `public_resume_links`: Unique random slugs (`/r/:slug`) for public and unlisted sharing.
10. `portfolio_profiles`: Student web portfolio configurations (`/portfolio`).
11. `companies`, `roles`, `templates`, `template_companies`, `template_roles`, `template_sources`: Company-wise curated template library.

### Authentication Modes
- **Google OAuth:** Redirect-based flow using InsForge SDK (`insforge.auth.signInWithOAuth`).
- **Email / Password:** Standard password authentication.
- **Guest Fallback:** Local mode with `user_${Date.now()}` session for offline/unauthenticated users.
- **Row-Level Security:** Enforced across all tables via `auth.uid() = user_id`.

---

## 5. Implemented Features Summary

1. **Master Career Profile:** Centralized career archive; cherry-pick items to build targeted resumes; JSON backup/restore.
2. **Resume Editor:** Real-time side-by-side editing; drag/button reordering; eye toggle for section visibility; 1-page autofit with confetti.
3. **Template Engine:** 15 vetted ATS single-column templates (`Classic`, `Modern`, `Compact`, `Academic`, `Hackathon`, `Technical`, `Executive`, `Creative`, `Elegant`, `Minimal`, `ClassicResume`, and 5 high-value standards: `Jake's LaTeX Resume`, `Google SWE ATS`, `Harvard Classic`, `Wall Street IB/PE`, `McKinsey Strategy`).
4. **Company-Wise Template Library:** Directory of verified employer formats with role and level filters (`/templates`).
5. **Real-time ATS & Quality Verification:** 0–100 score; AST `#01..#0N` reading order check; terminal-style raw text stream; recruiter 6-second scan heatmap simulator.
6. **Honest AI Writing Tools:** Action verb bullet improver; Google XYZ formula builder; job description match analyzer; BYOK custom LLM key modal.
7. **Job Application Tracker:** Kanban & table views; immutable submitted resume snapshots.
8. **Public Sharing & Portfolio:** Shareable `/r/:slug` links with privacy controls; student portfolio website (`/portfolio`) with QR code.
9. **Full Workspace Backup:** Complete JSON export and import (`exportAllData` / `importAllData`).
10. **ATS Cover Letter Studio (`/cover-letters`):** Dynamic 1-page ATS cover letters featuring 3 verified achievement bullets, JD keyword alignment, live sheet preview, and PDF/Markdown export.
11. **Interview Prep & STAR Simulator (`/interview-prep`):** Tailored STAR answers mapped from candidate experiences, tough questions coach with deflection strategies, technical probes, and reverse questions.
12. **Job Opportunity Radar & Fit Scorer (`/job-match`):** Qualification gates (Eligibility + Language) and 5-dimensional weighted fit evaluation with actionable gap reports.
13. **Salary Intelligence & Benchmark Calculator (`/salary-intel`):** Market percentiles (P25, Median, P75, P90), total compensation calculator, and stage-by-stage negotiation scripts.
14. **Skill Gap & Upskilling Roadmap (`/upskilling`):** Market demand gap detection, 4-week sprint execution milestones, proof-of-work project blueprints, and curated learning guides.
15. **Live AI Resume Designer Agent (`/editor/:id`):** Natural language live styling and layout agent. Uses hybrid deterministic client-side intent routing for instantaneous execution (<2ms) and 0 API quota consumption, with floating interactive dock and in-memory undo/redo history.
16. **Global UI Development & Review Ecosystem:** Google Elephant-Goldfish Model (EGM) integrated across all projects, accompanied by `taste-skill`, `awesome-design-md` (70+ design systems), `image-to-code`, `web-design-guidelines`, and `playwright-cli`.

---

## 6. Known Gotchas & Integration Constraints

1. **Vite Externalization of Node `crypto`:**
   - The InsForge SDK imports Node `crypto`. Vite / Rolldown externalizes this for browser compatibility during production build with a benign warning. It does not affect browser runtime execution.
2. **TypeScript Path Aliases in CLI:**
   - When executing TypeScript scripts directly with `tsx` (e.g. `scratch/verify_modular_architecture.ts`), pass `--tsconfig ./tsconfig.app.json` so that `@/*` and `@modules/*` resolve properly.
3. **Text Stream Casing in ATS Extractor:**
   - In [`textExtractor.ts`](file:///C:/project/src/modules/ats/core/textExtractor.ts), candidate names are transformed to uppercase (`ADITI RAO`) while project titles preserve user input casing (`Distributed KV Store`).
4. **OAuth Error URL Parameters:**
   - If Google OAuth encounters an error, the callback URL includes `?error=...`. [`AuthContext.tsx`](file:///C:/project/src/context/AuthContext.tsx) traps this into `sessionStorage` and sanitizes the browser URL history immediately on mount.
5. **PDF Blob Download in Chrome:**
   - In [`downloadResumePDF`](file:///C:/project/src/modules/templates/components/ResumePDF.tsx), the created Object URL is explicitly revoked after triggering the anchor click to prevent browser memory leaks.

---

## 7. Important File Paths Directory

| Domain | Canonical File Path | Role |
| :--- | :--- | :--- |
| **App Routing** | [`src/App.tsx`](file:///C:/project/src/App.tsx) | Top-level routing, route definitions, layout containers |
| **Auth Context** | [`src/context/AuthContext.tsx`](file:///C:/project/src/context/AuthContext.tsx) | Google OAuth, session listeners, user state |
| **Workspace Context** | [`src/context/WorkspaceContext.tsx`](file:///C:/project/src/context/WorkspaceContext.tsx) | Central state orchestrator for profile, resumes, apps |
| **Database Module** | [`src/modules/database/index.ts`](file:///C:/project/src/modules/database/index.ts) | Public barrel for database client and repositories |
| **Storage Service** | [`src/modules/database/repositories/storageService.ts`](file:///C:/project/src/modules/database/repositories/storageService.ts) | Dual-tier persistence coordinator (local + cloud) |
| **ATS Module** | [`src/modules/ats/index.ts`](file:///C:/project/src/modules/ats/index.ts) | Public barrel for ATS analyzer and overlays |
| **ATS Engine** | [`src/modules/ats/core/atsEngine.ts`](file:///C:/project/src/modules/ats/core/atsEngine.ts) | Deterministic 10+ rule compliance scorer |
| **Reading Order** | [`src/modules/ats/core/readingOrder.ts`](file:///C:/project/src/modules/ats/core/readingOrder.ts) | AST reading order sequence calculator |
| **Templates Module** | [`src/modules/templates/index.ts`](file:///C:/project/src/modules/templates/index.ts) | Public barrel for templates and PDF generator |
| **Template Registry** | [`src/modules/templates/core/registry.ts`](file:///C:/project/src/modules/templates/core/registry.ts) | Central registry mapping IDs to template components |
| **PDF Generator** | [`src/modules/templates/components/ResumePDF.tsx`](file:///C:/project/src/modules/templates/components/ResumePDF.tsx) | `@react-pdf/renderer` vector PDF compiler |
| **Editor Module** | [`src/modules/editor/index.ts`](file:///C:/project/src/modules/editor/index.ts) | Public barrel for editor hooks and components |
| **Editor Hook** | [`src/modules/editor/hooks/useResumeEditor.ts`](file:///C:/project/src/modules/editor/hooks/useResumeEditor.ts) | Section reordering, dirty state, debounced autosave |
| **Editor Page** | [`src/pages/ResumeEditorPage.tsx`](file:///C:/project/src/pages/ResumeEditorPage.tsx) | De-monolithized editor page orchestrator |
| **Tailoring Service**| [`src/workspace/tailoring/aiTailoringService.ts`](file:///C:/project/src/workspace/tailoring/aiTailoringService.ts) | Honest AI bullet improver and quota tracker |
| **AI Chat Widget** | [`src/components/chat/AIChatWidget.tsx`](file:///C:/project/src/components/chat/AIChatWidget.tsx) | Floating career copilot with BYOK custom key modal |
| **Database Schema** | [`supabase/schema.sql`](file:///C:/project/supabase/schema.sql) | Full PostgreSQL database schema and RLS policies |
| **Tailwind Config** | [`tailwind.config.js`](file:///C:/project/tailwind.config.js) | Design tokens, color palettes, typography scales |
| **Vercel Config** | [`vercel.json`](file:///C:/project/vercel.json) | Production routing rewrites, cache headers, cron jobs |

---

## 8. Recent Changes Log & Next Recommended Actions

### Recent Changes
- **November 2026:**
  - **White Page Elimination & Global Error Boundary Hardening:**
    - Integrated top-level and route-level `ErrorBoundary` in `src/App.tsx` and `src/components/common/ErrorBoundary.tsx` to trap unhandled render exceptions, display informative error banners, and provide recovery actions ("Reload Page", "Go to Dashboard") instead of a blank white screen.
    - Resolved fatal regex syntax crash in `jobFitEngine.ts` and `aiTailoringService.ts` when handling `C++`, `C#`, or `.NET` skills with `safeSkillMatch`.
    - Eliminated destructive guest mode state wipe on reload in `WorkspaceContext.tsx`, preserving local drafts, resumes, and applications.
    - Added safe profile URL guards in `ResumePDF.tsx` preventing null pointer exceptions during vector PDF rendering.
    - Registered 5 new industry-standard templates (Google SWE, Harvard Classic, Jake's Resume, Wall Street, McKinsey) and interactive landing page showcases.
  - **Whole Resume Structure Inspection & Fit-Page Presets:**
    - De-cropped `TemplateThumbnail.tsx` from `max-h-56` down to natural `aspect-[8.5/11]` Letter proportions, rendering all 7 document sections (Header, Objective, Education, Experience, Projects, Skills, Declaration/Certifications) so users can examine the exact layout skeleton at a glance.
    - Updated `TemplateFullPreviewModal.tsx` with dynamic auto-fit calculation (`calculateFitPageScale`), "Fit Whole Page" (55%), "Fit Width", "100%", structure roadmap sub-banner, and live toggle between candidate draft data and complete sample structure.
    - Added "View Whole Resume" inspection button and "Fit" (55%) page scale preset directly into the Live Vector Document toolbar in `ResumeEditorPage.tsx`.
    - Enforced `#ffffff` paper background, `#000000` text, and `color-scheme: light !important` on `.resume-document-container` and `TemplateThumbnail` cards to guarantee authentic white paper presentation across all themes.
  - **Comprehensive Secrets Sanitization & Client Bundle Hardening:**
    - Purged all hardcoded backend instance IDs and anonymous API keys from `src/modules/database/core/insforgeClient.ts` and `api/*.ts` serverless functions.
    - Sanitized documentation and test markdown files (`PROJECT.md`, `TEST_INFRA.md`, `TEST_READY.md`) with generic placeholders (`<project-id>`).
    - Removed `VITE_ANTHROPIC_API_KEY` from `.env.local`, `src/lib/anthropic.ts`, and `src/components/chat/AIChatWidget.tsx` to prevent Vite from baking private API keys into public client-side JavaScript bundles.
    - Verified production build bundle contains 0 private keys or database credentials.
  - Implemented visual template thumbnails (`TemplateThumbnail.tsx`), live full inspection modal (`TemplateFullPreviewModal.tsx`), and mobile-compact view mode in `TemplateGalleryModal.tsx`.
  - Integrated full AI-Job-Search framework capabilities across 7 flagship tools (`/cover-letters`, `/interview-prep`, `/job-match`, `/salary-intel`, `/upskilling`, `/jobs`, `/analytics`).
  - Authored comprehensive QA audit report ([`TEST_REPORT.md`](file:///C:/project/TEST_REPORT.md)) auditing 20/20 routes and categorizing 38 findings.
  - Implemented `ConfirmModal` eliminating native `alert()`, `confirm()`, and `prompt()`.
  - Added full resume archive and restore lifecycle with `toggleArchive` in `WorkspaceContext.tsx`.
  - Enforced input guards, real-time autosync, and error toast feedback across all Career Suite tools.
  - Added full WCAG keyboard navigation (`role="button"`, `tabIndex={0}`, `onKeyDown`) across all landing widgets, job cards, fast-track cards, and accordions.
  - Resolved 100% of high and medium severity audit findings with zero TypeScript and linter errors.
- **October 2026:**
  - Completed OpenSpec change `modular-workspace-architecture`: decoupled `src/` into 4 domain modules (`@/modules/{database, ats, templates, editor}`) with barrel public APIs.
  - Refactored `ResumeEditorPage.tsx` from ~1,900 lines down to a clean, declarative orchestrator.
  - Added session expiration interceptor (`onSessionExpired`) in `insforgeClient.ts`.
  - Executed automated verification test script `scratch/verify_modular_architecture.ts` with 100% pass rate.
  - Built and verified production bundle with `npm run build` (2,699 modules transformed in 4.77s).
  - Authored structured documentation suite (`docs/prd.md`, `docs/architecture.md`, `docs/rules.md`, `docs/design.md`, `docs/tasks.md`, `docs/memory.md`).

### Next Recommended Actions
1. Update root [`AGENTS.md`](file:///C:/project/AGENTS.md) to establish mandatory pre-read protocol for AI coding agents.
2. Archive OpenSpec change `modular-workspace-architecture` via `npx openspec archive modular-workspace-architecture`.
3. Periodically run template discovery cron job or sync community company templates.
