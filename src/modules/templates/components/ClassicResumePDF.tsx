import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '@/data/types';

// Crisp, formal monochrome vector PDF styles matching traditional Indian fresher resumes
const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.35,
    color: '#000000',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  titleResume: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 3,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 4,
  },
  contactDetails: {
    fontSize: 8.5,
    color: '#222222',
    textAlign: 'center',
    lineHeight: 1.3,
  },
  headerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginTop: 8,
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 0.8,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 5,
    color: '#000000',
  },
  paragraph: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#111111',
    textAlign: 'justify',
  },
  // 5-Column Education Table
  table: {
    borderWidth: 0.75,
    borderColor: '#000000',
    marginVertical: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    minHeight: 18,
    alignItems: 'stretch',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 0.8,
    borderBottomColor: '#000000',
    minHeight: 20,
    alignItems: 'center',
  },
  tableCellHeader: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    padding: 3,
    color: '#000000',
  },
  tableCell: {
    fontSize: 8,
    padding: 3,
    color: '#111111',
  },
  tableCellCenter: {
    fontSize: 8,
    padding: 3,
    textAlign: 'center',
    color: '#111111',
  },
  col1: { width: '22%', borderRightWidth: 0.5, borderRightColor: '#000000' },
  col2: { width: '31%', borderRightWidth: 0.5, borderRightColor: '#000000' },
  col3: { width: '23%', borderRightWidth: 0.5, borderRightColor: '#000000' },
  col4: { width: '11%', borderRightWidth: 0.5, borderRightColor: '#000000' },
  col5: { width: '13%' },

  // Bullets
  bulletList: {
    marginTop: 2,
    paddingLeft: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2.5,
  },
  bulletDot: {
    width: 10,
    fontSize: 8.5,
    color: '#000000',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.35,
    color: '#111111',
  },
  boldInline: {
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
  },

  // Project item
  projectBlock: {
    marginBottom: 6,
  },
  projectTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginBottom: 1.5,
  },
  projectTech: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 8.5,
    color: '#333333',
  },

  // Internship item
  workRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },

  // Declaration
  declarationSection: {
    marginTop: 10,
  },
  declarationText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    marginBottom: 16,
    textAlign: 'justify',
  },
  signRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    fontSize: 8.5,
  },
});

export const ClassicResumePDFPage: React.FC<{ resume: ResumeData }> = ({ resume }) => {
  const {
    basics,
    education = [],
    work = [],
    projects = [],
    skills = [],
    certificates = [],
    strengths = [],
    extracurricular = [],
    declaration,
    meta,
  } = resume;

  const hidden = new Set(meta?.hiddenSections || []);
  const objectiveText = resume.careerObjective || basics.summary || '';

  const effectiveExtracurricular =
    extracurricular.length > 0
      ? extracurricular
      : [
          ...(resume.hackathons || []).map(
            (h) => `${h.name} — ${h.achievement}${h.project ? ` (${h.project})` : ''}`
          ),
          ...(resume.volunteering || []).map(
            (v) => `${v.role} at ${v.organization}${v.contributions?.length ? `: ${v.contributions.join('; ')}` : ''}`
          ),
        ];

  const declarationText =
    declaration?.text ||
    'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.';
  const declarationPlace = declaration?.place || basics.location || '';
  const declarationDate = declaration?.date || '';
  const declarationSignature = declaration?.signature || basics.name || '';

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titleResume}>RESUME</Text>
        <Text style={styles.name}>{basics.name ? basics.name.toUpperCase() : 'CANDIDATE NAME'}</Text>
        <View style={styles.contactDetails}>
          {basics.location ? <Text>Address: {basics.location}</Text> : null}
          <Text>
            {[basics.phone ? `Contact: ${basics.phone}` : null, basics.email ? `Email: ${basics.email}` : null]
              .filter(Boolean)
              .join('   |   ')}
          </Text>
        </View>
        <View style={styles.headerDivider} />
      </View>

      {/* Career Objective */}
      {objectiveText && !hidden.has('objective') && !hidden.has('summary') ? (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeading}>CAREER OBJECTIVE</Text>
          <Text style={styles.paragraph}>{objectiveText}</Text>
        </View>
      ) : null}

      {/* Educational Qualifications Table */}
      {education.length > 0 && !hidden.has('education') ? (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>EDUCATIONAL QUALIFICATIONS</Text>
          <View style={styles.table}>
            {/* Header with fixed attribute so it repeats if table spans onto page 2 */}
            <View style={styles.tableHeaderRow} fixed>
              <View style={styles.col1}>
                <Text style={styles.tableCellHeader}>Qualification</Text>
              </View>
              <View style={styles.col2}>
                <Text style={styles.tableCellHeader}>Institution</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.tableCellHeader}>University / Board</Text>
              </View>
              <View style={styles.col4}>
                <Text style={styles.tableCellHeader}>Year</Text>
              </View>
              <View style={styles.col5}>
                <Text style={styles.tableCellHeader}>CGPA / %</Text>
              </View>
            </View>

            {education.map((edu, idx) => {
              const qual =
                edu.qualification ||
                edu.degree ||
                (edu.field ? `${edu.degree || 'Degree'} in ${edu.field}` : 'Degree');
              const inst = edu.institution || '—';
              const board = edu.board || edu.location || '—';
              const year =
                edu.year ||
                (edu.startDate && edu.endDate
                  ? `${edu.startDate} - ${edu.endDate}`
                  : edu.endDate || edu.startDate || '—');
              const grade = edu.percentage || edu.cgpa || '—';

              return (
                <View key={edu.id || idx} style={styles.tableRow} wrap={false}>
                  <View style={styles.col1}>
                    <Text style={styles.tableCell}>{qual}</Text>
                  </View>
                  <View style={styles.col2}>
                    <Text style={styles.tableCell}>{inst}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.tableCell}>{board}</Text>
                  </View>
                  <View style={styles.col4}>
                    <Text style={styles.tableCellCenter}>{year}</Text>
                  </View>
                  <View style={styles.col5}>
                    <Text style={styles.tableCellCenter}>{grade}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}

      {/* Technical Skills */}
      {skills.length > 0 && !hidden.has('skills') ? (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeading}>TECHNICAL SKILLS</Text>
          <View style={styles.bulletList}>
            {skills.map((cat, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.boldInline}>{cat.category}: </Text>
                  {cat.items?.join(', ')}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Academic Project */}
      {projects.length > 0 && !hidden.has('projects') ? (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>ACADEMIC PROJECT</Text>
          {projects.map((proj) => (
            <View key={proj.id} style={styles.projectBlock} wrap={false}>
              <Text style={styles.projectTitle}>
                Project: {proj.name}
                {proj.technologies && proj.technologies.length > 0 ? (
                  <Text style={styles.projectTech}> (Technologies: {proj.technologies.join(', ')})</Text>
                ) : null}
              </Text>
              {proj.description ? <Text style={styles.paragraph}>{proj.description}</Text> : null}
              {proj.highlights && proj.highlights.length > 0 ? (
                <View style={styles.bulletList}>
                  {proj.highlights.map((h, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{h}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Internship / Training */}
      {work.length > 0 && !hidden.has('work') && !hidden.has('internships') ? (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>INTERNSHIP / TRAINING</Text>
          {work.map((exp) => (
            <View key={exp.id} style={styles.projectBlock} wrap={false}>
              <View style={styles.workRow}>
                <Text style={styles.boldInline}>
                  {exp.position}
                  {exp.company ? ` — ${exp.company}` : ''}
                </Text>
                {exp.startDate || exp.endDate ? (
                  <Text style={{ fontSize: 8, color: '#333333' }}>
                    {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}
                  </Text>
                ) : null}
              </View>
              {exp.responsibilities && exp.responsibilities.length > 0 ? (
                <View style={styles.bulletList}>
                  {exp.responsibilities.map((r, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{r}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Certifications */}
      {certificates.length > 0 && !hidden.has('certificates') ? (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeading}>CERTIFICATIONS</Text>
          <View style={styles.bulletList}>
            {certificates.map((cert) => (
              <View key={cert.id} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.boldInline}>{cert.name}</Text>
                  {cert.issuer ? ` — ${cert.issuer}` : ''}
                  {cert.date ? ` (${cert.date})` : ''}
                  {cert.credentialUrl ? ` [ID/Link: ${cert.credentialUrl}]` : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Strengths */}
      {strengths.length > 0 && !hidden.has('strengths') ? (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeading}>STRENGTHS</Text>
          <View style={styles.bulletList}>
            {strengths.map((str, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{str}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Extra-Curricular Activities */}
      {effectiveExtracurricular.length > 0 && !hidden.has('extracurricular') ? (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeading}>EXTRA-CURRICULAR ACTIVITIES</Text>
          <View style={styles.bulletList}>
            {effectiveExtracurricular.map((act, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{act}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Declaration */}
      {!hidden.has('declaration') ? (
        <View style={styles.declarationSection} wrap={false}>
          <Text style={styles.sectionHeading}>DECLARATION</Text>
          <Text style={styles.declarationText}>{declarationText}</Text>
          <View style={styles.signRow}>
            <View>
              <Text>Place: {declarationPlace}</Text>
              <Text>Date: {declarationDate}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text>({declarationSignature})</Text>
            </View>
          </View>
        </View>
      ) : null}
    </Page>
  );
};
