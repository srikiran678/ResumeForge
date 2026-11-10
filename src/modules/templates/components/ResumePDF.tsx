import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { ResumeData } from '@/data/types';
import { ClassicResumePDFPage } from './ClassicResumePDF';

// Pure vector PDF styles ensuring 100% selectable text & natural reading order
const baseStyles = {
  section: {
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
  },
  bulletList: {
    marginTop: 2,
    paddingLeft: 6,
  },
  bulletItem: {
    flexDirection: 'row' as const,
    marginBottom: 1.5,
  },
  bulletPoint: {
    width: 8,
    fontSize: 7.5,
    color: '#374151',
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: '#1F2937',
  },
  metaText: {
    fontSize: 8,
    color: '#4B5563',
  },
};

export const ResumePDFDocument: React.FC<{ resume: ResumeData }> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, volunteering, meta } = resume;
  const template = meta?.template || 'classic';
  const hidden = new Set(meta?.hiddenSections || (template === 'wall-street' ? ['summary'] : []));
  const order = meta?.sectionOrder || ['summary', 'education', 'work', 'projects', 'skills', 'hackathons', 'achievements', 'certificates', 'volunteering'];

  // Route Classic Resume Placement Format
  if (template === 'classic-resume') {
    return (
      <Document title={`${basics.name || 'Resume'} - ResumeForge`}>
        <ClassicResumePDFPage resume={resume} />
      </Document>
    );
  }

  // Determine Font Family based on Template Archetype
  const isSerif = ['classic', 'academic', 'executive', 'elegant', 'jakes-resume', 'harvard-classic', 'wall-street', 'mit-research'].includes(template);
  const fontRegular = isSerif ? 'Times-Roman' : 'Helvetica';
  const fontBold = isSerif ? 'Times-Bold' : 'Helvetica-Bold';
  const fontItalic = isSerif ? 'Times-Italic' : 'Helvetica-Oblique';
  const accentColor = meta?.accentColor || (
    template === 'google-swe' ? '#1a73e8' :
    template === 'mckinsey-consulting' ? '#0f172a' :
    template === 'stanford-swe' ? '#8c1515' :
    template === 'amazon-bar-raiser' ? '#e67a00' :
    template === 'meta-production' ? '#0064e0' :
    template === 'netflix-senior' ? '#e50914' :
    template === 'frontier-ai-agent' ? '#10a37f' :
    template === 'stripe-developer' ? '#635bff' :
    template === 'apple-design-systems' ? '#1d1d1f' :
    template === 'mit-research' ? '#750014' :
    '#111827'
  );
  const isWallStreet = template === 'wall-street';
  const isJakes = template === 'jakes-resume';

  const isCompact = ['compact', 'wall-street', 'jakes-resume', 'stanford-swe', 'frontier-ai-agent', 'meta-production', 'netflix-senior'].includes(template);
  const pagePadding = isWallStreet ? 22 : (isCompact ? 26 : 34);

  const dynamicStyles = StyleSheet.create({
    page: {
      padding: pagePadding,
      fontFamily: fontRegular,
      fontSize: isWallStreet || isJakes ? 8.5 : 9,
      lineHeight: isWallStreet || isJakes ? 1.25 : 1.35,
      color: '#111827',
    },
    header: {
      borderBottomWidth: isJakes ? 0 : 1.2,
      borderBottomColor: accentColor,
      paddingBottom: 6,
      marginBottom: 8,
      textAlign: isSerif || isJakes || isWallStreet ? 'center' : 'left',
    },
    name: {
      fontSize: isWallStreet || isJakes ? 17 : 19,
      fontFamily: fontBold,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: '#000000',
      marginBottom: 2,
    },
    label: {
      fontSize: 9,
      fontFamily: fontBold,
      color: accentColor,
      marginBottom: 3,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: isSerif || isJakes || isWallStreet ? 'center' : 'flex-start',
      gap: 5,
      fontSize: 8,
      color: '#374151',
    },
    sectionHeading: {
      fontSize: 9.5,
      fontFamily: fontBold,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      borderBottomWidth: 0.75,
      borderBottomColor: isJakes || isWallStreet ? '#000000' : '#9CA3AF',
      paddingBottom: 1.5,
      marginBottom: 3.5,
      color: '#111827',
    },
    boldText: {
      fontFamily: fontBold,
      color: '#000000',
    },
    italicText: {
      fontFamily: fontItalic,
      color: '#374151',
    },
  });

  return (
    <Document title={`${basics.name || 'Resume'} - ResumeForge`}>
      <Page size="LETTER" style={dynamicStyles.page}>
        {/* Contact Info Header */}
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.name}>{basics.name || 'Full Name'}</Text>
          {basics.label ? <Text style={dynamicStyles.label}>{basics.label}</Text> : null}
          <View style={dynamicStyles.contactRow}>
            {basics.location ? <Text>{basics.location}</Text> : null}
            {basics.phone ? <Text>• {basics.phone}</Text> : null}
            {basics.email ? <Text>• {basics.email}</Text> : null}
            {basics.url ? <Text>• {basics.url.replace(/^https?:\/\//, '')}</Text> : null}
            {basics.profiles?.map((p, idx) => (
              <Text key={idx}>• {p.network}: {p.username || (p.url ? p.url.replace(/^https?:\/\//, '') : '')}</Text>
            ))}
          </View>
        </View>

        {/* Summary (if not hidden) */}
        {basics.summary && !hidden.has('summary') ? (
          <View style={baseStyles.section}>
            <Text style={dynamicStyles.sectionHeading}>Summary</Text>
            <Text style={{ fontSize: 8.5, color: '#374151' }}>{basics.summary}</Text>
          </View>
        ) : null}

        {/* Dynamic Ordered Sections */}
        {order.map((sectionKey) => {
          if (hidden.has(sectionKey)) return null;

          if (sectionKey === 'education' && education.length > 0) {
            return (
              <View key="education" style={baseStyles.section}>
                <Text style={dynamicStyles.sectionHeading}>Education</Text>
                {education.map((edu) => (
                  <View key={edu.id} style={{ marginBottom: 3 }}>
                    <View style={baseStyles.rowBetween}>
                      <Text style={dynamicStyles.boldText}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</Text>
                      <Text style={baseStyles.metaText}>{edu.startDate} – {edu.endDate || 'Present'}</Text>
                    </View>
                    <View style={baseStyles.rowBetween}>
                      <Text style={dynamicStyles.italicText}>{edu.degree} in {edu.field}</Text>
                      {edu.cgpa ? <Text style={dynamicStyles.boldText}>GPA: {edu.cgpa}</Text> : null}
                    </View>
                    {edu.honors && edu.honors.length > 0 ? (
                      <Text style={baseStyles.metaText}>Honors: {edu.honors.join(', ')}</Text>
                    ) : null}
                    {edu.testScores ? (
                      <Text style={baseStyles.metaText}>Test Scores: {edu.testScores}</Text>
                    ) : null}
                    {edu.coursework && edu.coursework.length > 0 ? (
                      <Text style={baseStyles.metaText}>Coursework: {edu.coursework.join(', ')}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            );
          }

          if ((sectionKey === 'work' || sectionKey === 'experience') && work.length > 0) {
            return (
              <View key="work" style={baseStyles.section}>
                <Text style={dynamicStyles.sectionHeading}>Experience</Text>
                {work.map((exp) => (
                  <View key={exp.id} style={{ marginBottom: 4 }}>
                    <View style={baseStyles.rowBetween}>
                      <Text style={dynamicStyles.boldText}>{exp.position}</Text>
                      <Text style={baseStyles.metaText}>{exp.startDate} – {exp.endDate || 'Present'}</Text>
                    </View>
                    <View style={baseStyles.rowBetween}>
                      <Text style={dynamicStyles.italicText}>{exp.company}</Text>
                      <Text style={baseStyles.metaText}>{exp.location || ''}</Text>
                    </View>
                    {exp.technologies && exp.technologies.length > 0 ? (
                      <Text style={{ fontSize: 7.5, color: accentColor, marginBottom: 1 }}>
                        Tech: {exp.technologies.join(' • ')}
                      </Text>
                    ) : null}
                    {exp.responsibilities?.length > 0 ? (
                      <View style={baseStyles.bulletList}>
                        {exp.responsibilities.map((b, idx) => (
                          <View key={idx} style={baseStyles.bulletItem}>
                            <Text style={baseStyles.bulletPoint}>•</Text>
                            <Text style={baseStyles.bulletText}>{b}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'projects' && projects.length > 0) {
            return (
              <View key="projects" style={baseStyles.section}>
                <Text style={dynamicStyles.sectionHeading}>Projects</Text>
                {projects.map((proj) => (
                  <View key={proj.id} style={{ marginBottom: 3.5 }}>
                    <View style={baseStyles.rowBetween}>
                      <Text style={dynamicStyles.boldText}>
                        {proj.name}
                        {proj.technologies?.length > 0 ? ` | ${proj.technologies.join(', ')}` : ''}
                      </Text>
                      {proj.url || proj.githubUrl ? (
                        <Text style={baseStyles.metaText}>
                          {[proj.url, proj.githubUrl].filter(Boolean).map(u => u?.replace(/^https?:\/\//, '')).join(' | ')}
                        </Text>
                      ) : null}
                    </View>
                    {proj.description ? <Text style={{ fontSize: 8, color: '#374151' }}>{proj.description}</Text> : null}
                    {proj.highlights?.length > 0 ? (
                      <View style={baseStyles.bulletList}>
                        {proj.highlights.map((h, idx) => (
                          <View key={idx} style={baseStyles.bulletItem}>
                            <Text style={baseStyles.bulletPoint}>•</Text>
                            <Text style={baseStyles.bulletText}>{h}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'skills' && skills.length > 0) {
            return (
              <View key="skills" style={baseStyles.section}>
                <Text style={dynamicStyles.sectionHeading}>Technical Skills</Text>
                {skills.map((cat, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', marginBottom: 1.5 }}>
                    <Text style={[dynamicStyles.boldText, { width: 110, fontSize: 8 }]}>{cat.category}: </Text>
                    <Text style={[baseStyles.bulletText, { fontSize: 8 }]}>{cat.items.join(', ')}</Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'certificates' && certificates.length > 0) {
            return (
              <View key="certificates" style={baseStyles.section}>
                <Text style={dynamicStyles.sectionHeading}>Certifications</Text>
                {certificates.map((c) => (
                  <View key={c.id} style={baseStyles.rowBetween}>
                    <Text style={dynamicStyles.boldText}>{c.name} — <Text style={baseStyles.metaText}>{c.issuer}</Text></Text>
                    <Text style={baseStyles.metaText}>{c.date}</Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'achievements' && achievements.length > 0) {
            return (
              <View key="achievements" style={baseStyles.section}>
                <Text style={dynamicStyles.sectionHeading}>Honors & Awards</Text>
                {achievements.map((a) => (
                  <View key={a.id} style={{ marginBottom: 1.5 }}>
                    <Text style={dynamicStyles.boldText}>{a.title} — <Text style={baseStyles.metaText}>{a.organization} ({a.date})</Text></Text>
                    {a.description ? <Text style={baseStyles.metaText}>{a.description}</Text> : null}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'hackathons' && hackathons.length > 0) {
            return (
              <View key="hackathons" style={baseStyles.section}>
                <Text style={dynamicStyles.sectionHeading}>Hackathons & Competitions</Text>
                {hackathons.map((h) => (
                  <View key={h.id} style={{ marginBottom: 2 }}>
                    <View style={baseStyles.rowBetween}>
                      <Text style={dynamicStyles.boldText}>{h.name} — {h.organization}</Text>
                      <Text style={dynamicStyles.boldText}>{h.achievement || ''}</Text>
                    </View>
                    <Text style={baseStyles.metaText}>Project: {h.project} {h.technologies ? `(${h.technologies.join(', ')})` : ''}</Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'volunteering' && volunteering.length > 0) {
            return (
              <View key="volunteering" style={baseStyles.section}>
                <Text style={dynamicStyles.sectionHeading}>Leadership & Extracurricular</Text>
                {volunteering.map((v) => (
                  <View key={v.id} style={{ marginBottom: 2 }}>
                    <View style={baseStyles.rowBetween}>
                      <Text style={dynamicStyles.boldText}>{v.role} — {v.organization}</Text>
                      <Text style={baseStyles.metaText}>{v.startDate} – {v.endDate}</Text>
                    </View>
                    {v.contributions?.length > 0 ? (
                      <View style={baseStyles.bulletList}>
                        {v.contributions.map((c, idx) => (
                          <View key={idx} style={baseStyles.bulletItem}>
                            <Text style={baseStyles.bulletPoint}>•</Text>
                            <Text style={baseStyles.bulletText}>{c}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            );
          }

          return null;
        })}
      </Page>
    </Document>
  );
};

// Helper function to trigger browser download of real vector PDF
export async function downloadResumePDF(resume: ResumeData): Promise<void> {
  const blob = await pdf(<ResumePDFDocument resume={resume} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = (resume.basics?.name || 'Resume').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const roleName = (resume.targetRole || 'Document').toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.download = `${safeName}_${roleName}_ATS.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
