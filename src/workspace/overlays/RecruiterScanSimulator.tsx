import React, { useState, useEffect } from 'react';
import { Eye, Clock, Sparkles, CheckCircle2, X, Play, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeData } from '../../data/types';

export const RecruiterScanSimulator: React.FC<{
  isOpen: boolean;
  resume?: ResumeData;
  onClose: () => void;
}> = ({ isOpen, resume, onClose }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (isScanning) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= 4) {
            setIsScanning(false);
            return 4;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  if (!isOpen) return null;

  const candidateName = resume?.basics?.name || 'Candidate';
  const candidateTitle = resume?.basics?.label || 'Software Engineer';
  const topCompany = resume?.work?.[0]?.company || 'Tech Company';
  const topProject = resume?.projects?.[0]?.name || 'Flagship Project';
  const topSkills = resume?.skills?.[0]?.items?.slice(0, 3).join(', ') || 'Python, TypeScript, React';
  const education = resume?.education?.[0]?.institution || 'University';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 text-left border border-slate-200 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recruiter 6-Second Scan Simulator</h3>
              <p className="text-[11px] text-slate-500">
                Eye-tracking simulation based on Ladders & Jobscan recruiter research
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Eye Tracking Map Trajectory */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <p className="text-slate-600 leading-relaxed">
              Technical recruiters scan incoming applications in an <strong>"F-pattern"</strong> trajectory over an average of <strong>6 to 7.4 seconds</strong>:
            </p>
            <button
              onClick={() => {
                setActiveStep(0);
                setIsScanning(true);
              }}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-xs shrink-0 shadow-sm ml-2"
            >
              {isScanning ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate 6s Scan</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <div
              className={`p-3 rounded-xl border transition-all ${
                activeStep === 0
                  ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300 shadow-md scale-[1.01]'
                  : 'bg-slate-50 border-slate-200 opacity-90'
              } flex items-start space-x-3`}
            >
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="text-slate-900 block">
                  Name & Target Title (0.8s): <span className="text-blue-700">{candidateName} • {candidateTitle}</span>
                </strong>
                <span className="text-[11px] text-slate-500">
                  Verifies candidate identity, role target, and immediate geographic eligibility.
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border transition-all ${
                activeStep === 1
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-md scale-[1.01]'
                  : 'bg-slate-50 border-slate-200 opacity-90'
              } flex items-start space-x-3`}
            >
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="text-slate-900 block">
                  Recent Experience / Role (1.8s): <span className="text-emerald-700">{topCompany}</span>
                </strong>
                <span className="text-[11px] text-slate-500">
                  Scans company, job title, and the first 2 bullet points for action verbs and concrete deliverables.
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border transition-all ${
                activeStep === 2
                  ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-300 shadow-md scale-[1.01]'
                  : 'bg-slate-50 border-slate-200 opacity-90'
              } flex items-start space-x-3`}
            >
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="text-slate-900 block">
                  Core Technical Skills (1.4s): <span className="text-purple-700">{topSkills}</span>
                </strong>
                <span className="text-[11px] text-slate-500">
                  Checks programming languages and frameworks against the job requirements.
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border transition-all ${
                activeStep === 3
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-md scale-[1.01]'
                  : 'bg-slate-50 border-slate-200 opacity-90'
              } flex items-start space-x-3`}
            >
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <strong className="text-slate-900 block">
                  Featured Project & Architecture (1.5s): <span className="text-amber-700">{topProject}</span>
                </strong>
                <span className="text-[11px] text-slate-500">
                  Checks for live demo URLs, GitHub repositories, and full-stack ownership.
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border transition-all ${
                activeStep === 4
                  ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-300 shadow-md scale-[1.01]'
                  : 'bg-slate-50 border-slate-200 opacity-90'
              } flex items-start space-x-3`}
            >
              <span className="w-6 h-6 rounded-full bg-slate-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                5
              </span>
              <div>
                <strong className="text-slate-900 block">
                  Education & Graduation (0.7s): <span className="text-slate-700">{education}</span>
                </strong>
                <span className="text-[11px] text-slate-500">
                  Verifies degree level and internship availability season.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <span className="text-[11px] text-slate-400">
            Total scan time: ~6.2 seconds
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
