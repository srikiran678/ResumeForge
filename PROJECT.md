# Project: ResumeForge Production Deployment & Verification

## Architecture
ResumeForge is a production-grade, ATS-first resume builder and career workflow platform for university students.
- **Frontend Framework**: React 19 + TypeScript + Vite + Tailwind CSS + React Router v7.
- **Backend & Database Infrastructure**: Live InsForge PostgreSQL backend (`vdkvb6uy.ap-southeast.database.insforge.app:5432/insforge`) accessed via `@insforge/sdk` PostgREST gateway (`https://vdkvb6uy.ap-southeast.insforge.app/api/database/records`) and direct SSL PostgreSQL connections for database auditing.
- **Authentication**: InsForge Auth with Google OAuth PKCE flow (`insforge.auth.signInWithOAuth`) and session state managed via `AuthContext`.
- **Storage Layer**: `src/lib/storage.ts` providing bidirectional sync between local workspace state and InsForge PostgreSQL tables (`resumes`, `master_profiles`, `applications`, `resume_snapshots`, `ai_usage`, `user_settings`) with multi-tenant Row-Level Security (RLS).
- **ATS & PDF Engine**: Single-column ATS-parseable templates, AST reading order inspector `#01..#0N`, real-time bullet impact telemetry, and `@react-pdf/renderer` vector PDF generation ensuring 100% selectable text in natural reading order.

## Code Layout
- `src/`
  - `components/common/`: Navigation, `ProtectedRoute.tsx`, `CommandPalette.tsx`, `Toast.tsx`.
  - `components/profile/`: Master Profile modules (`PersonalInfoSection`, `EducationSection`, `ExperienceSection`, `ProjectsSection`, `SkillsSection`, `OtherSections`, `CreateResumeModal`).
  - `components/resume/`: ATS canvas components (`ResumeDocument.tsx`, `ResumePDF.tsx`, `ATSInspectorOverlay.tsx`, `BulletImproverModal.tsx`, `templates/`).
  - `context/`: `AuthContext.tsx`, `WorkspaceContext.tsx`.
  - `lib/`: `insforge.ts` (InsForge SDK client & error interceptor), `storage.ts` (storage & DB sync), `atsAnalyzer.ts`, `aiService.ts`.
  - `pages/`: Route page components (`LandingPage`, `LoginPage`, `DashboardPage`, `MasterProfilePage`, `ResumeEditorPage`, `ApplicationsPage`, `PublicResumePage`, `SettingsPage`, etc.).
- `supabase/migrations/`: Authoritative SQL schemas and RLS definitions for the 6 core tables.
- `scratch/`: Verification test scripts (`test_auth_suite.mjs`, `test_rls_isolation.mjs`, `inspect_db.mjs`, `test_client_queries.mjs`, etc.).
- `dist/`: Production Vite build assets.

## Feature Inventory
All features identified during the survey phase from `ORIGINAL_REQUEST.md` and codebase discovery:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | PostgreSQL Database Sync | Connect to live InsForge PostgreSQL backend (`vdkvb6uy.ap-southeast.database.insforge.app:5432`) and sync data via `@insforge/sdk` | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Core Tables Persistence | Persist `resumes`, `master_profiles`, `applications`, `resume_snapshots`, `ai_usage`, `user_settings` matching schema | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Row-Level Security (RLS) | Enforce multi-tenant data isolation via `(auth.uid() = user_id)` on all core tables | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Secret Isolation & Guardrails | Ensure zero database credentials, service role keys, or tokens leak into client bundles; add `.env` to `.gitignore` | M1 | ORIGINAL_REQUEST §R5 |
| 5 | Google OAuth PKCE Flow | Initiate PKCE OAuth handshake via `insforge.auth.signInWithOAuth` directing toward Google Identity Services | M2 | ORIGINAL_REQUEST §R2 |
| 6 | Protected Workspace Routes | Reject unauthenticated access to `/dashboard`, `/editor/:id`, `/profile`, `/settings`, `/applications`, redirecting to `/login` | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Public Route Access | Allow unauthenticated access to `/` and `/r/:slug` without redirects | M2 | ORIGINAL_REQUEST §R2 |
| 8 | OAuth Error Banner & Clean URL | Intercept `?error=access_denied`, display non-blocking alert banner, and clean URL params via `replaceState` | M2 | ORIGINAL_REQUEST §R2 |
| 9 | Single-Column ATS Resume Engine | Enforce single-column AST flow across all 5 templates with zero 2-column fragmentation | M3 | ORIGINAL_REQUEST §R3 |
| 10 | AST Reading Order Inspector | Dynamic overlay visualizer mapping indices `#01..#0N` matching section reading order | M3 | ORIGINAL_REQUEST §R3 |
| 11 | Bullet Impact Telemetry | Real-time analysis of bullet points (power verbs + numeric metrics) | M3 | ORIGINAL_REQUEST §R3 |
| 12 | Editor Autosave & Live Preview | Real-time live preview update with debounced autosave | M3 | ORIGINAL_REQUEST §R3 |
| 13 | Selectable Text Vector Export | PDF export via `@react-pdf/renderer` maintaining natural top-to-bottom reading order (Notepad test) | M3 | ORIGINAL_REQUEST §R3 |
| 14 | Master Profile Management | Seamless addition, modification, and versioning of education, experience, projects, skills, and hackathons | M4 | ORIGINAL_REQUEST §R4 |
| 15 | Resume Tailoring & Snapshotting | Tailor targeted resumes from Master Profile; capture immutable resume snapshots on job application submission | M4 | ORIGINAL_REQUEST §R4 |
| 16 | E2E Testing Suite & Dual Track | Comprehensive automated tests across Tiers 1-4 and Tier 5 adversarial verification | E2E / Final | Orchestrator Plan |

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | InsForge Backend & Database Synchronization | R1, R5: Refactor `storage.ts` to `@insforge/sdk`, align table payloads (`resumes`, `master_profiles`, `applications`, `resume_snapshots`), verify live PostgreSQL & RLS isolation, secure `.gitignore` | None | DONE |
| M2 | Google OAuth & Protected Route Security | R2: Verify Google OAuth PKCE, route guards on all private workspace paths, public links, OAuth cancellation banner & clean URL on `/login` and `/` | M1 | DONE |
| M3 | ATS-Compliant Resume Engine & Export Integrity | R3: Fix `ATSInspectorOverlay.tsx` `#01..#0N` indices, verify single-column templates, bullet telemetry, zoom controls, and vector PDF reading order | M1 | DONE |
| M4 | Master Profile & Application Lifecycle Management | R4: Master Profile CRUD, resume tailoring workflow, immutable application snapshots with audit trail synced to DB | M1, M3 | DONE |
| M5 | E2E Testing & Acceptance Gate | Pass 100% of E2E test suite (Tiers 1-4) and Tier 5 adversarial hardening | M1, M2, M3, M4 | DONE |

## Interface Contracts

### Frontend Storage ↔ InsForge PostgREST API
- **Client**: `insforge.database.from(tableName)` from `src/lib/insforge.ts`
- **Endpoint**: `https://vdkvb6uy.ap-southeast.insforge.app/api/database/records/<table_name>`
- **Authorization**: `Bearer <session_token>` header automatically attached by `@insforge/sdk`
- **Schemas**:
  - `resumes`: `{ id: UUID, user_id: UUID, title: text, template: text, data: JSONB, is_public: boolean, slug: text|null, updated_at: ISO8601 }`
  - `master_profiles`: `{ user_id: UUID, data: JSONB, updated_at: ISO8601 }`
  - `applications`: `{ id: UUID, user_id: UUID, company: text, position: text, job_url: text|null, status: text, applied_date: date|null, follow_up_date: date|null, notes: text|null, resume_id: UUID|null, resume_snapshot: JSONB|null, updated_at: ISO8601 }`
  - `resume_snapshots`: `{ id: UUID, resume_id: UUID, user_id: UUID, version_name: text, note: text|null, data: JSONB, created_at: ISO8601 }`

### UI State ↔ Resume Editor & ATS Inspector
- `ResumeData` object in `WorkspaceContext`:
  - `meta.sectionOrder: string[]` -> defines linear document order
  - `ATSInspectorOverlay` consumes `resume.meta.sectionOrder` and maps each active section to a sequential badge `#01` to `#0N`.
