# ResumeForge — UI/UX Design System & Direction

> **Document Version:** 1.0.0  
> **Target Audience:** Engineering, UI/UX Designers, AI Coding Agents  
> **Status:** Active / Source of Truth  
> **Last Updated:** October 2026  

---

## 1. Design Philosophy & Direction

ResumeForge delivers a **modern, clean, distraction-free builder experience** engineered specifically for students and early-career talent. The design balances two core environments:

1. **The Application Workspace:** A sleek, high-contrast, professional SaaS interface with subtle glassmorphic surfaces, crisp hairline borders, accessible typography, and smooth dark/light mode transitions.
2. **The Resume Document Canvas:** An authentic, high-fidelity representation of an A4/US-Letter paper document, adhering strictly to single-column ATS reading order, professional font metrics, and high-density legibility.

### Core Principles
- **Distraction-Free Focus:** The editing workspace minimizes clutter, allowing the user to focus on writing impactful, metric-driven achievements.
- **WYSIWYG Fidelity:** What the student sees in the live preview canvas matches the exported vector PDF down to line breaks, padding, and typographic hierarchy.
- **ATS-First Aesthetics:** Beautiful typography and balanced whitespace without complex tables, graphics, floating textboxes, or multi-column grids that corrupt ATS parsers.
- **Honest Feedback:** Real-time visual telemetry guides students with informative badges (`Draft`, `Add Action Verb`, `Add Numbers`, `Strong Impact`).

---

## 2. Color Palette & Visual Tokens

The color system is defined in [`tailwind.config.js`](file:///C:/project/tailwind.config.js) and [`src/index.css`](file:///C:/project/src/index.css), supporting both light mode and dark mode via class-based switching (`html.dark`).

### 2.1 Color Tokens

| Palette Family | Hex Value / Range | Role & Semantic Meaning |
| :--- | :--- | :--- |
| **Forge (Slate Neutral)** | `#020617` to `#f8fafc` | Primary structural neutrals, background layers, text colors, and borders. |
| `forge-950` | `#020617` | Deep dark mode background, primary high-contrast buttons. |
| `forge-900` | `#0f172a` | Primary dark headings, default dark surface, dark mode borders. |
| `forge-600` / `forge-500` | `#475569` / `#64748b` | Muted subtitles, meta descriptions, placeholder text. |
| `forge-200` / `forge-100` | `#e2e8f0` / `#f1f5f9` | Light mode borders, card backgrounds, hover states. |
| `forge-50` | `#f8fafc` | Default light mode body background. |
| **Brand (Emerald Green)** | `#059669` / `#10b981` | Core brand color, success indicators, high ATS score accents, verified status. |
| `brand-500` | `#10b981` | Action accents, progress bars, ATS score pass pill. |
| `brand-50` / `brand-100` | `#ecfdf5` / `#d1fae5` | Subtle badge backgrounds for ATS pass states. |
| **Accent (Indigo)** | `#4f46e5` / `#6366f1` | Interactive controls, active accordion headers, focus rings, links. |
| `accent-500` / `accent-600`| `#6366f1` / `#4f46e5` | Primary CTA hovers, focus-visible indicators. |
| **Surface (Dark Mode)** | `#121316` / `#08090a` | Deep surface layers: `#08090a` (body), `#121316` (cards), `#1a1b20` (modals). |
| **Status: Amber** | `#f59e0b` / `#d97706` | ATS warning, AI quota warning, missing action verb notice. |
| **Status: Rose / Red** | `#e11d48` / `#be123c` | ATS failure, validation error, destructive delete button. |

### 2.2 Elevation & Shadows
- **Card Subtle:** `shadow-xs` / `shadow-sm` for standard cards and form sections.
- **Modal Elevated:** `shadow-2xl` paired with `backdrop-blur-md` for centered modals (`BulletImproverModal`, `XYZFormulaModal`, `VersionHistoryModal`).
- **Glow Accents:** `shadow-glow-emerald` on ATS score badges; `shadow-glow-indigo` on primary action buttons.
- **Hairline Borders:** `border border-forge-200 dark:border-white/[0.08]` for subtle container delineation.

---

## 3. Typography Hierarchy

### Application UI Typography
- **Primary Sans:** `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Display Headings:** `'Plus Jakarta Sans', 'Inter Tight', 'Inter', sans-serif` (`text-wrap: balance`, tight tracking `-0.02em`)
- **Code & Monospace:** `'JetBrains Mono', 'Fira Code', 'Consolas', monospace` for raw ATS text streams and keyword tags.

| Style Token | Size / Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- |
| `display-lg` | 3.5rem (56px) / 4rem | Extra Bold (800) | Landing page hero titles |
| `headline-lg` | 2.25rem (36px) / 2.75rem | Bold (700) | Page titles (Dashboard, Editor, Analyzer) |
| `headline-md` | 1.5rem (24px) / 2rem | Semi-Bold (600) | Card titles, section headers |
| `headline-sm` | 1.125rem (18px) / 1.5rem | Semi-Bold (600) | Modal headers, accordion group titles |
| `body-lg` | 1rem (16px) / 1.625rem | Normal (400) | Intro descriptions, guides |
| `body-md` | 0.875rem (14px) / 1.375rem | Normal (400) | Standard form inputs, bullet descriptions |
| `body-sm` | 0.75rem (12px) / 1.125rem | Normal (400) | Helper notes, timestamps, tooltips |
| `label-sm` | 0.75rem (12px) / 1rem | Semi-Bold (600) | Form labels, category badges |

---

## 4. Resume Document Design & Template Styles

The resume canvas is rendered within [`LivePreviewCanvas.tsx`](file:///C:/project/src/modules/templates/components/LivePreviewCanvas.tsx) and compiled to PDF via [`ResumePDF.tsx`](file:///C:/project/src/modules/templates/components/ResumePDF.tsx).

### Document Geometry
- **Page Size:** Standard A4 (`210mm x 297mm`) or US-Letter (`8.5in x 11in`).
- **Margins:** 36pt (0.5 inch) to 48pt (0.66 inch) padding for optimal balance between content density and breathing room.
- **Structure:** Strict single-column hierarchy with clean section rules (`border-b border-gray-300`).

### Standard Resume Typographic Pairs
Each template maps to vetted, universally installed font families:

| Template ID | Heading Style | Body Font Family | Aesthetic Profile |
| :--- | :--- | :--- | :--- |
| `classic` | Serif Bold (Georgia / Times) | `Georgia, Cambria, serif` | Traditional, high-placement campus standard |
| `modern` | Clean Sans-Serif | `Inter, system-ui, sans-serif` | Clean, tech-forward, subtle emerald badges |
| `compact` | Ultra-Dense Sans | `Arial, Helvetica, sans-serif` | Space-efficient for dense multi-project profiles |
| `academic` | Classical Serif | `Times New Roman, Times, serif` | Formal, highlights publications and CGPA |
| `hackathon` | Monospace Accents | `Consolas, Courier New, monospace` | Terminal accents, project GitHub badges |
| `technical` | Structured Sans | `Inter, Arial, sans-serif` | Highlights categorized skills and systems |
| `classic-resume` | University Formal | `Georgia, Times New Roman, serif` | Includes formal declaration and student profile |

### Section Layout Rules
- **Name Header:** Centered or left-aligned, 18pt–22pt bold, uppercase.
- **Contact Info Bar:** Plain text string formatted with separators (`email@domain.com | +1 (555) 012-3456 | github.com/user | linkedin.com/in/user`). **No raw graphical icon glyphs** that confuse ATS text scrapers.
- **Section Headings:** 10.5pt–11pt bold uppercase with 0.8pt letter spacing and bottom border rule.
- **Bullet Points:** Clean standard bullet character (`•`), hanging indent, high-density line height (1.35x–1.45x).

---

## 5. Component Interaction Patterns

### 5.1 Form Controls & Accordions
- Sections in the resume editor are organized as collapsible accordions (`basics`, `education`, `work`, `projects`, `skills`, `certificates`, `achievements`, `hackathons`, `volunteering`).
- Reordering is available both via keyboard-friendly arrow buttons (`Move Up`, `Move Down`) and drag handles.
- Toggling the eye icon (`Eye` / `EyeOff`) hides a section from the output without deleting user data.

### 5.2 Real-Time Action Verb Badges
As students type bullet points, heuristic analyzers inspect the string in real time:
- Empty or < 10 characters: `Draft bullet` (gray pill)
- Missing action verb: `💡 Add Action Verb` (amber pill)
- Verb present, no metrics: `💡 Add Numbers` (indigo pill)
- Power verb + metrics detected: `⚡ Strong Impact` (emerald pill)

### 5.3 Buttons & Actions
- **Primary Action:** Solid dark background (`bg-slate-950 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800`), e.g., "Download PDF", "Save Resume".
- **Secondary Action:** Outlined border (`border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200`).
- **Destructive Action:** Subtle red hover (`text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30`).
- **Celebration / Confirmation:** Triggered via `canvas-confetti` upon achieving high ATS score or completing 1-page autofit.

---

## 6. Responsive Layouts & Breakpoints

| Breakpoint | Target Screen | Layout Behavior |
| :--- | :--- | :--- |
| **Desktop (`>= 1024px`)** | Laptops & Monitors | Side-by-side split screen: 50% left editor pane with independent scroll; 50% right sticky live preview canvas with zoom controls (`ZoomIn`, `ZoomOut`, `Fit`). |
| **Tablet (`768px – 1023px`)** | iPads & Tablets | Stacked layout with collapsible editor accordions and floating preview button. |
| **Mobile (`< 768px`)** | Smartphones | Segmented tab control at top of screen toggling between `[ Editor ]` and `[ Preview ]`. Floating bottom bar provides quick access to "Download PDF" and "ATS Score". |

---

## 7. Accessibility (a11y) & Feedback States

### Keyboard Navigation & Focus
- Every interactive element supports full keyboard navigation via `Tab` and `Shift+Tab`.
- Distinct, high-contrast focus rings: `:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }`.
- Global keyboard shortcut command palette (`CommandPalette`) triggered via `Ctrl+K` / `Cmd+K`.

### State Management & Feedback
- **Autosave Pill:** Positioned in editor header reflecting `Saved` (green checkmark), `Saving...` (spinner), or `Unsaved changes` (amber dot).
- **Empty States:** Every list (resumes, projects, applications) includes an illustration/icon, descriptive explanation, and a prominent "Add Item" button.
- **Error Banners:** Clear inline error messages explaining what went wrong with a "Retry" option.
