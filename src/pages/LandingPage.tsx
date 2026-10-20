import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  FileCheck, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Terminal, 
  Briefcase,
  Zap,
  Lock,
  Download,
  Eye,
  Check,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CleanATSScanner, CleanFloatingBadge } from '../components/common/CleanMotionGraphics';
import { GoogleIcon } from '../components/common/GoogleIcon';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  // Instant Starting Card State: Sign Up, Sign In
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    if (authMode === 'signup') {
      const res = await signUpWithEmail(email, fullName);
      if (res.error) setAuthError(res.error);
      else navigate('/dashboard');
    } else if (authMode === 'signin') {
      const res = await signInWithEmail(email);
      if (res.error) setAuthError(res.error);
      else navigate('/dashboard');
    }
    setAuthLoading(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 overflow-hidden">
      {/* 1. Hero Section with Motion Graphics & Starting Login/Signup Card */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Vision & Value Proposition */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 text-left space-y-6"
            >
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Free Forever • Zero Paywalls • ATS-First Architecture</span>
              </div>

              {/* Master Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                Build once. <br />
                Adapt honestly. <br />
                <span className="text-emerald-600">Apply everywhere.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                The career workspace built for students and developers. Maintain one verified <strong>Master Profile</strong>, create tailored single-column resumes, and download real text PDFs that pass ATS parsers every single time.
              </p>

              {/* Motion Floating Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <CleanFloatingBadge
                  icon={<FileCheck className="w-4 h-4 text-emerald-600" />}
                  title="Real Selectable Vector PDF"
                  subtitle="Passes the Notepad test with 100% top-to-bottom reading order"
                  delay={0.1}
                />
                <CleanFloatingBadge
                  icon={<Sparkles className="w-4 h-4 text-amber-500" />}
                  title="Truthful AI Assistant"
                  subtitle="Improves active verbs without ever fabricating fake credentials"
                  delay={0.2}
                />
                <CleanFloatingBadge
                  icon={<Layers className="w-4 h-4 text-blue-600" />}
                  title="Master Career Profile"
                  subtitle="Save projects and hackathons once; tailor resumes in two clicks"
                  delay={0.3}
                />
                <CleanFloatingBadge
                  icon={<Briefcase className="w-4 h-4 text-purple-600" />}
                  title="Application Tracker"
                  subtitle="Preserves exact version snapshot submitted to each employer"
                  delay={0.4}
                />
              </div>

              {/* Direct Link to Editor */}
              <div className="pt-2 flex items-center space-x-4 text-xs font-medium text-slate-500">
                <span>Already have a resume?</span>
                <Link
                  to="/editor/res_001"
                  className="text-slate-950 font-bold hover:text-emerald-700 underline decoration-slate-300"
                >
                  Open Live Editor Demo →
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Clean Starting Card (Instant Demo, Sign In, Sign Up) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 text-left relative overflow-hidden">
                {/* Accent top stripe */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />

                {/* Card Header */}
                <div className="mb-5">
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-950 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      RF
                    </div>
                    <span className="font-extrabold text-base text-slate-900">Start Your Workspace</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    No credit card required. Free instant access.
                  </p>
                </div>

                {user ? (
                  <div className="space-y-4 py-2">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
                      <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Active Workspace Session</div>
                      <div className="font-bold text-base text-slate-900 mt-1">{user.fullName}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                    <Link
                      to="/dashboard"
                      className="w-full py-3 px-4 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md flex items-center justify-center space-x-2"
                    >
                      <span>Continue to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* 2 Tabs: Sign Up, Sign In */}
                    <div className="flex p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setAuthError(null);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                          authMode === 'signup'
                            ? 'bg-white text-slate-900 shadow-xs font-bold'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Create Account
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signin');
                          setAuthError(null);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                          authMode === 'signin'
                            ? 'bg-white text-slate-900 shadow-xs font-bold'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Sign In
                      </button>
                    </div>

                    {authError && (
                      <div className="p-2.5 mb-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                        {authError}
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Primary: Continue with Google */}
                      <button
                        type="button"
                        disabled={authLoading}
                        onClick={async () => {
                          setAuthLoading(true);
                          setAuthError(null);
                          const res = await signInWithGoogle();
                          if (res.error) {
                            setAuthError(res.error);
                            setAuthLoading(false);
                          }
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs transition-all shadow-xs flex items-center justify-center space-x-2.5 hover:border-slate-400 disabled:opacity-50"
                      >
                        <GoogleIcon className="w-4 h-4" />
                        <span>Continue with Google</span>
                      </button>

                      <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                          <span className="px-2 bg-white text-slate-400 font-medium uppercase tracking-wider">Or with email</span>
                        </div>
                      </div>

                      {/* Email Form */}
                      <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
                        {authMode === 'signup' && (
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. Alex Morgan"
                              className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@example.com"
                            className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md disabled:opacity-50"
                        >
                          {authLoading
                            ? 'Connecting...'
                            : authMode === 'signin'
                            ? 'Sign In to Workspace'
                            : 'Create Free Account'}
                        </button>
                      </form>
                    </div>
                  </>
                )}

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Private & Secure</span>
                  </span>
                  <span>100% Free Forever</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Interactive ATS Simulation Motion Graphic Section */}
      <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-2">
            <Terminal className="w-3.5 h-3.5 text-slate-600" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            How ATS Parsers Read Your Resume
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Watch our live parsing simulator extract sections in top-to-bottom natural order without losing a single bullet point.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <CleanATSScanner />
        </div>
      </section>

      {/* 3. Practical 3-Step Workflow */}
      <section className="py-14 sm:py-18 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1.5">
              Practical Workflow
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Three Simple Steps to Get Hired
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-950">Build Master Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add coursework, GPA, technical projects, hackathons, and certifications with stable unique IDs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-950">Tailor with Honest AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick relevant items for your target role. Polish active verbs with AI that reports gaps instead of inventing fake metrics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-950">Export PDF & Track</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download a clean, selectable vector PDF and log your application with historical snapshot preservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ATS-Friendly Design Explanation (The Notepad Test) */}
      <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm text-left">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>ATS Compatibility Guarantee</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              The Plain-Text "Notepad Test"
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When Taleo, Workday, or Greenhouse parse a multi-column graphic resume, text lines get scrambled horizontally into nonsensical fragments. ResumeForge guarantees that every exported PDF passes the Notepad test:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                <strong className="block text-rose-950">What Gets Rejected:</strong>
                <ul className="space-y-1 list-disc list-inside text-rose-800 text-[11px]">
                  <li>Two-column sidebars that scramble reading order</li>
                  <li>Tables and floating text boxes</li>
                  <li>Skill bars and rating circles</li>
                  <li>Screenshots or image-to-PDF exports</li>
                  <li>Contact icons replacing readable text</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <strong className="block text-emerald-950">What ResumeForge Guarantees:</strong>
                <ul className="space-y-1 list-disc list-inside text-emerald-800 text-[11px]">
                  <li>Single-column layout with natural reading order</li>
                  <li>Standard, recognizable section headings</li>
                  <li>100% selectable, searchable text</li>
                  <li>Standard system typography (Inter, Arial, Times)</li>
                  <li>Passes the plain-text Notepad test</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA Banner */}
      <section className="py-12 bg-slate-950 text-white text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Build once. Adapt honestly. Apply everywhere.
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Completely free career workspace for students and developers.
              </p>
            </div>
            <Link
              to="/login"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm shrink-0 flex items-center space-x-2"
            >
              <span>Launch Free Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
