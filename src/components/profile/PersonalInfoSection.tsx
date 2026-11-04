import React from 'react';
import { 
  User, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText 
} from 'lucide-react';
import { PersonalInfo } from '../../types';

const LinkedinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.95 0-1.72.77-1.72 1.72s.77 1.72 1.72 1.72 1.72-.77 1.72-1.72-.77-1.72-1.72-1.72m1.39 9.74v-8.37H5.07v8.37h2.78z" />
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ personalInfo, onChange }) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...personalInfo,
      [field]: value,
    });
  };

  const summaryWords = personalInfo.summary.trim() ? personalInfo.summary.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs text-left transition-colors duration-150">
      <div className="border-b border-slate-100 dark:border-white/[0.06] pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-semibold mb-1.5">
            <User className="size-3 text-indigo-500" />
            <span>Contact & Identity</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Personal Information</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ATS engines read these details directly into recruiter candidate cards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Full Professional Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="size-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={personalInfo.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50/70 dark:bg-[#16171c] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#1a1b22] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              placeholder="e.g. Alex Morgan"
            />
          </div>
        </div>

        {/* Target Headline */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Headline / Target Role
          </label>
          <div className="relative">
            <Sparkles className="size-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={personalInfo.label}
              onChange={(e) => handleChange('label', e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50/70 dark:bg-[#16171c] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#1a1b22] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              placeholder="e.g. Full-Stack SWE Intern | Distributed Systems"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="size-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              value={personalInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50/70 dark:bg-[#16171c] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#1a1b22] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              placeholder="alex.morgan@university.edu"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="size-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              required
              value={personalInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50/70 dark:bg-[#16171c] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#1a1b22] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              placeholder="+1 (555) 234-5678"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Location (City, Country or Remote)
          </label>
          <div className="relative">
            <MapPin className="size-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50/70 dark:bg-[#16171c] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#1a1b22] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              placeholder="e.g. Seattle, WA, USA"
            />
          </div>
        </div>

        {/* Personal Website */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Portfolio / Personal Website
          </label>
          <div className="relative">
            <Globe className="size-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              value={personalInfo.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50/70 dark:bg-[#16171c] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#1a1b22] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              placeholder="https://alexmorgan.dev"
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            LinkedIn Profile
          </label>
          <div className="relative">
            <LinkedinIcon className="size-4 text-sky-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              value={personalInfo.linkedIn}
              onChange={(e) => handleChange('linkedIn', e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50/70 dark:bg-[#16171c] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#1a1b22] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              placeholder="https://linkedin.com/in/alexmorgan"
            />
          </div>
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            GitHub Profile
          </label>
          <div className="relative">
            <GithubIcon className="size-4 text-slate-700 dark:text-slate-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              value={personalInfo.github}
              onChange={(e) => handleChange('github', e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50/70 dark:bg-[#16171c] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#1a1b22] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              placeholder="https://github.com/alexmorgan"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Professional Summary / Career Objective
          </label>
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
            {summaryWords} words {summaryWords > 80 && <span className="text-amber-500">(recommend &le; 75 words)</span>}
          </span>
        </div>
        <div className="relative">
          <FileText className="size-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3 pointer-events-none" />
          <textarea
            rows={3}
            value={personalInfo.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50/70 dark:bg-[#16171c] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#1a1b22] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
            placeholder="Passionate software engineering student with proven project experience in React, TypeScript, and distributed backend systems. Looking to contribute high-impact code to innovative engineering teams."
          />
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
          ATS Tip: Focus on technical capabilities, architectural interests, and genuine career goals. Avoid generic buzzwords.
        </p>
      </div>
    </div>
  );
};
