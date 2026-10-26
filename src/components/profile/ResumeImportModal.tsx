import React, { useState } from 'react';
import { Upload, Check, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { ResumeParser, ExtractedResumeDraft } from '../../lib/resumeParser';
import { MasterProfile } from '../../types';

interface ResumeImportModalProps {
  isOpen: boolean;
  masterProfile: MasterProfile;
  onSaveToProfile: (updatedProfile: MasterProfile) => void;
  onClose: () => void;
}

export const ResumeImportModal: React.FC<ResumeImportModalProps> = ({
  isOpen,
  masterProfile,
  onSaveToProfile,
  onClose,
}) => {
  const [step, setStep] = useState<'upload' | 'verify'>('upload');
  const [extractedDraft, setExtractedDraft] = useState<ExtractedResumeDraft | null>(null);
  const [rawTextInput, setRawTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Editable draft states
  const [verifiedName, setVerifiedName] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [verifiedSkills, setVerifiedSkills] = useState<string[]>([]);
  const [verifiedEduCount, setVerifiedEduCount] = useState(0);
  const [verifiedProjCount, setVerifiedProjCount] = useState(0);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      processText(content);
    };

    reader.onerror = () => {
      alert('Failed to read file. Please paste plain text instead.');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const processText = (text: string) => {
    const draft = ResumeParser.parseResumeText(text);
    setExtractedDraft(draft);
    setVerifiedName(draft.fields.name || masterProfile.personalInfo.fullName);
    setVerifiedEmail(draft.fields.email || masterProfile.personalInfo.email);
    setVerifiedPhone(draft.fields.phone || masterProfile.personalInfo.phone);
    setVerifiedSkills(draft.fields.skills);
    setVerifiedEduCount(draft.fields.education.length);
    setVerifiedProjCount(draft.fields.projects.length);
    setIsProcessing(false);
    setStep('verify');
  };

  const handleSaveVerified = () => {
    if (!extractedDraft) return;

    const merged = ResumeParser.mergeVerifiedIntoProfile(masterProfile, {
      ...extractedDraft.fields,
      name: verifiedName,
      email: verifiedEmail,
      phone: verifiedPhone,
      skills: verifiedSkills,
    });

    onSaveToProfile(merged);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 text-left border border-forge-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-forge-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-forge-100 flex items-center justify-center text-forge-800">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-forge-900">
                {step === 'upload' ? 'Import Existing Resume' : 'Verify Extracted Information'}
              </h2>
              <p className="text-[11px] text-forge-500">
                {step === 'upload'
                  ? 'Upload or paste resume text to automatically populate your Master Profile'
                  : 'ResumeForge never automatically assumes extracted data is verified'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-forge-400 hover:text-forge-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Upload / Input */}
        {step === 'upload' && (
          <div className="py-4 space-y-4 flex-1 overflow-y-auto">
            {/* File Dropzone */}
            <div className="border-2 border-dashed border-forge-200 rounded-xl p-8 text-center bg-forge-50 hover:bg-forge-100/60 transition-colors">
              <Upload className="w-8 h-8 text-forge-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-forge-900 mb-1">
                Upload Resume File (.txt, .md, .json)
              </div>
              <p className="text-[11px] text-forge-500 mb-4">
                Structured text streams are parsed safely client-side.
              </p>
              <label className="cursor-pointer px-4 py-2 bg-forge-900 text-white rounded-lg text-xs font-semibold hover:bg-forge-800 transition-colors shadow-sm inline-block">
                <span>Select File from Computer</span>
                <input
                  type="file"
                  accept=".txt,.md,.json,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct Text Paste Option */}
            <div>
              <label className="block text-xs font-semibold text-forge-700 mb-1">
                Or Paste Resume Text Directly:
              </label>
              <textarea
                rows={6}
                value={rawTextInput}
                onChange={(e) => setRawTextInput(e.target.value)}
                placeholder="Paste the full text of your resume here (Summary, Education, Experience, Projects, Skills)..."
                className="w-full text-xs p-3 border border-forge-300 rounded-lg focus:ring-1 focus:ring-forge-900 bg-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={!rawTextInput.trim() || isProcessing}
                onClick={() => processText(rawTextInput)}
                className="px-4 py-2 text-xs font-bold bg-forge-900 text-white hover:bg-forge-800 disabled:opacity-40 rounded-lg transition-colors flex items-center space-x-1.5"
              >
                <span>Extract Sections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Verification Screen (Section 17 requirement) */}
        {step === 'verify' && extractedDraft && (
          <div className="py-4 space-y-4 flex-1 overflow-y-auto">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start space-x-2 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <strong>Please verify before saving.</strong> AI and heuristic parsers can misread dates or formatting. Confirm each field below before adding to your Master Profile.
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Candidate Name</label>
                  <input
                    type="text"
                    value={verifiedName}
                    onChange={(e) => setVerifiedName(e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={verifiedEmail}
                    onChange={(e) => setVerifiedEmail(e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={verifiedPhone}
                    onChange={(e) => setVerifiedPhone(e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded bg-white"
                  />
                </div>
              </div>

              {/* Extraction Summary Badges */}
              <div className="p-3 bg-forge-50 rounded-lg border border-forge-200 space-y-2">
                <div className="text-xs font-bold text-forge-800">Detected Sections Summary:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border border-forge-200">
                    <span className="text-forge-500 block text-[10px]">Education</span>
                    <strong className="text-forge-900">{verifiedEduCount} degree(s)</strong>
                  </div>
                  <div className="p-2 bg-white rounded border border-forge-200">
                    <span className="text-forge-500 block text-[10px]">Projects</span>
                    <strong className="text-forge-900">{verifiedProjCount} project(s)</strong>
                  </div>
                  <div className="p-2 bg-white rounded border border-forge-200">
                    <span className="text-forge-500 block text-[10px]">Experience</span>
                    <strong className="text-forge-900">{extractedDraft.fields.experience.length} role(s)</strong>
                  </div>
                  <div className="p-2 bg-white rounded border border-forge-200">
                    <span className="text-forge-500 block text-[10px]">Skills</span>
                    <strong className="text-forge-900">{verifiedSkills.length} skill(s)</strong>
                  </div>
                </div>
              </div>

              {/* Extracted Skills List */}
              {verifiedSkills.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-forge-700 mb-1">Extracted Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {verifiedSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-forge-100 text-forge-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-3 border-t border-forge-100">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-3 py-1.5 text-xs text-forge-600 hover:text-forge-900"
              >
                ← Back to Upload
              </button>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-forge-600 hover:text-forge-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveVerified}
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept & Save to Master Profile</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
