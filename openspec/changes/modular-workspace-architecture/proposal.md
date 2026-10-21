# Proposal

## Why

ResumeForge has grown from a single-page prototype into a comprehensive ATS-first resume platform. However, core functionalities currently reside in tightly coupled files: `ResumeEditorPage.tsx` spans nearly 50KB combining form handling, preview rendering, ATS inspection, versioning modals, and persistence logic; template definitions are mixed into general components; ATS scoring logic is scattered across multiple utility files; and database operations are intertwined with component lifecycles.

As features expand (such as additional templates, advanced ATS parsing, and offline-first database synchronization), this tight coupling degrades maintainability, slows testing cycles, and increases the likelihood of cross-feature regressions. Architecting ResumeForge into a modular multi-folder workspace separates distinct concerns—Resume Editor, Template Preview, ATS Analyzer, and Database Services—establishing clean boundaries, standalone interfaces, and independent testability.

## What Changes

- **Workspace Restructuring**: Modularize `src/` into distinct domain modules with clear interface boundaries:
  - `src/modules/editor/`: Houses resume editing state management, section form controllers, drag-and-drop section ordering, and bullet optimization modals.
  - `src/modules/templates/`: Isolates template definitions (Classic, Modern, Compact, Academic, Hackathon), layout components, dynamic zoom/canvas controls, and vector PDF generation.
  - `src/modules/ats/`: Consolidates ATS scoring algorithms, linear AST reading order inspectors (`#01..#0N`), recruiter scan simulator, keyword density checks, and text extraction utilities.
  - `src/modules/database/`: Consolidates InsForge client initialization, PostgreSQL schema types, RLS-bound table queries, and local storage fallback synchronization.
- **Explicit Module Public APIs (`index.ts`)**: Each modular folder exports its public types, hooks, and components through an explicit barrel file (`index.ts`), preventing deep, brittle cross-imports.
- **De-monolithize `ResumeEditorPage.tsx`**: Break the 1,000+ line editor page into composed sub-views consuming editor, preview, and ATS modules via cohesive hooks and clean props contracts.
- **Shared Contracts & Types**: Maintain shared domain entities in `src/types/` while allowing module-specific internal types to remain encapsulated within their respective domains.

## Capabilities

### New Capabilities
- `resume-editor`: Interactive resume editing workspace with modular section controllers, form validation, bullet point refinement, and autosave management.
- `template-preview`: Isolated visual preview engine supporting multi-template layouts, dynamic scaling/zoom controls, and vector PDF export generation.
- `ats-analyzer`: Parsing, linear text extraction AST, ATS scoring heuristics, and recruiter telemetry inspection.
- `database-services`: Data access and persistence gateway encapsulating InsForge SDK operations, PostgreSQL RLS queries, and local workspace fallback synchronization.

### Modified Capabilities
<!-- None: This is the initial capability architecture for ResumeForge in OpenSpec. -->

## Impact

- **Affected Code**:
  - `src/pages/ResumeEditorPage.tsx`: Refactored to act as an orchestrator composing modular components.
  - `src/components/resume/`: Extracted and partitioned into `src/modules/editor/` and `src/modules/templates/`.
  - `src/lib/atsAnalyzer.ts`, `src/lib/qualityAnalyzer.ts`, `src/lib/resumeParser.ts`: Consolidated into `src/modules/ats/`.
  - `src/lib/storage.ts`, `src/lib/insforge.ts`, `src/lib/supabase.ts`: Consolidated into `src/modules/database/`.
- **APIs & Dependencies**: No external breaking API changes. Internal import paths will be updated to point to modular barrel exports.
- **Build & Verification**: Existing tests and build commands (`npm run build`) must continue to pass with zero TypeScript errors.
