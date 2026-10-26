# ResumeForge — Coding Rules & Development Standards

> **Document Version:** 1.0.0  
> **Target Audience:** Engineering, AI Coding Agents, Code Reviewers  
> **Status:** Mandatory Enforcement  
> **Last Updated:** October 2026  

---

## 1. Core Principles

All engineers and AI coding agents modifying ResumeForge must strictly adhere to the standards outlined in this document. These rules ensure high code quality, preserve user data integrity, guarantee ATS compliance, and maintain the free-for-students mission of ResumeForge.

---

## 2. Investigation Before Modification

1. **Inspect Before Editing:**
   - Always read and analyze the existing file and its imports before proposing edits.
   - Cross-reference with [`docs/architecture.md`](file:///C:/project/docs/architecture.md) and [`docs/memory.md`](file:///C:/project/docs/memory.md) to understand current patterns.
2. **Never Assume Architecture:**
   - Verify frameworks, database tables, and API structures directly from codebase files rather than hallucinating conventions from other projects.
3. **Preserve Working Functionality:**
   - Do not perform broad, unsolicited refactors or architectural rewrites. Make the smallest surgical change required to fulfill requirements.

---

## 3. Component & Code Organization Standards

1. **Modular Domain Consumption:**
   - Code must respect the four decoupled domain modules:
     - `@/modules/database` for client initialization, sync, and repositories.
     - `@/modules/ats` for pure ATS calculation, text extraction, and ATS inspector components.
     - `@/modules/templates` for template definitions, registry lookup, and PDF export.
     - `@/modules/editor` for editing hooks (`useResumeEditor`), form management, and modals.
   - Always import from module barrels (e.g. `import { downloadResumePDF } from '@/modules/templates'`) rather than reaching into deep internal subdirectories.
2. **Backward-Compatibility Preservation:**
   - Legacy import locations (such as `src/lib/storage.ts`, `src/lib/insforge.ts`, `src/lib/atsAnalyzer.ts`, `src/components/resume/ResumeDocument.tsx`) re-export from the new modular structure. **Never delete these re-exports** as existing consumers across the application rely on them.
3. **Focused, Single-Responsibility Components:**
   - Keep page orchestrators thin and declarative (under 500 lines). Extract complex forms, modals, and preview panes into dedicated component files.
4. **Reuse Existing UI Primitives:**
   - Use components from `src/components/common/` (`Navbar`, `Footer`, `CommandPalette`, `ProtectedRoute`, `Toast`, `AIPrivacyModal`) rather than re-implementing ad-hoc equivalents.
   - Use `lucide-react` icons and `framer-motion` for transitions. Avoid adding redundant icon or animation libraries.

---

## 4. TypeScript & Typing Standards

1. **Strict Type Safety:**
   - Write strict TypeScript code without bypassing types.
   - **Do not use `any`** when canonical domain types exist in `src/data/types/` (`ResumeData`, `MasterProfile`, `JobApplication`, `ATSAnalysisResult`, `CompanyTemplate`, etc.).
2. **Defensive Data Handling:**
   - Always guard array operations with `Array.isArray(x) ? x : []`.
   - Use optional chaining (`?.`) and nullish coalescing (`??`) for user-provided resume strings and optional metadata.
3. **Compilation Verification:**
   - Always verify that `npx tsc --noEmit` and `npm run build` (`tsc -b && vite build`) compile with **zero errors**.

---

## 5. Security & Secrets Hygiene

1. **Zero Hardcoded Secrets:**
   - Never commit or hardcode API keys, service role secrets, database passwords, or JWT tokens in source code.
2. **Client vs Server Secrets Boundary:**
   - Only variables prefixed with `VITE_` (`VITE_INSFORGE_URL`, `VITE_INSFORGE_KEY`) may be bundled into client-side code.
   - Privileged administrative secrets (`DATABASE_URL`, `INSFORGE_SERVICE_KEY`) must reside strictly in server-side serverless functions (`api/*`) or backend environments.
3. **User LLM Keys Protection:**
   - User-supplied API keys for Anthropic, OpenAI, or Gemini in `AIChatWidget` must be stored exclusively in client-side `localStorage` (`resumeforge_custom_api_key`) and never sent to ResumeForge backend servers.
4. **Row-Level Security (RLS) & Access Control:**
   - Every database query touching user records must verify the authenticated user ID (`auth.uid() = user_id`).
   - Public resume access must strictly check `access_type IN ('public', 'unlisted')`.

---

## 6. User Experience & UI State Completeness

1. **No Broken or Placeholder Controls:**
   - Never add non-functional buttons, placeholder `onClick={() => {}}` handlers, or empty stub modals.
   - Every interactive control must provide immediate feedback (loading spinner, toast confirmation, modal opening, or state transition).
2. **Handle All Four UI States:**
   - **Loading State:** Show subtle skeleton loaders or branded spinners during asynchronous data fetching.
   - **Empty State:** Display informative empty states with clear calls-to-action (e.g. "No resumes found. Create your first resume to get started!").
   - **Success State:** Provide confirmation via toast notification, autosave badge update, or celebration effect (`canvas-confetti`).
   - **Error State:** Surface actionable, user-friendly error banners or toast alerts without breaking the UI layout.
3. **Mobile Responsiveness:**
   - All layouts must adapt seamlessly across desktop, tablet, and mobile screens.
   - In the resume editor, use tabbed switches between "Editor" and "Preview" on viewports under 1024px.
4. **Accessible Design:**
   - Maintain readable color contrast ratios conforming to WCAG 2.1 AA.
   - Ensure interactive elements are keyboard focusable with visible focus rings (`focus:ring-2 focus:ring-slate-900 dark:focus:ring-white`).

---

## 7. AI Ethics & Anti-Hallucination Guardrails

1. **Zero Hallucination Guarantee:**
   - AI tools (Bullet Improver, XYZ Formula Assistant, Job Description Tailorer, Career Copilot) must **never** fabricate credentials, employers, degrees, GPA/grades, dates, or tools.
   - AI suggestions must refine the *presentation* of real achievements, never invent the *substance*.
2. **Evidence Tracing:**
   - Bullet improvements must show their source context and explain the rationale for wording enhancements.
3. **Explicit Consent & Quota Enforcement:**
   - Always verify that the user has accepted the AI Privacy Notice via `StorageService.hasAcceptedAIPrivacy()` before sending any text to AI services.
   - Honor the daily call limit (20 calls/day), resetting at midnight, with clear countdown indicators in the UI.

---

## 8. Free Core Mission Pledge

1. **No Paywalls or Hidden Charges:**
   - Core resume creation, section editing, unlimited local saving, cloud synchronization, and vector PDF downloading must remain 100% free.
   - Never implement paywalls, feature gates, watermark injections, or export limits on core resume features.
2. **Genuine Vector PDFs:**
   - PDFs must be generated using `@react-pdf/renderer` with selectable, searchable text. Never substitute screenshot-to-image canvas conversions for standard resume exports.

---

## 9. Database Migrations & Data Safety

1. **Versioned SQL Migrations:**
   - Schema modifications must be written as timestamped migration files under `supabase/migrations/` (format: `YYYYMMDDHHMMSS_name.sql`).
2. **Never Drop Data:**
   - Never execute `DROP TABLE`, `DROP COLUMN`, or `TRUNCATE` against production schemas without explicit confirmation.
   - Write non-destructive additions (`ALTER TABLE ADD COLUMN IF NOT EXISTS`) with safe defaults.
3. **Dual-Tier State Integrity:**
   - When modifying data structures, ensure both `LocalStorage` serializers and InsForge PostgreSQL schema mappings remain synchronized.

---

## 10. Verification & Release Protocol

Before declaring any change or task complete:

1. **Lint Check:** Run `npm run lint` (`oxlint`) and resolve all warnings and errors.
2. **Type Check & Build:** Run `npm run build` (`tsc -b && vite build`) to confirm full TypeScript type safety and successful bundling.
3. **Modular Test Verification:** If touching database repositories, ATS calculation, or templates, run `npx tsx --tsconfig ./tsconfig.app.json scratch/verify_modular_architecture.ts`.
4. **Documentation Updates:** When modifying architecture, APIs, or data models, immediately update `docs/architecture.md`, `docs/tasks.md`, and `docs/memory.md`.
