# E2E Test Infra: ResumeForge Production Deployment & Verification

## Test Philosophy
- **Opaque-box, requirement-driven**: Derived directly from `ORIGINAL_REQUEST.md` (R1-R5) and user acceptance criteria, exercising the application as an end-user and auditing infrastructure via live queries.
- **Methodology**: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing.

## Test Architecture
- **Runner**: Node.js automated test runner using `puppeteer-core` connected to local Google Chrome (`C:/Program Files/Google/Chrome/Application/chrome.exe`) and direct PostgreSQL database client (`pg.Client`).
- **Target URL**: Production preview server `http://localhost:4173`.
- **Database Target**: `postgresql://postgres:***@vdkvb6uy.ap-southeast.database.insforge.app:5432/insforge?sslmode=require`.
- **Pass/Fail Semantics**: Process exits with code 0 if and only if all assertions pass with 0 unhandled rejections.

## Feature Inventory & Test Coverage Mapping
| # | Feature | Requirement | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Real-World) |
|---|---------|-------------|:----------------:|:-----------------:|:----------------------:|:-------------------:|
| 1 | InsForge DB Sync | R1 | 5 tests | 5 tests | ✓ | ✓ |
| 2 | RLS Multi-Tenant Isolation | R1 | 5 tests | 5 tests | ✓ | ✓ |
| 3 | Core Tables Persistence | R1 | 5 tests | 5 tests | ✓ | ✓ |
| 4 | Secret Isolation & Guardrails | R5 | 5 tests | 5 tests | ✓ | ✓ |
| 5 | Google OAuth PKCE Flow | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 6 | Protected Routes Redirection | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 7 | Public Routes Accessibility | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 8 | OAuth Error Banner & Clean URL | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 9 | Single-Column ATS Layout | R3 | 5 tests | 5 tests | ✓ | ✓ |
| 10 | AST Inspector #01..#0N Indices | R3 | 5 tests | 5 tests | ✓ | ✓ |
| 11 | Bullet Impact Telemetry | R3 | 5 tests | 5 tests | ✓ | ✓ |
| 12 | Live Preview & Debounced Autosave | R3 | 5 tests | 5 tests | ✓ | ✓ |
| 13 | Selectable Text PDF Export | R3 | 5 tests | 5 tests | ✓ | ✓ |
| 14 | Master Profile Management | R4 | 5 tests | 5 tests | ✓ | ✓ |
| 15 | Resume Tailoring & Snapshots | R4 | 5 tests | 5 tests | ✓ | ✓ |

## Test Tier Structure
- **Tier 1: Feature Coverage (≥75 tests total, ≥5 per feature)**:
  - Happy-path verification of each feature in isolation (e.g. route loading, OAuth trigger, database table existence, template rendering).
- **Tier 2: Boundary & Corner Cases (≥75 tests total, ≥5 per feature)**:
  - Negative tests, invalid query parameters (`?error=access_denied`, malformed slugs), empty inputs, extreme zoom levels (0.5x, 1.5x clamping), unauthenticated DB access rejections.
- **Tier 3: Cross-Feature Combinations (≥15 pairwise tests)**:
  - Master Profile -> Tailored Resume creation -> Editor modifications -> Live preview update -> Application snapshot creation -> DB persistence.
  - OAuth error handling -> Navigation to public resume -> Unauthenticated route guard redirection.
- **Tier 4: Real-World Application Scenarios (≥8 comprehensive workflows)**:
  - S1: Student onboarding, profile completion, creating tailored SWE resume, checking ATS score.
  - S2: Recruiter ATS inspection, linear reading order verification across all 5 templates.
  - S3: Applying to job, freezing immutable snapshot, modifying master profile without altering snapshot.
  - S4: Public portfolio link sharing and unauthenticated public resume viewing.
  - S5: Multi-tenant database isolation verification with two distinct user accounts.
  - S6: OAuth cancellation simulation, non-blocking banner presentation, and clean address bar state.
  - S7: Full vector PDF download and plain text stream extraction test.
  - S8: Production build verification (`npm run build`), zero asset 404s on preview port 4173.

## Coverage Goals
- Minimum test count: ≥170 automated test assertions across Tiers 1-4.
- 100% pass rate before advancing to Tier 5 adversarial coverage hardening.
