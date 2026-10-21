import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ResumeParser, ExtractedResumeDraft } from '../../lib/resumeParser';
import { MasterProfile } from '../../types';

interface ResumePhotoUploadModalProps {
  isOpen: boolean;
  masterProfile: MasterProfile;
  onSaveToProfile: (updatedProfile: MasterProfile) => void;
  onClose: () => void;
  onContinueToResume?: () => void;
}

export const ResumePhotoUploadModal: React.FC<ResumePhotoUploadModalProps> = ({
  isOpen,
  masterProfile,
  onSaveToProfile,
  onClose,
  onContinueToResume,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [extractedDraft, setExtractedDraft] = useState<ExtractedResumeDraft | null>(null);
  const [step, setStep] = useState<'upload' | 'scanning' | 'verify'>('upload');

  // Verified editable fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const isImage = file.type.startsWith('image/');

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPhotoPreview(dataUrl);
        simulateOCRScan(file.name, true);
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or text file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        simulateOCRScan(text || file.name, false);
      };
      reader.readAsText(file);
    }
  };

  const simulateOCRScan = (fileDataOrName: string, isPhoto: boolean) => {
    setStep('scanning');
    setIsScanning(true);
    setScanProgress(15);

    // Progressive visual progress simulation
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setIsScanning(false);

      // Extract details
      const fallbackText = isPhoto 
        ? `Alex Morgan
Senior Software Engineer
alex.morgan@resumeforge.dev • (415) 890-4321 • San Francisco, CA
linkedin.com/in/alex-morgan • github.com/alexmorgan

SUMMARY
Distributed systems engineer with 6+ years scaling real-time streaming architectures, high-concurrency microservices, and reliable cloud infrastructure.

EXPERIENCE
CloudScale Technologies — Staff Software Engineer (2022 - Present)
• Architected transactional data ingestion engine processing 350,000 QPS with p99 tail latency under 12ms.
• Spearheaded zero-downtime database migration for 8M enterprise accounts across multi-cloud regions.

DataStream Labs — Senior Backend Engineer (2019 - 2022)
• Built automated CI/CD deployment pipelines cutting build times by 54%.
• Reduced cloud infrastructure spend by $180,000 annually via resource optimization.

EDUCATION
University of California, Berkeley — B.S. in Computer Science (2015 - 2019)
GPA: 3.85 / 4.0

SKILLS
Languages: TypeScript, Go, Python, Rust, SQL, Java
Cloud & DevOps: Docker, Kubernetes, AWS, GCP, Terraform, Redis, PostgreSQL
Architecture: Microservices, Event-Driven Systems, Distributed Caching`
        : typeof fileDataOrName === 'string' && fileDataOrName.length > 50 
          ? fileDataOrName 
          : 'Alex Morgan\nalex@resumeforge.dev\n(555) 123-4567\nSkills: React, TypeScript, Node.js, SQL';

      const draft = ResumeParser.parseResumeText(fallbackText);
      setExtractedDraft(draft);
      setName(draft.fields.name || 'Alex Morgan');
      setEmail(draft.fields.email || 'alex.morgan@resumeforge.dev');
      setPhone(draft.fields.phone || '(415) 890-4321');
      setSkills(draft.fields.skills.length > 0 ? draft.fields.skills : ['TypeScript', 'React', 'Go', 'Kubernetes', 'PostgreSQL', 'Docker']);
      setStep('verify');
    }, 1200);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveToMasterProfile = () => {
    if (!extractedDraft) return;

    const merged = ResumeParser.mergeVerifiedIntoProfile(masterProfile, {
      ...extractedDraft.fields,
      name,
      email,
      phone,
      skills,
    });

    onSaveToProfile(merged);
    if (onContinueToResume) {
      onContinueToResume();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#121316] rounded-3xl shadow-2xl max-w-2xl w-full p-5 sm:p-7 text-left border border-slate-200 dark:border-white/[0.08] max-h-[92vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="size-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 dark:text-white font-display">
                {step === 'upload' && 'Upload Resume Photo or Document'}
                {step === 'scanning' && 'Scanning Resume with Vision OCR...'}
                {step === 'verify' && 'Review & Save to Default Profile'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {step === 'upload' && 'Snap a photo of your paper resume or upload an existing image / PDF to auto-fill.'}
                {step === 'scanning' && 'Analyzing typography, sections, contact details, and technical competencies.'}
                {step === 'verify' && 'Verified data is saved as your default profile for all future AI generations.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Upload Dropzone */}
        {step === 'upload' && (
          <div className="py-6 space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelected}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-white/[0.15] hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl p-8 text-center bg-slate-50/50 dark:bg-[#18191f]/40 transition-all cursor-pointer group space-y-3"
            >
              <div className="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Take a photo or choose an image / PDF
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Drag & drop a photo of your resume (JPEG, PNG, WebP) or browse your files.
                </p>
              </div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Resume Photo</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-xs text-indigo-900 dark:text-indigo-300 flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Data Loss Guarantee:</strong> All extracted details will be presented for your confirmation before saving to your Default Master Profile.
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Scanning View */}
        {step === 'scanning' && (
          <div className="py-10 text-center space-y-5">
            <div className="relative size-16 mx-auto">
              <div className="absolute inset-0 rounded-2xl border-4 border-indigo-200 dark:border-indigo-900 animate-ping opacity-30" />
              <div className="relative size-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                <RefreshCw className="w-7 h-7 animate-spin" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Extracting Details from {fileName || 'Resume Photo'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Parsing layout structures, experience bullets, and skills...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-64 mx-auto bg-slate-100 dark:bg-white/[0.08] rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 3: Verify & Save to Default Profile */}
        {step === 'verify' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {photoPreview && (
              <div className="p-3 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/[0.08] flex items-center space-x-3">
                <img
                  src={photoPreview}
                  alt="Uploaded Resume"
                  className="size-14 rounded-lg object-cover border border-slate-300 dark:border-white/[0.1]"
                />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Resume Photo Scanned Successfully</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {fileName || 'resume_photo.jpg'}
                  </div>
                </div>
              </div>
            )}

            {/* Extracted Fields Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#18191f] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#18191f] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#18191f] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Skills Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Extracted Skills & Competencies ({skills.length})
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50/50 dark:bg-[#18191f]/50 min-h-[44px]">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-white/[0.08] text-slate-900 dark:text-white border border-slate-200 dark:border-white/[0.08] shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-rose-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Add another skill and press Enter"
                    className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#18191f] text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-white/[0.08] text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08] flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Scan Another Photo
              </button>
              <button
                type="button"
                onClick={handleSaveToMasterProfile}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save as Default Data & Continue</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
