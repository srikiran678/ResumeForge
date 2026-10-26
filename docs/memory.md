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
3. **Template Engine:** 11 vetted ATS single-column templates (`Classic`, `Modern`, `Compact`, `Academic`, `Hackathon`, `Technical`, `Executive`, `Creative`, `Elegant`, `Minimal`, `ClassicResume`).
4. **Company-Wise Template Library:** Directory of verified employer formats with role and level filters (`/templates`).
5. **Real-time ATS & Quality Verification:** 0–100 score; AST `#01..#0N` reading order check; terminal-style raw text stream; recruiter 6-second scan heatmap simulator.
6. **Honest AI Writing Tools:** Action verb bullet improver; Google XYZ formula builder; job description match analyzer; BYOK custom LLM key modal.
7. **Job Application Tracker:** Kanban & table views; immutable submitted resume snapshots.
8. **Public Sharing & Portfolio:** Shareable `/r/:slug` links with privacy controls; student portfolio website (`/portfolio`) with QR code.
9. **Full Workspace Backup:** Complete JSON export and import (`exportAllData` / `importAllData`).

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
