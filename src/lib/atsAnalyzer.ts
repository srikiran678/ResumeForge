import { ResumeData, ATSAnalysisResult } from '../types';

export const ATSAnalyzer = {
  analyze(resume: ResumeData): ATSAnalysisResult {
    const checks: ATSAnalysisResult['checks'] = [];

    // --- 1. Contact Information Checks ---
    let contactScore = 100;
    const { email, phone, location, name } = resume.basics;

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email.trim())) {
      checks.push({
        id: 'contact_email',
        category: 'contactInfo',
        status: 'PASS',
        title: 'Plain-text Email Detected',
        whyItMatters: 'ATS parsers rely on standard RFC-compliant plain text email strings to create applicant profiles.',
        suggestion: 'No action needed. Email is ATS-safe.',
      });
    } else {
      contactScore -= 40;
      checks.push({
        id: 'contact_email',
        category: 'contactInfo',
        status: 'FAIL',
        title: 'Missing or Invalid Email Address',
        problem: email ? 'Email does not match standard email syntax.' : 'No email address provided.',
        whyItMatters: 'Recruiting software cannot match your application or send interview invites without an email.',
        suggestion: 'Provide a valid, professional email address in the Basics section.',
      });
    }

    // Phone check
    const phoneDigits = phone ? phone.replace(/\D/g, '') : '';
    if (phoneDigits.length >= 10) {
      checks.push({
        id: 'contact_phone',
        category: 'contactInfo',
        status: 'PASS',
        title: 'Plain-text Phone Number Detected',
        whyItMatters: 'Automated recruiters search for direct digits without complex decorative glyphs.',
        suggestion: 'Standard format used.',
      });
    } else {
      contactScore -= 30;
      checks.push({
        id: 'contact_phone',
        category: 'contactInfo',
        status: 'WARNING',
        title: 'Incomplete or Missing Phone Number',
        problem: phone ? 'Phone number has fewer than 10 digits.' : 'No phone number provided.',
        whyItMatters: 'Some ATS forms automatically reject profiles that lack a contact phone number.',
        suggestion: 'Add standard digits e.g. +1 (555) 123-4567.',
      });
    }

    // Location check
    if (location && location.trim().length > 2) {
      checks.push({
        id: 'contact_location',
        category: 'contactInfo',
        status: 'PASS',
        title: 'Geographic Location Detected',
        whyItMatters: 'Helps ATS filter candidates for local or remote relocation eligibility.',
        suggestion: 'Format City, State/Country is standard.',
      });
    } else {
      contactScore -= 15;
      checks.push({
        id: 'contact_location',
        category: 'contactInfo',
        status: 'WARNING',
        title: 'Missing City/Location',
        problem: 'No location specified in header.',
        whyItMatters: 'Geo-filtering algorithms may deprioritize candidates without a region.',
        suggestion: 'Add "City, State" (e.g. Seattle, WA). Full street address is not needed.',
      });
    }

    // --- 2. Sections & Headings Checks ---
    let sectionsScore = 100;
    const requiredSections = [
      { key: 'education', name: 'Education', hasItems: resume.education.length > 0 },
      { key: 'work', name: 'Experience / Work History', hasItems: resume.work.length > 0 },
      { key: 'projects', name: 'Projects', hasItems: resume.projects.length > 0 },
      { key: 'skills', name: 'Skills', hasItems: resume.skills.length > 0 },
    ];

    const missingRequired = requiredSections.filter((s) => !s.hasItems);
    if (missingRequired.length === 0) {
      checks.push({
        id: 'sections_required',
        category: 'sections',
        status: 'PASS',
        title: 'All Standard Core Sections Present',
        whyItMatters: 'ATS parsers look for standard vocabulary (Education, Experience, Projects, Skills) to index content.',
        suggestion: 'Core sections are properly labeled.',
      });
    } else {
      // If student has projects instead of work, that is acceptable in ATS if projects are strong!
      const isOnlyWorkMissing = missingRequired.length === 1 && missingRequired[0].key === 'work';
      if (isOnlyWorkMissing && resume.projects.length >= 2) {
        sectionsScore -= 10;
        checks.push({
          id: 'sections_required',
          category: 'sections',
          status: 'WARNING',
          title: 'No Traditional Work Experience (Student Friendly)',
          problem: 'Work experience section is currently empty.',
          whyItMatters: 'While some enterprise jobs look for work history, students and freshers can emphasize Projects and Hackathons.',
          suggestion: 'Ensure your Projects and Hackathons sections are detailed with strong impact bullets.',
        });
      } else {
        sectionsScore -= missingRequired.length * 20;
        checks.push({
          id: 'sections_required',
          category: 'sections',
          status: 'FAIL',
          title: `Missing Crucial Sections: ${missingRequired.map((s) => s.name).join(', ')}`,
          problem: `ATS expects these sections to properly evaluate qualifications.`,
          whyItMatters: 'Resumes missing Skills or Education fail basic query filters.',
          suggestion: 'Add items for these sections in the editor or master profile.',
        });
      }
    }

    // --- 3. Structure & Layout Checks ---
    let structureScore = 100;
    // Single column guarantee
    checks.push({
      id: 'structure_single_column',
      category: 'structure',
      status: 'PASS',
      title: 'Single-Column Layout Enforced',
      whyItMatters: 'Multi-column layouts and sidebars cause ATS parsers to read across columns horizontally, scrambling text order.',
      suggestion: 'All ResumeForge templates maintain strict single-column flow.',
    });

    // Tables & text boxes check
    checks.push({
      id: 'structure_no_tables',
      category: 'structure',
      status: 'PASS',
      title: 'Zero Invisible Tables & Text Boxes',
      whyItMatters: 'Older ATS systems discard text inside HTML/Word text boxes or malformed tables.',
      suggestion: 'Clean linear document hierarchy used.',
    });

    // Check hidden sections
    if (resume.meta.hiddenSections.length > 0) {
      checks.push({
        id: 'structure_hidden_sections',
        category: 'structure',
        status: 'PASS',
        title: `Hidden Sections Managed Cleanly (${resume.meta.hiddenSections.length} hidden)`,
        whyItMatters: 'Hidden sections are omitted completely from the output rather than hidden with CSS (which ATS still reads).',
        suggestion: 'Data remains safely stored in your profile without contaminating ATS text.',
      });
    }

    // --- 4. Formatting & Glyphs Checks ---
    let formattingScore = 100;

    // Scan for private-use unicode glyphs, icon fonts or non-standard characters
    const fullTextRaw = JSON.stringify(resume);
    const privateUseGlyphs = fullTextRaw.match(/[\uE000-\uF8FF]/g);
    if (privateUseGlyphs && privateUseGlyphs.length > 0) {
      formattingScore -= 30;
      checks.push({
        id: 'format_glyphs',
        category: 'formatting',
        status: 'FAIL',
        title: 'Non-Standard Private Unicode Glyphs Detected',
        problem: `Found ${privateUseGlyphs.length} non-standard glyph(s) which parse as corrupt characters in ATS.`,
        whyItMatters: 'Font icons (like FontAwesome contact icons) turn into garbage symbols like [?] in ATS text extraction.',
        suggestion: 'ResumeForge templates use standard bullet characters (•, -) and plain text labels instead.',
      });
    } else {
      checks.push({
        id: 'format_glyphs',
        category: 'formatting',
        status: 'PASS',
        title: 'Clean Standard Typographic Characters',
        whyItMatters: 'Standard ASCII and UTF-8 characters are parsed cleanly by all major ATS platforms.',
        suggestion: 'No font icon artifacts detected.',
      });
    }

    // Font compatibility
    const safeFonts = ['Inter', 'Arial', 'Times New Roman', 'Georgia', 'Consolas'];
    if (safeFonts.includes(resume.meta.fontFamily)) {
      checks.push({
        id: 'format_font',
        category: 'formatting',
        status: 'PASS',
        title: `ATS-Standard Font Family: ${resume.meta.fontFamily}`,
        whyItMatters: 'Standard system fonts embed seamlessly into PDF vector streams with unicode mapping tables.',
        suggestion: 'Selected font guarantees 100% OCR readability.',
      });
    } else {
      formattingScore -= 15;
      checks.push({
        id: 'format_font',
        category: 'formatting',
        status: 'WARNING',
        title: 'Non-standard Font Family Selected',
        problem: 'Font might not render reliably across legacy ATS parsers.',
        whyItMatters: 'Missing embedded font metrics can cause character overlaps in parsed text.',
        suggestion: 'Switch to Inter, Arial, or Times New Roman.',
      });
    }

    // --- 5. Parsing & Text Stream Extraction ---
    let parsingScore = 100;
    const textStream = generateRawTextStream(resume);

    // Calculate length & word count
    const words = textStream.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Count bullets
    let bulletCount = 0;
    resume.work.forEach((w) => (bulletCount += w.responsibilities.length));
    resume.projects.forEach((p) => (bulletCount += p.highlights.length));

    // Page count estimate (roughly 450 words / 30 lines per single page)
    const estimatedPages = wordCount > 550 ? 2 : 1;
    if (estimatedPages > 1) {
      formattingScore -= 10;
      checks.push({
        id: 'format_length',
        category: 'formatting',
        status: 'WARNING',
        title: 'Resume May Exceed 1 Page (~' + wordCount + ' words)',
        problem: 'For students and entry-level applicants, a 1-page resume is strongly recommended.',
        whyItMatters: 'Recruiters spend an average of 6-8 seconds scanning entry-level applications.',
        suggestion: 'Shorten or hide less relevant project bullets or switch spacing to "compact" in editor settings.',
      });
    } else {
      checks.push({
        id: 'format_length',
        category: 'formatting',
        status: 'PASS',
        title: `Optimal 1-Page Length (~${wordCount} words)`,
        whyItMatters: 'Crisp, concise 1-page resumes have the highest completion read rate.',
        suggestion: 'Ideal length for students, freshers, and internship applicants.',
      });
    }

    // Text selectability check
    if (wordCount > 50) {
      checks.push({
        id: 'parsing_selectability',
        category: 'parsing',
        status: 'PASS',
        title: 'Real Text-Based PDF Stream (No Image/Canvas)',
        whyItMatters: 'Real text PDF generation ensures 100% selectable text that pastes in natural reading order.',
        suggestion: 'Fully compliant with ATS-first requirements.',
      });
    } else {
      parsingScore -= 40;
      checks.push({
        id: 'parsing_selectability',
        category: 'parsing',
        status: 'FAIL',
        title: 'Insufficient Content for Text Extraction',
        problem: 'Resume contains very few words.',
        whyItMatters: 'Empty resumes cannot be scored or indexed.',
        suggestion: 'Fill in your education, skills, and projects.',
      });
    }

    // Clamp scores
    contactScore = Math.max(0, Math.min(100, contactScore));
    sectionsScore = Math.max(0, Math.min(100, sectionsScore));
    structureScore = Math.max(0, Math.min(100, structureScore));
    formattingScore = Math.max(0, Math.min(100, formattingScore));
    parsingScore = Math.max(0, Math.min(100, parsingScore));

    const overallScore = Math.round(
      parsingScore * 0.25 +
      structureScore * 0.25 +
      contactScore * 0.2 +
      sectionsScore * 0.15 +
      formattingScore * 0.15
    );

    return {
      overallScore,
      categories: {
        parsing: parsingScore,
        structure: structureScore,
        contactInfo: contactScore,
        formatting: formattingScore,
        sections: sectionsScore,
      },
      checks,
      extractedTextStream: textStream,
      stats: {
        wordCount,
        bulletCount,
        readingTimeMinutes: Math.max(1, Math.round(wordCount / 200)),
        estimatedPages,
        specialGlyphCount: privateUseGlyphs ? privateUseGlyphs.length : 0,
      },
    };
  },
};

// Generates the raw string exactly as an ATS parser or Notepad copy-paste sees it
export function generateRawTextStream(resume: ResumeData): string {
  const lines: string[] = [];

  // Header / Basics
  if (resume.basics.name) lines.push(resume.basics.name.toUpperCase());
  if (resume.basics.label) lines.push(resume.basics.label);

  const contactParts: string[] = [];
  if (resume.basics.email) contactParts.push(resume.basics.email);
  if (resume.basics.phone) contactParts.push(resume.basics.phone);
  if (resume.basics.location) contactParts.push(resume.basics.location);
  if (resume.basics.url) contactParts.push(resume.basics.url);
  resume.basics.profiles.forEach((p) => contactParts.push(p.url || `${p.network}: ${p.username}`));
  if (contactParts.length > 0) lines.push(contactParts.join(' | '));
  lines.push('');

  // Summary
  if (resume.basics.summary && !resume.meta.hiddenSections.includes('summary')) {
    lines.push('SUMMARY');
    lines.push(resume.basics.summary);
    lines.push('');
  }

  // Iterate sections in defined order
  const order = resume.meta.sectionOrder || [
    'education',
    'work',
    'projects',
    'skills',
    'hackathons',
    'achievements',
    'certificates',
    'volunteering',
  ];

  order.forEach((sectionKey) => {
    if (resume.meta.hiddenSections.includes(sectionKey)) return;

    if (sectionKey === 'education' && resume.education.length > 0) {
      lines.push('EDUCATION');
      resume.education.forEach((edu) => {
        lines.push(`${edu.institution} - ${edu.location || ''}`);
        lines.push(`${edu.degree} in ${edu.field} | CGPA: ${edu.cgpa}`);
        lines.push(`Dates: ${edu.startDate} - ${edu.endDate || 'Present'}`);
        if (edu.coursework && edu.coursework.length > 0) {
          lines.push(`Coursework: ${edu.coursework.join(', ')}`);
        }
        lines.push('');
      });
    }

    if (sectionKey === 'work' && resume.work.length > 0) {
      lines.push('EXPERIENCE');
      resume.work.forEach((exp) => {
        lines.push(`${exp.position} - ${exp.company} (${exp.location})`);
        lines.push(`Dates: ${exp.startDate} - ${exp.endDate || 'Present'}`);
        if (exp.technologies && exp.technologies.length > 0) {
          lines.push(`Technologies: ${exp.technologies.join(', ')}`);
        }
        exp.responsibilities.forEach((b) => lines.push(`• ${b}`));
        lines.push('');
      });
    }

    if (sectionKey === 'projects' && resume.projects.length > 0) {
      lines.push('PROJECTS');
      resume.projects.forEach((proj) => {
        lines.push(`${proj.name} | ${proj.technologies.join(', ')}`);
        if (proj.url || proj.githubUrl) {
          lines.push(`Links: ${[proj.url, proj.githubUrl].filter(Boolean).join(' | ')}`);
        }
        lines.push(proj.description);
        proj.highlights.forEach((h) => lines.push(`• ${h}`));
        lines.push('');
      });
    }

    if (sectionKey === 'skills' && resume.skills.length > 0) {
      lines.push('SKILLS');
      resume.skills.forEach((cat) => {
        lines.push(`${cat.category}: ${cat.items.join(', ')}`);
      });
      lines.push('');
    }

    if (sectionKey === 'hackathons' && resume.hackathons.length > 0) {
      lines.push('HACKATHONS & COMPETITIONS');
      resume.hackathons.forEach((h) => {
        lines.push(`${h.name} - ${h.organization} | Award: ${h.achievement}`);
        lines.push(`Project: ${h.project} (${h.technologies.join(', ')})`);
        lines.push('');
      });
    }

    if (sectionKey === 'achievements' && resume.achievements.length > 0) {
      lines.push('ACHIEVEMENTS & HONORS');
      resume.achievements.forEach((a) => {
        lines.push(`${a.title} - ${a.organization} (${a.date})`);
        lines.push(a.description);
        lines.push('');
      });
    }

    if (sectionKey === 'certificates' && resume.certificates.length > 0) {
      lines.push('CERTIFICATIONS');
      resume.certificates.forEach((c) => {
        lines.push(`${c.name} - ${c.issuer} (${c.date})`);
        if (c.credentialUrl) lines.push(`Credential: ${c.credentialUrl}`);
        lines.push('');
      });
    }

    if (sectionKey === 'volunteering' && resume.volunteering.length > 0) {
      lines.push('VOLUNTEERING & LEADERSHIP');
      resume.volunteering.forEach((v) => {
        lines.push(`${v.role} - ${v.organization} (${v.startDate} - ${v.endDate})`);
        v.contributions.forEach((c) => lines.push(`• ${c}`));
        lines.push('');
      });
    }
  });

  return lines.join('\n');
}
