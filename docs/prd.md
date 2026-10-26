# ResumeForge — Product Requirements Document (PRD)

> **Document Version:** 1.0.0  
> **Target Audience:** Engineering, AI Coding Agents, Design, Product  
> **Status:** Active / Source of Truth  
> **Last Updated:** October 2026  

---

## 1. Product Overview & Vision

**ResumeForge** is a 100% free, privacy-first, online career workspace and resume builder engineered specifically for students, freshers, internship seekers, campus placement candidates, and hackathon participants.

Most commercial resume builders lure students with "free templates" only to lock the final PDF export behind sudden paywalls or inject intrusive watermarks. ResumeForge fundamentally rejects this model. It provides university students and early-career engineers with enterprise-grade ATS compatibility, honest AI-assisted bullet writing, job description tailoring, application tracking, and real vector PDF generation—completely free, forever.

### Core Value Proposition
- **100% Free Core Workflow:** Creating, editing, autosaving, cloud syncing, and exporting high-resolution vector PDFs will never require a paid subscription.
- **ATS Compliant by Default:** Single-column layouts, standard hierarchical headings, clean typography, and zero image-based text artifacts ensure 95%+ parser readiness across Workday, Taleo, Greenhouse, and Lever.
- **Honest AI Career Copilot:** AI suggestions never hallucinate degrees, dates, company names, or metrics. Every suggestion is anchored directly to the student's verified Master Career Profile.
- **Single Source of Truth:** Students maintain a comprehensive Master Profile of all academic projects, hackathons, coursework, and internships, generating targeted, tailored one-page resumes in seconds.
- **Full Data Ownership:** Local-first storage with optional cloud sync, complete JSON import/export, and zero third-party data monetization.

---

## 2. Target Personas & Use Cases

### Primary Personas
1. **The Campus Placement Candidate (Undergraduate Fresher):**
   - *Needs:* A rigorous, standard 1-page resume highlighting CGPA, coursework, academic projects, technical skills, and college leadership.
   - *Pain Point:* Confusing formats, lack of work experience, ATS rejection due to fancy multi-column graphics.
2. **The Hackathon / Project Builder:**
   - *Needs:* Highlighting hackathon placements, GitHub links, live demo URLs, tech stack tags, and rapid iteration.
   - *Pain Point:* Traditional templates bury technical projects and hackathons under standard corporate experience sections.
3. **The Internship Applicant:**
   - *Needs:* Tailoring a base resume to match specific job descriptions (e.g., Backend vs Frontend) and tracking application statuses.
   - *Pain Point:* Losing track of which version was submitted to which company.

---

## 3. Product Principles & Non-Negotiable Requirements

1. **Free Forever Core:**
   - Resume creation, section editing, local/cloud persistence, and searchable PDF downloads must remain 100% free. No paywalls, no trial limits, no watermark penalties.
2. **Strict ATS Readability:**
   - Templates must use a single-column document flow with standard section names (`Education`, `Experience`, `Projects`, `Skills`, `Certifications`, `Achievements`, `Hackathons`, `Volunteering`).
   - All contact details (email, phone, LinkedIn, GitHub) must be rendered as selectable, copy-pasteable plain text—never concealed behind icons or SVG glyphs alone.
3. **Searchable Vector PDFs (No Image Canvas Hacks):**
   - PDFs must be generated as genuine vector documents using `@react-pdf/renderer` with embedded fonts and selectable text streams. Image screenshots (`html2canvas`) are strictly prohibited for primary downloads.
4. **Zero-Hallucination AI Safeguard:**
   - AI tools (Bullet Improver, XYZ Formula Assistant, Job Description Tailorer) may only refine phrasing, improve action verbs, and highlight genuine skill matches.
   - AI must **never** invent employment history, degrees, grades, dates, tools, or fabricated metrics.
5. **Data Portability & Resilience:**
   - Users must be able to export and import their full data as JSON at any time.
   - The app must function offline or in guest mode using `localStorage` without mandating an immediate login.

---

## 4. Feature Specifications & Acceptance Criteria

### 4.1 Master Career Profile (Single Source of Truth)
- **Description:** A centralized profile capturing the student's complete academic, personal, and professional history without space constraints.
- **Sections:**
  - Personal Information (Full name, title/label, email, phone, location, website, LinkedIn, GitHub, portfolio).
  - Education (Institution, degree, field of study, start/end dates, CGPA/percentage, coursework, board/university).
  - Experience / Internships (Company, role, location, dates, current flag, tech stack, bullet responsibilities).
  - Projects (Name, description, live URL, GitHub URL, tech stack, bullet highlights, dates).
  - Skills (Categorized: Languages, Frameworks, Developer Tools, Databases, Core Competencies).
  - Certifications (Name, issuing organization, issue date, credential URL).
  - Achievements & Honors (Title, organization, date, description).
  - Hackathons & Competitions (Name, organizer, project title, role, achievement/prize, tech stack, links).
  - Volunteering & Leadership (Organization, role, dates, bullet contributions).
  - Extended Fields: Career Objective, Strengths, Extra-curricular Activities, Formal Declaration with signature block.
- **Acceptance Criteria:**
  - [x] Adding/editing/deleting entries immediately updates the local state and triggers cloud sync for authenticated users.
  - [x] Profiles can be exported as a standalone JSON file and re-imported cleanly.
  - [x] "Create Resume from Profile" wizard allows cherry-picking specific items for a targeted 1-page resume.

### 4.2 Multi-Resume Management & Workspace Dashboard
- **Description:** Workspace for creating, organizing, duplicating, and archiving multiple targeted resumes.
- **Features:**
  - Active resumes list with target role, target company, last modified timestamp, and live ATS readiness score.
  - Duplicate, archive, move to trash, and restore capabilities.
  - Quick action to auto-fit resume to exactly 1 page (adjusting spacing, font size, and layout).
- **Acceptance Criteria:**
  - [x] Deleting a resume moves it to a recoverable Trash state before permanent deletion.
  - [x] Duplicating a resume clones all sections, metadata, and custom orders with a unique ID.
  - [x] Autosave indicators (`saved`, `saving`, `unsaved`, `error`) reflect real-time persistence.

### 4.3 Modular Resume Editor & Section Manager
- **Description:** Interactive, distraction-free editing interface with side-by-side live preview.
- **Features:**
  - Accordion section manager supporting drag-and-drop or button-based reordering (`#01..#0N`).
  - Section visibility toggling (hide sections without losing entered data).
  - Inline action verb telemetry on bullet points (`Draft`, `Add Action Verb`, `Add Numbers`, `Strong Impact`).
  - One-click modals for **Bullet Improver** and **Google XYZ Formula** (`Accomplished [X] as measured by [Y], by doing [Z]`).
  - Resume version snapshots: save named checkpoints and roll back anytime.
  - Font family switch (`Inter`, `Arial`, `Times New Roman`, `Georgia`, `Consolas`) and font size / spacing presets (`compact`, `normal`, `relaxed`).
- **Acceptance Criteria:**
  - [x] Reordering sections in the editor immediately updates the visual order in both live preview and exported PDF.
  - [x] Bullet inputs provide real-time heuristic feedback for verbs and quantifiable metrics.
  - [x] Snapshot engine tracks version history with restore capabilities.

### 4.4 ATS Compatibility & Reading Order Verification Engine
- **Description:** Dedicated analyzer simulating how parsing robots and recruiter ATS systems interpret the document.
- **Features:**
  - Overall ATS Compatibility Score (0–100) calculated from parsing, structure, contact info, formatting, and section rules.
  - AST Reading Order calculation (`#01..#0N`) ensuring strictly sequential reading from header to footer.
  - Raw Text Stream Extractor: displays exactly what ATS parsers copy-paste from the resume.
  - Recruiter 6-Second Scan Simulator: visual blur and gaze heatmap highlighting first-glance elements.
  - Quality Analyzer: detects weak action verbs, vague passive phrases, date formatting mismatches, and duplicate skills.
- **Acceptance Criteria:**
  - [x] Two-column or non-standard structures flag explicit warnings with actionable fixes.
  - [x] Raw text stream exposes any missing or corrupted text in the terminal-style viewer.
  - [x] Verification checks categorize issues into `PASS`, `WARNING`, and `FAIL`.

### 4.5 Template Engine & Library
- **Description:** Collection of battle-tested, ATS-friendly templates styled for clarity and scannability.
- **Core Standard Templates (11 Available):**
  1. `Classic`: Traditional serif style, horizontal rule dividers, ideal for campus placements.
  2. `Modern`: Clean sans-serif with subtle emerald accents, great for software engineers.
  3. `Compact`: High-density layout engineered for dense multi-project technical resumes.
  4. `Academic`: Emphasizes education, research publications, CGPA, and coursework.
  5. `Hackathon`: Monospace tech tags, highlighted project repositories, and competition wins.
  6. `Technical`: Prominent developer tools and systems architecture categories.
  7. `Executive`: Balanced typography for team leads and experienced applicants.
  8. `Creative`: Tasteful modern accents without violating ATS single-column rules.
  9. `Elegant`: Subtle layout refinement suitable for design engineering and product management.
  10. `Minimal`: Zero-distraction typography focusing purely on content density.
  11. `ClassicResume`: Comprehensive university template with declaration, strengths, and academic board details.
- **Company-Wise Curated Template Library:**
  - Public directory (`/templates`) categorizing templates verified for top tech firms (Google, Microsoft, Amazon, Infosys, TCS, etc.).
- **Acceptance Criteria:**
  - [x] Switching templates preserves 100% of the resume content and section order.
  - [x] Every template renders equivalently in both React DOM preview and `@react-pdf/renderer` PDF.

### 4.6 Searchable Vector PDF Export
- **Description:** Client-side generation of lightweight, searchable, high-DPI vector PDFs.
- **Implementation:** Built using `@react-pdf/renderer` (`ResumePDFDocument`).
- **Acceptance Criteria:**
  - [x] The exported PDF contains selectable text (user can highlight and copy text in Acrobat or Chrome PDF reader).
  - [x] Clicking "Download PDF" generates the PDF locally as a Blob without server dependency.
  - [x] File name defaults to `[candidate_name]_resume.pdf`.

### 4.7 Honest AI Writing & Tailoring Assistant
- **Description:** Assistant for refining bullet points and matching resumes against job descriptions.
- **Modes:**
  1. **Built-in Deterministic Career Engine:** Instant, zero-cost, zero-hallucination analysis verifying against the user's `MasterProfile`.
  2. **Supabase Edge Function (`claude-ai`):** Optional cloud-powered LLM refinement.
  3. **Custom Bring-Your-Own-Key (BYOK):** Users can enter their own Anthropic Claude, OpenAI, or Google Gemini API key stored securely in `localStorage`.
- **Safeguards:**
  - Strict AI Privacy Modal: Requires explicit user consent before processing resume text.
  - Quota management: Free tier allows up to 20 AI operations per day, resetting at midnight.
  - Evidence tracing: Every suggested bullet must state its source evidence from the user's input.
- **Acceptance Criteria:**
  - [x] If AI privacy is not accepted, AI features refuse execution and trigger the consent modal.
  - [x] Quota exhaustion gracefully disables AI requests with clear countdown messaging.
  - [x] AI never invents dates, institutions, or employment history.

### 4.8 Job Application Tracker & Snapshot Engine
- **Description:** Integrated Kanban and table tracker for managing applications.
- **Stages:** `Interested`, `Preparing`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`.
- **Snapshot Immutability:** When an application status is moved to `Applied`, the exact version of the resume submitted is captured as an immutable JSON snapshot.
- **Acceptance Criteria:**
  - [x] Changing a resume in the editor later never mutates the historical snapshot of an already-applied job.
  - [x] Users can view and inspect the historical submitted resume snapshot at any time.

### 4.9 Public Link & Instant Student Portfolio
- **Description:** Shareable web preview links and portfolio generation.
- **Features:**
  - Slug-based public link (`/r/:slug`) with visibility controls (`public`, `unlisted`, `private`).
  - Student portfolio site (`/portfolio`) rendering projects, skills, and resume with downloadable PDF link and QR code.
- **Acceptance Criteria:**
  - [x] Revoking or privatizing a link immediately blocks public viewer access.
  - [x] Public page includes selectable text and a direct "Download PDF" button.

---

## 5. Non-Functional Requirements

- **Performance:** Initial page load under 1.5s; live preview re-renders within 16ms (60 FPS) on keystrokes using debounced state updates.
- **Security:** Zero private server credentials exposed to client; OAuth tokens handled via standard authorization flow; user keys stored exclusively in browser memory/`localStorage`.
- **Accessibility:** Semantic HTML landmarks, full keyboard navigability, high-contrast text ratios conforming to WCAG 2.1 AA.
- **Responsive Layout:** Adaptive design supporting mobile (<640px) tab switching, tablet (640px–1024px), and desktop (>1024px) split panes.
- **Cross-Browser Support:** Chrome, Firefox, Safari, Edge, and modern mobile browsers.
