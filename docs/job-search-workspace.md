# Job Search workspace

ResumeForge's protected `/jobs` route adapts the workflow ideas in [ai-job-search](https://github.com/ai-job-search-dev/ai-job-search) to ResumeForge's existing career profile, honest AI analyzer and application tracker.

## Included in this integration

- Search shortcuts for Google Jobs, LinkedIn Jobs, Indeed India and Wellfound, using the entered role and location.
- A job opportunity form for company, role, location, original posting URL and job description.
- Optional association with an existing ResumeForge resume.
- Saving opportunities into the existing Application Tracker with the initial `Interested` status.
- Direct handoff to the existing Honest AI Analyzer to evaluate a pasted job description against verified resume evidence.

## Intentional boundaries

- Search results open on their original job-board websites. This feature does not scrape job boards, bypass access controls or claim to provide a complete live jobs API.
- It does not auto-submit applications, contact recruiters or send messages.
- Users choose which job descriptions to save and which resume to associate.
- Existing ATS-safe, single-column resume output remains unchanged.
- The existing evidence-first AI rules remain authoritative: do not invent employers, titles, dates, degrees, metrics, skills or experience; review suggestions before accepting them.
- The opportunity form saves the job description in the application's existing notes field. Do not paste sensitive personal data or confidential employer information.

## Route

The Job Search page is available to authenticated users at `/jobs` and is linked from the main navigation. Saved opportunities appear in the existing `/applications` tracker.

This is a ResumeForge-native adaptation of the referenced local Claude Code workflow, not a bundled Claude Code runtime or hosted job-search API.
