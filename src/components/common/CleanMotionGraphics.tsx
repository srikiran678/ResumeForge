import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  FileText, 
  Terminal, 
  Sparkles, 
  Check, 
  Play, 
  RotateCcw,
  ShieldCheck,
  Search,
  Eye
} from 'lucide-react';

interface ScanCheckpoint {
  id: string;
  label: string;
  field: string;
  detail: string;
}

const CHECKPOINTS: ScanCheckpoint[] = [
  { id: 'basics', label: 'Candidate Identity', field: 'Candidate Profile • Software Engineer', detail: 'Plain text contact without icon artifacts' },
  { id: 'edu', label: 'Education & Honors', field: 'Accredited University • B.S. in CS (GPA 3.86)', detail: 'Degree level and graduation date verified' },
  { id: 'exp', label: 'Work Experience', field: 'Software Engineer Intern • Cloud & Systems', detail: 'Action verbs + quantified metrics detected' },
  { id: 'skills', label: 'Keyword Taxonomies', field: 'Python, TypeScript, SQL, Docker, Go', detail: 'Categorized technical keywords mapped' },
  { id: 'flow', label: 'Natural Reading Order', field: 'Single-Column Logical Flow', detail: 'Passes plain-text Notepad test with 100% fidelity' },
];

export const CleanATSScanner: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  useEffect(() => {
    let interval: any;
    if (isScanning) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= CHECKPOINTS.length - 1) {
            setIsScanning(false);
            return CHECKPOINTS.length - 1;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleRestartScan = () => {
    setActiveStep(0);
    setIsScanning(true);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden text-left">
      {/* Top ATS Status Bar */}
      <div className="bg-slate-900 px-5 py-3 text-white flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono font-bold tracking-tight text-slate-100">
            ATS Reading Order Simulation
          </span>
        </div>
        <button
          onClick={handleRestartScan}
          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-emerald-400 transition-colors"
        >
          {isScanning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Search className="w-3 h-3 text-emerald-400" />
              </motion.div>
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-3 h-3" />
              <span>Re-scan</span>
            </>
          )}
        </button>
      </div>

      {/* Realistic Resume Sheet with Smooth Scanning Bar */}
      <div className="p-6 relative bg-gradient-to-b from-white to-slate-50/60 overflow-hidden">
        {/* Subtle, refined scanning beam */}
        {isScanning && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: ['0%', '95%', '0%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.7)] pointer-events-none z-20"
          />
        )}

        {/* Document Content */}
        <div className="space-y-4 text-xs font-sans">
          {/* Header Section */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              activeStep === 0
                ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300 shadow-xs'
                : 'border-transparent'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-wide">
                  Alex Taylor
                </h3>
                <p className="text-[11px] text-slate-500">
                  Seattle, WA • alex.taylor@example.com • github.com/alextaylor
                </p>
              </div>
              {activeStep >= 0 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Parsed Identity</span>
                </span>
              )}
            </div>
          </div>

          {/* Education */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              activeStep === 1
                ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300 shadow-xs'
                : 'border-transparent'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                Education
              </h4>
              {activeStep >= 1 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>GPA 3.86</span>
                </span>
              )}
            </div>
            <p className="font-semibold text-slate-800 text-[11px]">
              University of Washington — B.S. in Computer Science
            </p>
            <p className="text-[10px] text-slate-500">
              Coursework: Algorithms, Operating Systems, Database Management Systems
            </p>
          </div>

          {/* Experience */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              activeStep === 2
                ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300 shadow-xs'
                : 'border-transparent'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                Work Experience
              </h4>
              {activeStep >= 2 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Quantified Metrics</span>
                </span>
              )}
            </div>
            <p className="font-semibold text-slate-800 text-[11px]">
              Software Engineer Intern — CloudFlow Technologies
            </p>
            <p className="text-[10px] text-slate-600">
              • Engineered asynchronous Go telemetry service, reducing API response latency by 32%.
            </p>
          </div>

          {/* Skills */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              activeStep >= 3
                ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300 shadow-xs'
                : 'border-transparent'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                Technical Skills
              </h4>
              {activeStep >= 3 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>5 Categories</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {['Python', 'TypeScript', 'SQL', 'Docker', 'Go', 'React', 'PostgreSQL'].map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px] font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time ATS Parsing Verification Checklist */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1">
          <span>PARSER AUDIT CHECKLIST</span>
          <span className="text-emerald-700 font-bold">
            {activeStep + 1} of {CHECKPOINTS.length} Passed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CHECKPOINTS.map((chk, idx) => (
            <div
              key={chk.id}
              className={`p-2 rounded-lg border text-[11px] flex items-start space-x-2 transition-colors ${
                idx <= activeStep
                  ? 'bg-white border-emerald-200 text-slate-800'
                  : 'bg-slate-100/60 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {idx <= activeStep ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                )}
              </div>
              <div className="truncate">
                <span className="font-bold block truncate">{chk.label}</span>
                <span className="text-[10px] text-slate-500 truncate block">{chk.field}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CleanFloatingBadge: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay?: number;
}> = ({ icon, title, subtitle, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow text-left space-y-1"
    >
      <div className="flex items-center space-x-2">
        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h4 className="text-xs font-bold text-slate-900">{title}</h4>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug pl-9">{subtitle}</p>
    </motion.div>
  );
};
