import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  X, 
  History, 
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { AIService } from '../lib/aiService';
import { JobDescriptionAnalysis } from '../types';
import { StorageService } from '../lib/storage';
import { AIPrivacyModal } from '../components/common/AIPrivacyModal';

const SAMPLE_JOB_DESCRIPTION = '';

export const AIToolsPage: React.FC = () => {
  const { masterProfile, resumes, aiUsage, refreshAIUsage } = useWorkspace();
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTION);
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<JobDescriptionAnalysis | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [acceptedChanges, setAcceptedChanges] = useState<Record<string, boolean>>({});

  const handleAnalyze = async () => {
    if (resumes.length === 0) {
      alert('Please create a resume first in Resume Manager before running job description analysis.');
      return;
    }

    if (!StorageService.hasAcceptedAIPrivacy()) {
      setPrivacyModalOpen(true);
      return;
    }

    const currentResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0];
    if (!currentResume) return;

    setIsAnalyzing(true);
    try {
      const result = await AIService.analyzeJobDescription(
        jobDescription,
        masterProfile,
        currentResume
      );
      setAnalysisResult(result.analysis);
      refreshAIUsage();
    } catch (err: any) {
      alert(`AI Execution Notice: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptSuggestion = (sugId: string) => {
    setAcceptedChanges({ ...acceptedChanges, [sugId]: true });
  };

  const handleRejectSuggestion = (sugId: string) => {
    setAcceptedChanges({ ...acceptedChanges, [sugId]: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-forge-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-forge-400 uppercase tracking-wider">Honest Career AI</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Zero Hallucination Guaranteed
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forge-900 tracking-tight mt-1">
            Job Description Analyzer & Honest Tailoring
          </h1>
          <p className="text-xs text-forge-500 mt-0.5">
            Compare target job descriptions against your verified Master Profile. AI highlights real matches and genuine gaps—never fabricating missing skills.
          </p>
        </div>

        {/* Quota Pill (Section 28) */}
        <div className="bg-forge-50 p-3 rounded-xl border border-forge-200 text-xs text-right">
          <div className="font-bold text-forge-900">
            {Math.max(0, aiUsage.maxDailyCalls - aiUsage.callsUsedToday)} / {aiUsage.maxDailyCalls} Calls Remaining Today
          </div>
          <div className="text-[11px] text-forge-500">Resets automatically at midnight</div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl border border-forge-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-forge-800">
            Paste Target Job Description (Max 20,000 characters)
          </label>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-forge-500 font-medium">Evaluate with Resume:</span>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              disabled={resumes.length === 0}
              className="p-1.5 border border-forge-300 rounded font-semibold bg-white"
            >
              {resumes.length === 0 ? (
                <option value="">No resumes created yet</option>
              ) : (
                resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} (v{r.meta.version})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <textarea
          rows={7}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste requirements, qualifications, and role responsibilities here..."
          className="w-full text-xs p-3 border border-forge-300 rounded-lg focus:ring-1 focus:ring-forge-900 font-mono"
        />

        <div className="flex justify-between items-center pt-1">
          <span className="text-[11px] text-forge-400">
            Character count: {jobDescription.length} / 20,000 max
          </span>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="px-5 py-2.5 bg-forge-900 text-white font-bold text-xs rounded-lg hover:bg-forge-800 disabled:opacity-50 transition-colors shadow-sm flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isAnalyzing ? 'Evaluating Evidence...' : 'Run Honest Match & Tailor Check'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Section 26: Match Score Card */}
          <div className="bg-white p-6 rounded-2xl border border-forge-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold text-forge-400 uppercase tracking-wider">
                Verifiable Qualifications Alignment
              </span>
              <div className="text-4xl sm:text-5xl font-black text-forge-900 flex items-center justify-center md:justify-start space-x-3">
                <span>{analysisResult.matchScore}%</span>
                <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Target Fit
                </span>
              </div>
              <p className="text-xs text-forge-500">
                Target Role: <strong>{analysisResult.jobTitle}</strong> at <strong>{analysisResult.company}</strong>
              </p>
            </div>

            {/* Matches & Gaps breakdown */}
            <div className="grid grid-cols-3 gap-3 text-xs text-center w-full md:w-auto">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-700 font-bold block text-sm">
                  {analysisResult.strongMatches.length}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold uppercase">Strong Matches</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-blue-700 font-bold block text-sm">
                  {analysisResult.partialMatches.length}
                </span>
                <span className="text-[10px] text-blue-800 font-semibold uppercase">Partial Matches</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-amber-700 font-bold block text-sm">
                  {analysisResult.gaps.length}
                </span>
                <span className="text-[10px] text-amber-800 font-semibold uppercase">Genuine Gaps</span>
              </div>
            </div>
          </div>

          {/* Matches & Gaps Lists (Section 26) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strong Matches */}
            <div className="bg-white p-5 rounded-2xl border border-forge-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Strong Matches ({analysisResult.strongMatches.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.strongMatches.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Partial Matches */}
            <div className="bg-white p-5 rounded-2xl border border-forge-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Partial Matches ({analysisResult.partialMatches.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.partialMatches.length === 0 ? (
                  <span className="text-xs text-forge-400">None</span>
                ) : (
                  analysisResult.partialMatches.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200"
                    >
                      △ {m}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Gaps (Never hallucinated onto resume!) */}
            <div className="bg-white p-5 rounded-2xl border border-forge-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Genuine Gaps ({analysisResult.gaps.length})</span>
              </div>
              <p className="text-[11px] text-forge-500">
                Per Honest AI rules, these skills are <strong>not</strong> in your profile and must <strong>never</strong> be added to your resume unless acquired.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.gaps.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    ○ {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 27: Controlled Job-Specific Resume Tailoring */}
          <div className="bg-white p-6 rounded-2xl border border-forge-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-forge-900">
                Controlled Tailoring Suggestions (Individual Review Required)
              </h2>
              <p className="text-xs text-forge-500">
                Review proposed reorderings or action-bullet adjustments. You have full individual control.
              </p>
            </div>

            <div className="space-y-4">
              {analysisResult.tailoringSuggestions.map((sug) => {
                const status = acceptedChanges[sug.id];

                return (
                  <div
                    key={sug.id}
                    className="p-4 rounded-xl border border-forge-200 bg-forge-50/50 space-y-3 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-forge-900 uppercase tracking-wider text-[11px]">
                        Target Section: {sug.section}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forge-200 text-forge-800 font-bold">
                        {sug.evidenceStatus}
                      </span>
                    </div>

                    {/* Before & After (Section 27) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-lg border border-forge-200">
                        <span className="text-[10px] uppercase font-bold text-forge-400 block mb-1">Before:</span>
                        <p className="text-forge-700">{sug.before}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-emerald-300">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">After (Tailored):</span>
                        <p className="text-emerald-950 font-semibold">{sug.after}</p>
                      </div>
                    </div>

                    {/* Reason & Evidence (Section 27) */}
                    <div className="bg-white p-3 rounded-lg border border-forge-200 space-y-1 text-[11px]">
                      <div>
                        <strong className="text-forge-800">Reason: </strong>
                        <span className="text-forge-600">{sug.reason}</span>
                      </div>
                      <div>
                        <strong className="text-forge-800">Verifiable Profile Evidence: </strong>
                        <span className="text-forge-600">{sug.evidence}</span>
                      </div>
                    </div>

                    {/* Individual Accept / Reject Buttons */}
                    <div className="flex justify-end space-x-2 pt-1">
                      {status === true ? (
                        <span className="text-emerald-700 font-bold flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Accepted</span>
                        </span>
                      ) : status === false ? (
                        <span className="text-rose-600 font-semibold flex items-center space-x-1">
                          <X className="w-3.5 h-3.5" />
                          <span>Rejected</span>
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRejectSuggestion(sug.id)}
                            className="px-3 py-1.5 text-xs text-forge-600 hover:text-rose-600 rounded hover:bg-forge-100"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAcceptSuggestion(sug.id)}
                            className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700 shadow-sm flex items-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept Suggestion</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AI Privacy Modal */}
      <AIPrivacyModal
        isOpen={privacyModalOpen}
        onAccept={() => {
          setPrivacyModalOpen(false);
          handleAnalyze();
        }}
        onCancel={() => setPrivacyModalOpen(false)}
      />
    </div>
  );
};
