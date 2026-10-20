import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Terminal, 
  Zap, 
  BookOpen, 
  Layers 
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ATSAnalyzer } from '../lib/atsAnalyzer';
import { QualityAnalyzer } from '../lib/qualityAnalyzer';
import { TextExtractionViewer } from '../components/resume/TextExtractionViewer';

export const ResumeAnalyzerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { resumes } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'ats' | 'quality' | 'notepad'>('ats');

  const resume = resumes.find((r) => r.id === id) || resumes[0];

  if (!resume) {
    return (
      <div className="py-20 text-center">
        <p className="text-xs text-forge-600">Resume not found.</p>
        <Link to="/resumes" className="text-xs text-forge-900 underline font-bold mt-2 inline-block">
          Return to Resumes
        </Link>
      </div>
    );
  }

  const ats = ATSAnalyzer.analyze(resume);
  const quality = QualityAnalyzer.analyze(resume);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-forge-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Link to={`/editor/${resume.id}`} className="text-forge-400 hover:text-forge-700">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold text-forge-400 uppercase tracking-wider">
              Verification Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forge-900 tracking-tight mt-1">
            Resume Compatibility & Quality Analyzer
          </h1>
          <p className="text-xs text-forge-500 mt-0.5">
            Analyzing: <strong className="text-forge-800">{resume.title}</strong> (Template: {resume.meta.template})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to={`/editor/${resume.id}`}
            className="px-4 py-2 text-xs font-bold bg-forge-900 text-white hover:bg-forge-800 rounded-lg shadow-sm"
          >
            Back to Editor
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-forge-200 space-x-2">
        <button
          onClick={() => setActiveTab('ats')}
          className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'ats'
              ? 'bg-forge-900 text-white shadow-sm'
              : 'bg-white text-forge-600 border border-forge-200 hover:bg-forge-50'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>ATS Compatibility Score ({ats.overallScore}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'quality'
              ? 'bg-forge-900 text-white shadow-sm'
              : 'bg-white text-forge-600 border border-forge-200 hover:bg-forge-50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Quality & Completeness ({quality.completeness.overall}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('notepad')}
          className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'notepad'
              ? 'bg-forge-900 text-white shadow-sm'
              : 'bg-white text-forge-600 border border-forge-200 hover:bg-forge-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Notepad Test & Raw Text Stream</span>
        </button>
      </div>

      {/* Tab 1: ATS Compatibility (Sections 18 & 19) */}
      {activeTab === 'ats' && (
        <div className="space-y-6">
          {/* Big Score Card */}
          <div className="bg-white p-6 rounded-2xl border border-forge-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-forge-400">Overall ATS Assessment</div>
              <div className="text-4xl sm:text-5xl font-black text-forge-900 flex items-center justify-center md:justify-start space-x-3">
                <span>{ats.overallScore}%</span>
                <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  ATS Verified
                </span>
              </div>
              <p className="text-xs text-forge-500 max-w-xl">
                Structural & text compatibility evaluation. Assesses plain text extraction, absence of broken tables, single-column reading order, and heading vocabulary.
              </p>
            </div>

            {/* Category Breakdown Progress Bars (Section 18) */}
            <div className="w-full md:w-80 space-y-2 text-xs">
              <div className="flex justify-between font-semibold text-forge-700">
                <span>Parsing Stream:</span>
                <span className="font-mono text-emerald-600">{ats.categories.parsing}%</span>
              </div>
              <div className="w-full bg-forge-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-1.5" style={{ width: `${ats.categories.parsing}%` }} />
              </div>

              <div className="flex justify-between font-semibold text-forge-700">
                <span>Single-Column Structure:</span>
                <span className="font-mono text-emerald-600">{ats.categories.structure}%</span>
              </div>
              <div className="w-full bg-forge-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-1.5" style={{ width: `${ats.categories.structure}%` }} />
              </div>

              <div className="flex justify-between font-semibold text-forge-700">
                <span>Contact Info Text:</span>
                <span className="font-mono text-emerald-600">{ats.categories.contactInfo}%</span>
              </div>
              <div className="w-full bg-forge-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-1.5" style={{ width: `${ats.categories.contactInfo}%` }} />
              </div>

              <div className="flex justify-between font-semibold text-forge-700">
                <span>Standard Sections:</span>
                <span className="font-mono text-emerald-600">{ats.categories.sections}%</span>
              </div>
              <div className="w-full bg-forge-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-1.5" style={{ width: `${ats.categories.sections}%` }} />
              </div>

              <div className="flex justify-between font-semibold text-forge-700">
                <span>Formatting & Glyphs:</span>
                <span className="font-mono text-emerald-600">{ats.categories.formatting}%</span>
              </div>
              <div className="w-full bg-forge-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-1.5" style={{ width: `${ats.categories.formatting}%` }} />
              </div>
            </div>
          </div>

          {/* PASS / WARNING / FAIL Checks List (Section 19) */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-forge-800">
              Deterministic Verification Checks
            </h2>

            <div className="space-y-3">
              {ats.checks.map((chk) => (
                <div
                  key={chk.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start justify-between gap-4 transition-all ${
                    chk.status === 'PASS'
                      ? 'bg-white border-forge-200'
                      : chk.status === 'WARNING'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {chk.status === 'PASS' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : chk.status === 'WARNING' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-forge-900">{chk.title}</span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                            chk.status === 'PASS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : chk.status === 'WARNING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {chk.status}
                        </span>
                      </div>
                      {chk.problem && (
                        <div className="text-xs font-semibold text-rose-700">
                          Problem: {chk.problem}
                        </div>
                      )}
                      <div className="text-xs text-forge-600">
                        <strong>Why it matters:</strong> {chk.whyItMatters}
                      </div>
                      <div className="text-xs text-forge-700 bg-forge-50 p-2 rounded border border-forge-100 mt-1">
                        <strong>Fix:</strong> {chk.suggestion}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Quality & Completeness (Sections 20, 21, 22) */}
      {activeTab === 'quality' && (
        <div className="space-y-6">
          {/* Completeness Card */}
          <div className="bg-white p-6 rounded-2xl border border-forge-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-forge-900">
                Resume Completeness Score: {quality.completeness.overall}%
              </h2>
              <p className="text-xs text-forge-500">
                Evaluates comprehensive depth across all sections with special accommodations for student developers.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-forge-50 rounded-xl border border-forge-100">
                <span className="text-forge-500 block text-[10px]">Personal Info</span>
                <strong className="text-forge-900 text-sm">{quality.completeness.personalInfo}%</strong>
              </div>
              <div className="p-3 bg-forge-50 rounded-xl border border-forge-100">
                <span className="text-forge-500 block text-[10px]">Education</span>
                <strong className="text-forge-900 text-sm">{quality.completeness.education}%</strong>
              </div>
              <div className="p-3 bg-forge-50 rounded-xl border border-forge-100">
                <span className="text-forge-500 block text-[10px]">Technical Projects</span>
                <strong className="text-forge-900 text-sm">{quality.completeness.projects}%</strong>
              </div>
              <div className="p-3 bg-forge-50 rounded-xl border border-forge-100">
                <span className="text-forge-500 block text-[10px]">Technical Skills</span>
                <strong className="text-forge-900 text-sm">{quality.completeness.skills}%</strong>
              </div>
            </div>

            {/* Student Alternatives Guidance (Section 21) */}
            {quality.studentAlternativesAdvice.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-2">
                <div className="font-bold flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-blue-700" />
                  <span>Student & Fresher Guidance (Alternative Experience)</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-blue-800">
                  {quality.studentAlternativesAdvice.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Weak Verbs & Vague Statements (Section 20) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-forge-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-forge-800">
                Weak Verbs Detected ({quality.weakVerbsFound.length})
              </h3>
              {quality.weakVerbsFound.length === 0 ? (
                <p className="text-xs text-emerald-700">✓ Excellent! All bullets start with strong active verbs.</p>
              ) : (
                <div className="space-y-2">
                  {quality.weakVerbsFound.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                      <div className="font-bold text-amber-900">Found weak verb: "{item.word}"</div>
                      <div className="text-[11px] text-forge-600">{item.location}</div>
                      <div className="text-emerald-800 font-semibold mt-1">Suggested: {item.suggestion}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-forge-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-forge-800">
                Consistency & Duplicate Checks
              </h3>
              {quality.inconsistentDates.length === 0 && quality.duplicateSkills.length === 0 ? (
                <p className="text-xs text-emerald-700">✓ All dates and skill categorizations are strictly consistent.</p>
              ) : (
                <div className="space-y-2">
                  {quality.inconsistentDates.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-xs">
                      <div className="font-bold text-rose-900">{item.item}</div>
                      <div className="text-rose-700">{item.issue}</div>
                      <div className="text-forge-600 mt-0.5">Fix: {item.fix}</div>
                    </div>
                  ))}
                  {quality.duplicateSkills.map((d, idx) => (
                    <div key={idx} className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                      <span className="font-bold text-amber-900">Duplicate Skill: "{d.skill}"</span>
                      <div className="text-[11px] text-amber-700">Repeated across: {d.occurrences.join(', ')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notepad Verification Test (Section 3) */}
      {activeTab === 'notepad' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900">
            <h3 className="font-bold mb-1">The Golden Acceptance Test:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Click "Copy for Notepad Test" below.</li>
              <li>Open Notepad (or any plain text editor) on your computer.</li>
              <li>Press Ctrl+V (Paste).</li>
              <li>Notice that every section and bullet appears in natural top-to-bottom reading order.</li>
            </ol>
          </div>

          <TextExtractionViewer resume={resume} />
        </div>
      )}
    </div>
  );
};
