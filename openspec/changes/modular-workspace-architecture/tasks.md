# Tasks

## 1. Directory Structure Scaffolding

- [ ] 1.1 Create `src/modules/` directories (`database/`, `ats/`, `templates/`, `editor/`) with internal folders (`components/`, `core/`, `hooks/`, `types/`) and empty barrel `index.ts` files, verifying folder structure exists on disk.
- [ ] 1.2 Update TypeScript path aliases or verify relative module resolution, confirming `npx tsc --noEmit` passes.

## 2. Database Services Modularization

- [ ] 2.1 Migrate InsForge client initialization and session error handlers to `src/modules/database/core/insforgeClient.ts` and verify export via `src/modules/database/index.ts`.
- [ ] 2.2 Migrate storage sync and repository methods (`ResumeRepository`, `MasterProfileRepository`, `ApplicationRepository`) to `src/modules/database/repositories/` and verify CRUD queries pass with mock and real data.
- [ ] 2.3 Add backward-compatibility re-exports in `src/lib/storage.ts` and `src/lib/insforge.ts` and verify existing database consumers compile cleanly.

## 3. ATS Analyzer Modularization

- [ ] 3.1 Extract pure ATS calculation functions (`atsEngine.ts`, `readingOrder.ts`, `textExtractor.ts`) into `src/modules/ats/core/` and verify AST `#01..#0N` reading order logic independently of React DOM.
- [ ] 3.2 Move `ATSInspectorOverlay.tsx`, `RecruiterScanSimulator.tsx`, and `TextExtractionViewer.tsx` into `src/modules/ats/components/` and export through `src/modules/ats/index.ts`.
- [ ] 3.3 Add backward-compatibility re-exports in `src/lib/atsAnalyzer.ts` and verify ATS tools page and resume editor compile without type errors.

## 4. Templates & Preview Modularization

- [ ] 4.1 Relocate templates (`ClassicTemplate.tsx`, `ModernTemplate.tsx`, `CompactTemplate.tsx`, `AcademicTemplate.tsx`, `HackathonTemplate.tsx`) to `src/modules/templates/definitions/`.
- [ ] 4.2 Implement `TemplateRegistry` in `src/modules/templates/core/registry.ts` mapping template IDs to standardized template components and verify lookup returns valid component references.
- [ ] 4.3 Move `ResumeDocument.tsx`, `ResumePDF.tsx`, and canvas zoom/pagination controls to `src/modules/templates/components/` and export via `src/modules/templates/index.ts`.
- [ ] 4.4 Add backward-compatibility re-exports in `src/components/resume/` and verify template preview and PDF export compile cleanly.

## 5. Resume Editor Modularization & De-Monolithization

- [ ] 5.1 Extract resume drafting state, section reordering, and autosave management into `src/modules/editor/hooks/useResumeEditor.ts` and verify debounced save events trigger correctly.
- [ ] 5.2 Move section form managers, `SectionManager.tsx`, and modals (`BulletImproverModal.tsx`, `XYZFormulaModal.tsx`, `VersionHistoryModal.tsx`) into `src/modules/editor/components/`.
- [ ] 5.3 Refactor `src/pages/ResumeEditorPage.tsx` into a lightweight orchestrator composing `src/modules/editor`, `src/modules/templates`, and `src/modules/ats` components.
- [ ] 5.4 Export editor components and hooks through `src/modules/editor/index.ts`.

## 6. Verification & Integration

- [ ] 6.1 Update remaining consumer import paths across pages (`src/pages/*.tsx`) to consume public module barrels (`src/modules/*`).
- [ ] 6.2 Execute `npm run build` and verify code compiles with zero TypeScript errors and generates production assets in `dist/`.
- [ ] 6.3 Run verification test scripts in `scratch/` to verify database sync, ATS reading order `#01..#0N`, and PDF export function without errors.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied (`openspec archive modular-workspace-architecture`).
- Verify the archived specifications in `openspec/specs/`.
