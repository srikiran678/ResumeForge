# ResumeForge
> **Write once. Adapt honestly. Apply everywhere.**

ResumeForge is a completely free, ATS-first resume builder and long-term career workspace designed primarily for students, freshers, internship candidates, hackathon participants, and entry-level job seekers.

---

## 🌟 Core Product Principles

### 1. 100% Free Core Functionality
- **Zero Paywalls:** No pay-to-download, no premium PDF export, no watermarks, no forced subscriptions, no pricing pages, and no credit card requirements.
- **Data Freedom:** Full export and import of Master Profiles and resumes in validated JSON at any time.

### 2. ATS-First Engineering
Every resume template is engineered from the ground up for applicant tracking systems:
- **Strict single-column layout:** Prevents multi-column parsing scrambles.
- **Real selectable vector text in PDF:** Uses `@react-pdf/renderer` and print stylesheets. Never `html2canvas`, screenshot-to-PDF, or rasterized images.
- **Standard heading vocabulary:** Summary, Education, Experience, Projects, Skills, Certifications, Achievements, Hackathons, Volunteering.
- **The "Notepad Test" Guarantee:** Download the PDF, select all text (Ctrl+A), paste into Notepad (Ctrl+V), and read every line in natural top-to-bottom reading order.

### 3. Honest Evidence-Based AI
AI assists the user but **never invents information**:
- **Zero Hallucination Rule:** Strictly prohibited from inventing fake companies, job titles, degrees, dates, metrics, percentages, responsibilities, or unverified skills.
- **Evidence Tracking:** Every AI suggestion is traceable to verified user entries in the Master Profile, labeled as `Supported`, `Rephrased`, or `Unsupported`.
- **User Approval:** Every AI change must be accepted or rejected individually by the user.
- **Fair Quota:** 20 calls per day, enforced server-side with character limits (max 20,000 characters).

### 4. Master Career Profile & Application Snapshots
- **Write Once:** Enter education, internships, hackathons, and projects once with stable IDs.
- **Selective Resumes:** Choose specific projects and skills relevant to each job target.
- **Immutable Snapshots:** When an application status changes to **Applied**, ResumeForge automatically preserves an immutable snapshot of the exact resume submitted. Later edits will never alter historical records.

---

## 🚀 Application Routes

| Route | Page & Purpose |
|---|---|
| `/` | **Landing Page** — Product philosophy, ATS comparison showcase |
| `/login` | **Authentication** — Sign in, Sign up, and 1-Click Instant Student Demo |
| `/dashboard` | **Career Workspace Dashboard** — Profile completeness meter, recent resumes, upcoming deadlines, AI usage |
| `/profile` | **Master Career Profile** — Central source of truth across 11 verified categories |
| `/resumes` | **Resume Manager** — Active, Archived, and Trash states with duplication and versioning |
| `/editor/:id` | **Resume Editor** — Live preview, 800ms debounced autosave, section reordering/hiding, inline bullet improver |
| `/analyzer/:id` | **Resume Analyzer** — Deterministic ATS score (Parsing, Structure, Contact Info, Formatting, Sections), quality checks, and Notepad text extraction |
| `/applications` | **Application Tracker** — Kanban board & table views, status pipeline, auto-snapshots |
| `/applications/:id` | **Application Details** — Interview timeline, compensation, recruiter contact, snapshot inspection |
| `/ai` | **AI Tools** — Job description keyword extractor, honest match score (Strong/Partial/Gaps), and controlled tailoring |
| `/portfolio` | **Portfolio Builder** — Generates public web portfolio from Master Profile with theme selection & QR code |
| `/r/:slug` | **Public Resume** — Read-only non-sequential link (e.g. `/r/a8F4k29Lm`) with revoke controls |
| `/settings` | **Privacy Center** — Data ownership, export all data, import JSON, privacy disclosures, delete account |

---

## 🎨 5 ATS-Safe Single-Column Templates

1. **Classic:** Minimal ATS-focused design with horizontal rules and traditional typography.
2. **Compact:** Dense layout designed to fit extensive technical projects and skills onto exactly 1 page.
3. **Modern:** Clean hierarchy with restrained contemporary accents and subtle section dividers.
4. **Academic:** Formal layout emphasizing institutions, degrees, GPA, coursework, and laboratory research.
5. **Hackathon:** Monospace code accents highlighting technical badges, GitHub repositories, and competition awards.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **PDF Generation:** `@react-pdf/renderer` (pure text vector generation) & CSS `@media print`
- **Backend / Database:** Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **AI Processing:** Supabase Edge Function proxy calling Claude API (`AI_MODEL`) with server-side rate limits

---

## 💻 Quick Start & Development

### 1. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start local development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```

---

## 🔒 Supabase Setup (Optional)
The application runs out of the box with complete local storage demo data. To connect your remote Supabase project:

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Copy SQL from `supabase/schema.sql` into the Supabase SQL Editor and run it.
3. Add your project credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Deploy the Edge Function in `supabase/functions/claude-ai/` with your `ANTHROPIC_API_KEY` and `AI_MODEL`.

---

## 📜 The Golden Rule

> When there is a conflict between making the resume sound impressive and keeping it truthful: **Truth wins.**
>
> When there is a conflict between adding a flashy feature and maintaining ATS compatibility: **ATS compatibility wins.**
>
> When there is a conflict between convenience and user control: **User control wins.**
>
> When there is a conflict between AI automation and user approval: **User approval wins.**
