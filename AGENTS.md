# Agent Instructions — ResumeForge

> **Target Audience:** All AI Coding Agents & Pair Programmers  
> **Rule Level:** Mandatory Enforcement  
> **Status:** Active / Source of Truth  

---

## 1. Mandatory Pre-Flight Protocol

Before making any changes or proposing architectural edits to the ResumeForge codebase, every AI coding agent **MUST** follow this sequence:

1. **Read the Core Documentation:**
   - [`docs/prd.md`](file:///C:/project/docs/prd.md) — Product Requirements Document, core student personas, and acceptance criteria.
   - [`docs/architecture.md`](file:///C:/project/docs/architecture.md) — Technical Architecture, modular domains (`@/modules/*`), routing, and database schema.
   - [`docs/rules.md`](file:///C:/project/docs/rules.md) — Coding Rules, development standards, anti-hallucination guardrails, and secrets hygiene.
   - [`docs/design.md`](file:///C:/project/docs/design.md) — UI/UX Design System, visual tokens, typography, and ATS template specifications.
   - [`docs/tasks.md`](file:///C:/project/docs/tasks.md) — Task Management Matrix and active project progress.
   - [`docs/memory.md`](file:///C:/project/docs/memory.md) — Persistent project context, architectural decisions (ADRs), and known gotchas.

2. **Inspect Current Code & Verify Parity:**
   - Inspect the actual files in the repository to ensure your mental model matches the current codebase.
   - If documentation conflicts with the current code, investigate the discrepancy before making potentially destructive changes.

3. **Identify Files, Dependencies & Risks:**
   - Map out the exact files to modify.
   - Respect the 4 decoupled domain modules (`@/modules/{database, ats, templates, editor}`) and their public barrel exports (`index.ts`).
   - Preserve legacy backward-compatibility re-exports in `src/lib/` and `src/components/resume/`.

4. **Execute Minimal, Surgical Changes:**
   - Make the smallest appropriate implementation that fully satisfies the requirements.
   - Avoid unsolicited refactors, unneeded new dependencies, or rewrites of working features.

5. **Preserve Free Core Features & User Data:**
   - Never introduce paid-only restrictions, watermarks, or paywalls on resume creation, editing, local/cloud saving, or vector PDF downloads.
   - Never drop database tables or columns without versioned migrations.

6. **Verify Implementation:**
   - Run type checks (`npx tsc --noEmit` or `npm run build`).
   - Run linting (`npm run lint`).
   - Run verification scripts where applicable (e.g. `npx tsx --tsconfig ./tsconfig.app.json scratch/verify_modular_architecture.ts`).
   - Never mark a task `Completed` until it has been verified.

7. **Update Documentation & Task Statuses:**
   - Update `docs/tasks.md` and `docs/memory.md` to reflect verified results and recent decisions.

8. **Report Transparently:**
   - Report changed files, verified behavior, test results, and any unresolved questions.

---

## 2. Agent Skills & Tooling

### Issue Tracker
GitHub Issues at `srikiran678/ResumeForge`. See [`docs/agents/issue-tracker.md`](file:///C:/project/docs/agents/issue-tracker.md).

### Domain Docs
Single-context (`GLOSSARY.md` + `docs/adr/`). See [`docs/agents/domain.md`](file:///C:/project/docs/agents/domain.md).
