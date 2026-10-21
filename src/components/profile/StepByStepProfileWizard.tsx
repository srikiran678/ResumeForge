import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Briefcase, 
  Sparkles, 
  Camera, 
  Plus, 
  Trash2, 
  Layout, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { MasterProfile, TemplateId, ExperienceItem, EducationItem, ProjectItem } from '../../types';
import { getAllTemplates } from '../../templates';
import { ResumePhotoUploadModal } from './ResumePhotoUploadModal';

interface StepByStepProfileWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (newResumeId?: string) => void;
}

const QUICK_SKILL_SUGGESTIONS: Record<string, string[]> = {
  languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'C++', 'SQL', 'Rust'],
  frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'TailwindCSS', 'Vue.js', 'Django', 'FastAPI'],
  libraries: ['Redux', 'Prisma', 'Zod', 'Pandas', 'NumPy', 'TensorFlow', 'RxJS'],
  cloud: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'GCP', 'Terraform', 'Azure'],
  databases: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB', 'Supabase'],
  tools: ['Git', 'Vite', 'REST APIs', 'GraphQL', 'Linux', 'Jest', 'Figma', 'Webpack'],
  other: ['Agile / Scrum', 'System Design', 'Microservices', 'Clean Architecture', 'CI/CD Pipelines'],
};

export const StepByStepProfileWizard: React.FC<StepByStepProfileWizardProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const navigate = useNavigate();
  const { masterProfile, updateMasterProfile, createResume } = useWorkspace();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);

  // Form working copy initialized from masterProfile
  const [formData, setFormData] = useState<MasterProfile>({
    ...masterProfile,
    personalInfo: { ...masterProfile.personalInfo },
    education: masterProfile.education ? [...masterProfile.education] : [],
    experience: masterProfile.experience ? [...masterProfile.experience] : [],
    projects: masterProfile.projects ? [...masterProfile.projects] : [],
    skills: {
      languages: [...(masterProfile.skills?.languages || [])],
      frameworks: [...(masterProfile.skills?.frameworks || [])],
      libraries: [...(masterProfile.skills?.libraries || [])],
      databases: [...(masterProfile.skills?.databases || [])],
      cloud: [...(masterProfile.skills?.cloud || [])],
      tools: [...(masterProfile.skills?.tools || [])],
      other: [...(masterProfile.skills?.other || [])],
    },
  });

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [newSkillText, setNewSkillText] = useState('');
  const [activeSkillCategory, setActiveSkillCategory] = useState<keyof typeof formData.skills>('languages');

  if (!isOpen) return null;

  const totalSteps = 7; // Step 0 is Entry Choice, Steps 1-6 are forms, Step 7 is Finish/Template

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSaveAndGenerate = () => {
    // 1. Update the default master profile in workspace & localStorage
    updateMasterProfile(formData);

    // 2. Create the first resume pre-filled from this master profile
    const role = formData.personalInfo.label || 'Software Engineer';
    const title = `${formData.personalInfo.fullName || 'Professional'} Resume`;
    const newResume = createResume(title, role, '', selectedTemplate);

    if (onCompleted) {
      onCompleted(newResume.id);
    } else {
      onClose();
      navigate(`/editor/${newResume.id}`);
    }
  };

  const handleAddSkill = (skill: string, category: keyof typeof formData.skills) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (formData.skills[category].includes(trimmed)) return;

    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...prev.skills[category], trimmed],
      },
    }));
  };

  const handleRemoveSkill = (skill: string, category: keyof typeof formData.skills) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((s) => s !== skill),
      },
    }));
  };

  const allTemplates = getAllTemplates();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#121316] rounded-3xl shadow-2xl max-w-4xl w-full p-5 sm:p-7 text-left border border-slate-200 dark:border-white/[0.08] max-h-[92vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="size-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white font-display">
                  {currentStep === 0 ? 'Resume Setup & Profile Wizard' : `Default Profile Setup (${currentStep}/${totalSteps})`}
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  AI Source of Truth
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Save your details once. The AI uses this default master profile to tailor and generate any resume.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close wizard"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar (Shown after step 0) */}
        {currentStep > 0 && (
          <div className="py-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Step {currentStep} of {totalSteps}: {
                [
                  '',
                  'Personal Info',
                  'Professional Summary',
                  'Work Experience',
                  'Education',
                  'Skills & Tools',
                  'Key Projects',
                  'Pick ATS Template'
                ][currentStep]
              }</span>
              <span className="font-mono font-semibold">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Wizard Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          {/* STEP 0: Initial Decision Point */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2 py-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>How would you like to build your profile?</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                  Choose the fastest way to get started
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Do you already have a resume on paper or as a file? Upload a photo or PDF to auto-extract, or fill your details step-by-step.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {/* Option A: Upload Photo or Document */}
                <button
                  type="button"
                  onClick={() => setShowPhotoUploadModal(true)}
                  className="p-5 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800/80 bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-all group flex flex-col justify-between space-y-4 cursor-pointer"
                >
                  <div className="size-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-bold text-slate-950 dark:text-white">
                        Upload Photo of Resume
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                        Fastest
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Snap a picture from your phone or upload an image/PDF. Our OCR scanner parses your details automatically into your profile.
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-1">
                    <span>Upload & Scan Image</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Option B: Guided Step-by-Step */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#16171c] hover:bg-slate-50 dark:hover:bg-[#1a1b22] text-left transition-all group flex flex-col justify-between space-y-4 cursor-pointer shadow-xs"
                >
                  <div className="size-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-950 dark:text-white">
                      Fill Details One by One
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Answer step-by-step questions to save your contact info, experience, education, and skills. AI will build your resume cleanly.
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-bold text-slate-900 dark:text-white pt-1">
                    <span>Start Guided Form</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Quick Template Browse option */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(7)}
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Or browse the 10 top professional ATS templates directly</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div>
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                  Step 1: Personal & Contact Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Your core contact details saved by default. Every generated resume starts with this.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.personalInfo.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                      }))
                    }
                    placeholder="e.g. Alex Morgan"
                    className="w-full text-xs p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Target Job Title / Headline
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.label}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, label: e.target.value },
                      }))
                    }
                    placeholder="e.g. Full-Stack Software Engineer | Distributed Systems"
                    className="w-full text-xs p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.personalInfo.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value },
                      }))
                    }
                    placeholder="alex@example.com"
                    className="w-full text-xs p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value },
                      }))
                    }
                    placeholder="+1 (555) 019-2834"
                    className="w-full text-xs p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Location (City, State / Country)
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value },
                      }))
                    }
                    placeholder="San Francisco, CA"
                    className="w-full text-xs p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Portfolio / Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.personalInfo.portfolio || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, portfolio: e.target.value },
                      }))
                    }
                    placeholder="https://alexmorgan.dev"
                    className="w-full text-xs p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    GitHub Profile
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.github || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, github: e.target.value },
                      }))
                    }
                    placeholder="https://github.com/alexmorgan"
                    className="w-full text-xs p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.linkedIn || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, linkedIn: e.target.value },
                      }))
                    }
                    placeholder="https://linkedin.com/in/alexmorgan"
                    className="w-full text-xs p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Professional Summary */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div>
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                  Step 2: Professional Career Summary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  A high-impact 2-3 sentence overview of your background, technical expertise, and career value.
                </p>
              </div>

              <div>
                <textarea
                  rows={5}
                  value={formData.personalInfo.summary || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, summary: e.target.value },
                    }))
                  }
                  placeholder="e.g. Versatile Full-Stack Engineer with 3+ years of experience designing and shipping high-throughput distributed applications in TypeScript, React, and Go. Proven track record reducing API latency by 45% and architecting microservices that scale to 500k+ active users."
                  className="w-full text-xs p-3 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              {/* Quick Starters */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Quick Starter Templates (Click to fill):</span>
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Full-Stack Software Engineer with expertise in modern React, TypeScript, and cloud services. Experienced in building end-to-end features, optimizing database queries, and collaborating in agile distributed teams.",
                    "Frontend Engineer focused on modern UI/UX design systems, accessibility (WCAG), and responsive web applications. Proven ability delivering fast, pixel-perfect web apps with React and TailwindCSS.",
                    "Backend & Systems Engineer specializing in high-concurrency microservices, REST/GraphQL APIs, and Docker containerization. Passionate about developer tooling and performance optimization."
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, summary: preset },
                        }))
                      }
                      className="p-2.5 text-left text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.03] hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-white/[0.06] rounded-xl transition-colors cursor-pointer"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Work Experience */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                    Step 3: Work Experience ({formData.experience.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Your professional roles, internships, and contract positions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newExp: ExperienceItem = {
                      id: `exp_${Date.now()}`,
                      company: '',
                      position: '',
                      location: '',
                      startDate: '',
                      endDate: 'Present',
                      current: true,
                      responsibilities: ['Engineered scalable application features using modern engineering practices.'],
                    };
                    setFormData((prev) => ({
                      ...prev,
                      experience: [...prev.experience, newExp],
                    }));
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              {formData.experience.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/[0.08] rounded-2xl space-y-2">
                  <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    No work experience added yet. Click "+ Add Role" or proceed if you're a student/recent graduate.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.experience.map((exp, eIdx) => (
                    <div key={exp.id} className="p-4 bg-slate-50 dark:bg-[#16171c] rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Role #{eIdx + 1}: {exp.position || 'Untitled Role'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              experience: prev.experience.filter((_, idx) => idx !== eIdx),
                            }))
                          }
                          className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData((prev) => {
                                const updated = [...prev.experience];
                                updated[eIdx].company = val;
                                return { ...prev, experience: updated };
                              });
                            }}
                            placeholder="e.g. Acme Corp"
                            className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Position / Title</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData((prev) => {
                                const updated = [...prev.experience];
                                updated[eIdx].position = val;
                                return { ...prev, experience: updated };
                              });
                            }}
                            placeholder="e.g. Frontend Developer"
                            className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData((prev) => {
                                const updated = [...prev.experience];
                                updated[eIdx].startDate = val;
                                return { ...prev, experience: updated };
                              });
                            }}
                            placeholder="e.g. 2022"
                            className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData((prev) => {
                                const updated = [...prev.experience];
                                updated[eIdx].endDate = val;
                                return { ...prev, experience: updated };
                              });
                            }}
                            placeholder="e.g. Present"
                            className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Responsibilities Bullets */}
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          Impact Bullet Points:
                        </label>
                        {(exp.responsibilities || []).map((b, bIdx) => (
                          <div key={bIdx} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={b}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormData((prev) => {
                                  const updated = [...prev.experience];
                                  updated[eIdx].responsibilities[bIdx] = val;
                                  return { ...prev, experience: updated };
                                });
                              }}
                              placeholder="e.g. Reduced server response times by 35% through Redis caching..."
                              className="flex-1 text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => {
                                  const updated = [...prev.experience];
                                  updated[eIdx].responsibilities = updated[eIdx].responsibilities.filter((_, idx) => idx !== bIdx);
                                  return { ...prev, experience: updated };
                                });
                              }}
                              className="text-slate-400 hover:text-rose-500 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => {
                              const updated = [...prev.experience];
                              updated[eIdx].responsibilities.push('');
                              return { ...prev, experience: updated };
                            });
                          }}
                          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          + Add bullet point
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Education */}
          {currentStep === 4 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                    Step 4: Education & Degrees ({formData.education.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Universities, colleges, bootcamps, and relevant coursework.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newEdu: EducationItem = {
                      id: `edu_${Date.now()}`,
                      institution: '',
                      degree: 'Bachelor of Science',
                      field: 'Computer Science',
                      startDate: '',
                      endDate: '2024',
                      current: false,
                      cgpa: '3.8/4.0',
                      coursework: ['Data Structures', 'Algorithms', 'Databases'],
                    };
                    setFormData((prev) => ({
                      ...prev,
                      education: [...prev.education, newEdu],
                    }));
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {formData.education.map((edu, eduIdx) => (
                <div key={edu.id} className="p-4 bg-slate-50 dark:bg-[#16171c] rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {edu.degree} — {edu.institution || 'University'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          education: prev.education.filter((_, idx) => idx !== eduIdx),
                        }))
                      }
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">University / School</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.education];
                            updated[eduIdx].institution = val;
                            return { ...prev, education: updated };
                          });
                        }}
                        placeholder="e.g. Stanford University"
                        className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree & Major</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.education];
                            updated[eduIdx].degree = val;
                            return { ...prev, education: updated };
                          });
                        }}
                        placeholder="e.g. B.S. in Computer Science"
                        className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Graduation Year</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.education];
                            updated[eduIdx].endDate = val;
                            return { ...prev, education: updated };
                          });
                        }}
                        placeholder="e.g. 2024"
                        className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">GPA / Honors (Optional)</label>
                      <input
                        type="text"
                        value={edu.cgpa || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.education];
                            updated[eduIdx].cgpa = val;
                            return { ...prev, education: updated };
                          });
                        }}
                        placeholder="e.g. 3.9 / 4.0, Magna Cum Laude"
                        className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: Skills */}
          {currentStep === 5 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div>
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                  Step 5: Skills & Competencies
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select and tag your skills. These are vital for ATS keyword matching and parsing.
                </p>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {[
                  { key: 'languages', label: 'Languages' },
                  { key: 'frameworks', label: 'Frameworks' },
                  { key: 'libraries', label: 'Libraries' },
                  { key: 'databases', label: 'Databases' },
                  { key: 'cloud', label: 'Cloud & DevOps' },
                  { key: 'tools', label: 'Tools' },
                  { key: 'other', label: 'Other Skills' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveSkillCategory(cat.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeSkillCategory === cat.key
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cat.label} ({formData.skills[cat.key as keyof typeof formData.skills]?.length || 0})
                  </button>
                ))}
              </div>

              {/* Active Category Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillText}
                  onChange={(e) => setNewSkillText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(newSkillText, activeSkillCategory);
                      setNewSkillText('');
                    }
                  }}
                  placeholder={`Add a skill to ${activeSkillCategory}... (Press Enter)`}
                  className="flex-1 text-xs p-2.5 border border-slate-300 dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#08090a] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddSkill(newSkillText, activeSkillCategory);
                    setNewSkillText('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Quick Add Suggestions Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Quick-add popular skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(QUICK_SKILL_SUGGESTIONS[activeSkillCategory] || []).map((sug) => {
                    const isAdded = formData.skills[activeSkillCategory]?.includes(sug);
                    return (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => {
                          if (isAdded) {
                            handleRemoveSkill(sug, activeSkillCategory);
                          } else {
                            handleAddSkill(sug, activeSkillCategory);
                          }
                        }}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                            : 'bg-white dark:bg-[#16171c] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08] hover:border-slate-300'
                        }`}
                      >
                        {isAdded ? `✓ ${sug}` : `+ ${sug}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Currently Selected Skills Pills */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#16171c] rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-2">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Selected in {activeSkillCategory}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.skills[activeSkillCategory] || []).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#08090a] text-slate-900 dark:text-white border border-slate-200 dark:border-white/[0.08] shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill, activeSkillCategory)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(formData.skills[activeSkillCategory] || []).length === 0 && (
                    <span className="text-xs text-slate-400 italic">No skills added to this category yet.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Projects */}
          {currentStep === 6 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                    Step 6: Featured Projects & Portfolio ({formData.projects.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Flagship applications, open source libraries, and hackathon projects.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newProj: ProjectItem = {
                      id: `proj_${Date.now()}`,
                      name: '',
                      description: '',
                      highlights: ['Built and architected end-to-end full stack system.'],
                      technologies: ['React', 'TypeScript', 'Node.js'],
                      url: '',
                      githubUrl: '',
                    };
                    setFormData((prev) => ({
                      ...prev,
                      projects: [...prev.projects, newProj],
                    }));
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {formData.projects.map((proj, pIdx) => (
                <div key={proj.id} className="p-4 bg-slate-50 dark:bg-[#16171c] rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Project #{pIdx + 1}: {proj.name || 'Untitled Project'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          projects: prev.projects.filter((_, idx) => idx !== pIdx),
                        }))
                      }
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.projects];
                            updated[pIdx].name = val;
                            return { ...prev, projects: updated };
                          });
                        }}
                        placeholder="e.g. Distributed Task Orchestrator"
                        className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Demo / Repository URL</label>
                      <input
                        type="url"
                        value={proj.url || proj.githubUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.projects];
                            updated[pIdx].url = val;
                            return { ...prev, projects: updated };
                          });
                        }}
                        placeholder="https://github.com/username/project"
                        className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Tech Stack (comma-separated)</label>
                      <input
                        type="text"
                        value={proj.technologies.join(', ')}
                        onChange={(e) => {
                          const val = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                          setFormData((prev) => {
                            const updated = [...prev.projects];
                            updated[pIdx].technologies = val;
                            return { ...prev, projects: updated };
                          });
                        }}
                        placeholder="e.g. React, TypeScript, GraphQL, Docker"
                        className="w-full text-xs p-2 border border-slate-300 dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#08090a] text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 7: Pick ATS Template & Save */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <div className="text-center max-w-xl mx-auto space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Select Your Design
                </span>
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                  Choose from 10 Professional ATS Templates
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  All templates use strictly single-column semantic ATS layouts that pass greenhouse, lever, workday, and taleo parsers.
                </p>
              </div>

              {/* 10 Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {allTemplates.map((template) => {
                  const isSelected = selectedTemplate === template.id;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#16171c] hover:bg-slate-50 dark:hover:bg-[#1a1b22]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-slate-950 dark:text-white">
                              {template.name}
                            </span>
                            {template.badge && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300">
                                {template.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium block mt-0.5">
                            {template.bestFor}
                          </span>
                        </div>

                        {isSelected ? (
                          <div className="size-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="size-5 rounded-full border border-slate-300 dark:border-white/[0.15] shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {template.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Confirmation Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start space-x-3 text-xs text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold">Ready to Save as Default Profile</span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Your details will be stored in your default workspace. The AI will immediately use this data to generate and tailor your resume in the editor.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between">
          <div>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <span>{currentStep === 0 ? 'Start Setup' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndGenerate}
                className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save as Default & Generate AI Resume</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Photo/Image Scanner Modal */}
      <ResumePhotoUploadModal
        isOpen={showPhotoUploadModal}
        masterProfile={formData}
        onSaveToProfile={(updated) => {
          setFormData(updated);
          setShowPhotoUploadModal(false);
          // Jump to Review/Template step
          setCurrentStep(7);
        }}
        onClose={() => setShowPhotoUploadModal(false)}
      />
    </div>
  );
};
