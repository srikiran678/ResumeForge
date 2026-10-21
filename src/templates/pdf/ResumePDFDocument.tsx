import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { ResumeData } from '../../data/types';

// Pure vector PDF styles ensuring 100% selectable text & natural reading order
const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.4,
    color: '#111827',
  },
  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#111827',
    paddingBottom: 8,
    marginBottom: 10,
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#000000',
    marginBottom: 2,
  },
  label: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    fontSize: 8.5,
    color: '#4B5563',
  },
  section: {
    marginBottom: 9,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 0.75,
    borderBottomColor: '#9CA3AF',
    paddingBottom: 2,
    marginBottom: 4,
    color: '#111827',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  boldText: {
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
  },
  italicText: {
    fontFamily: 'Helvetica-Oblique',
    color: '#374151',
  },
  bulletList: {
    marginTop: 2,
    paddingLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletPoint: {
    width: 10,
    fontSize: 8,
    color: '#374151',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#1F2937',
  },
  metaText: {
    fontSize: 8.5,
    color: '#4B5563',
    marginTop: 1,
  },
});

export const ResumePDFDocument: React.FC<{ resume: ResumeData }> = ({ resume }) => {
  const { basics, education, work, projects, skills, certificates, achievements, hackathons, volunteering, meta } = resume;
  const hidden = new Set(meta.hiddenSections || []);
  const order = meta.sectionOrder || ['summary', 'education', 'work', 'projects', 'skills', 'hackathons', 'achievements', 'certificates', 'volunteering'];

  return (
    <Document title={`${basics.name || 'Resume'} - ResumeForge`}>
      <Page size="LETTER" style={styles.page}>
        {/* Contact Info Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{basics.name || 'Full Name'}</Text>
          {basics.label ? <Text style={styles.label}>{basics.label}</Text> : null}
          <View style={styles.contactRow}>
            {basics.email ? <Text>{basics.email}</Text> : null}
            {basics.phone ? <Text>• {basics.phone}</Text> : null}
            {basics.location ? <Text>• {basics.location}</Text> : null}
            {basics.url ? <Text>• {basics.url}</Text> : null}
            {basics.profiles?.map((p, idx) => (
              <Text key={idx}>• {p.network}: {p.username || p.url}</Text>
            ))}
          </View>
        </View>

        {/* Summary */}
        {basics.summary && !hidden.has('summary') ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Summary</Text>
            <Text style={{ fontSize: 9, color: '#374151' }}>{basics.summary}</Text>
          </View>
        ) : null}

        {/* Dynamic Ordered Sections */}
        {order.map((sectionKey) => {
          if (hidden.has(sectionKey)) return null;

          if (sectionKey === 'education' && education.length > 0) {
            return (
              <View key="education" style={styles.section}>
                <Text style={styles.sectionHeading}>Education</Text>
                {education.map((edu) => (
                  <View key={edu.id} style={{ marginBottom: 4 }}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.boldText}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</Text>
                      <Text style={styles.metaText}>{edu.startDate} – {edu.endDate || 'Present'}</Text>
                    </View>
                    <View style={styles.rowBetween}>
                      <Text style={styles.italicText}>{edu.degree} in {edu.field}</Text>
                      {edu.cgpa ? <Text style={styles.boldText}>GPA: {edu.cgpa}</Text> : null}
                    </View>
                    {edu.coursework && edu.coursework.length > 0 ? (
                      <Text style={styles.metaText}>Coursework: {edu.coursework.join(', ')}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'work' && work.length > 0) {
            return (
              <View key="work" style={styles.section}>
                <Text style={styles.sectionHeading}>Experience</Text>
                {work.map((exp) => (
                  <View key={exp.id} style={{ marginBottom: 5 }}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.boldText}>{exp.position}</Text>
                      <Text style={styles.metaText}>{exp.startDate} – {exp.endDate || 'Present'}</Text>
                    </View>
                    <Text style={styles.italicText}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</Text>
                    {exp.responsibilities?.length > 0 ? (
                      <View style={styles.bulletList}>
                        {exp.responsibilities.map((b, idx) => (
                          <View key={idx} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{b}</Text>
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
              <View key="projects" style={styles.section}>
                <Text style={styles.sectionHeading}>Projects</Text>
                {projects.map((proj) => (
                  <View key={proj.id} style={{ marginBottom: 5 }}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.boldText}>
                        {proj.name}
                        {proj.technologies?.length > 0 ? ` | ${proj.technologies.join(', ')}` : ''}
                      </Text>
                      {proj.date ? <Text style={styles.metaText}>{proj.date}</Text> : null}
                    </View>
                    {proj.url || proj.githubUrl ? (
                      <Text style={{ fontSize: 8, color: '#4B5563', marginBottom: 2 }}>
                        {[proj.url, proj.githubUrl].filter(Boolean).join(' | ')}
                      </Text>
                    ) : null}
                    {proj.description ? <Text style={{ fontSize: 9, color: '#374151' }}>{proj.description}</Text> : null}
                    {proj.highlights?.length > 0 ? (
                      <View style={styles.bulletList}>
                        {proj.highlights.map((h, idx) => (
                          <View key={idx} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{h}</Text>
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
              <View key="skills" style={styles.section}>
                <Text style={styles.sectionHeading}>Skills</Text>
                {skills.map((cat, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
                    <Text style={styles.boldText}>{cat.category}: </Text>
                    <Text style={styles.bulletText}>{cat.items.join(', ')}</Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'hackathons' && hackathons.length > 0) {
            return (
              <View key="hackathons" style={styles.section}>
                <Text style={styles.sectionHeading}>Hackathons & Competitions</Text>
                {hackathons.map((h) => (
                  <View key={h.id} style={{ marginBottom: 3 }}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.boldText}>{h.name} — {h.organization}</Text>
                      <Text style={styles.boldText}>{h.achievement}</Text>
                    </View>
                    <Text style={styles.metaText}>Project: {h.project} ({h.technologies.join(', ')})</Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'achievements' && achievements.length > 0) {
            return (
              <View key="achievements" style={styles.section}>
                <Text style={styles.sectionHeading}>Achievements & Honors</Text>
                {achievements.map((a) => (
                  <View key={a.id} style={{ marginBottom: 2 }}>
                    <Text style={styles.boldText}>{a.title} — <Text style={styles.metaText}>{a.organization} ({a.date})</Text></Text>
                    {a.description ? <Text style={styles.metaText}>{a.description}</Text> : null}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'certificates' && certificates.length > 0) {
            return (
              <View key="certificates" style={styles.section}>
                <Text style={styles.sectionHeading}>Certifications</Text>
                {certificates.map((c) => (
                  <View key={c.id} style={styles.rowBetween}>
                    <Text style={styles.boldText}>{c.name} — <Text style={styles.metaText}>{c.issuer}</Text></Text>
                    <Text style={styles.metaText}>{c.date}</Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === 'volunteering' && volunteering.length > 0) {
            return (
              <View key="volunteering" style={styles.section}>
                <Text style={styles.sectionHeading}>Volunteering & Leadership</Text>
                {volunteering.map((v) => (
                  <View key={v.id} style={{ marginBottom: 3 }}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.boldText}>{v.role} — {v.organization}</Text>
                      <Text style={styles.metaText}>{v.startDate} – {v.endDate}</Text>
                    </View>
                    {v.contributions?.length > 0 ? (
                      <View style={styles.bulletList}>
                        {v.contributions.map((c, idx) => (
                          <View key={idx} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{c}</Text>
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
  const fileName = `${(resume.basics.name || 'Resume').toLowerCase().replace(/\s+/g, '_')}_resume.pdf`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
