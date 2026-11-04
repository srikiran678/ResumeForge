import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  ArrowLeft,
  PieChart,
  Calculator,
  Award,
  Check,
  Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/common/Toast';
import { 
  calculateSalaryBenchmark, 
  ExperienceTier, 
  LocationTier, 
  CompanyTier 
} from '../modules/careerSuite';

export const SalaryIntelligencePage: React.FC = () => {
  const { showToast } = useToast();

  const [role, setRole] = useState('Fullstack Engineer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceTier>('Mid-Level (2-5y)');
  const [locationTier, setLocationTier] = useState<LocationTier>('US Tech Hubs (SF/NYC/Seattle)');
  const [companyType, setCompanyType] = useState<CompanyTier>('Established Tech / Enterprise');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const benchmark = useMemo(() => {
    return calculateSalaryBenchmark(role, experienceLevel, locationTier, companyType);
  }, [role, experienceLevel, locationTier, companyType]);

  const totalComp = useMemo(() => {
    const base = benchmark.compensationBreakdown.baseSalary;
    const bonus = Math.round(base * (benchmark.compensationBreakdown.targetBonusPercent / 100));
    const equity = benchmark.compensationBreakdown.annualEquityEst;
    const remote = benchmark.compensationBreakdown.remoteStipend;
    return base + bonus + equity + remote;
  }, [benchmark]);

  const handleCopyScript = (script: string, idx: number) => {
    navigator.clipboard.writeText(script);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
    showToast('Negotiation script copied!', 'success');
  };

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">
      {/* Top Banner */}
      <div className="border-b border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link 
              to="/dashboard"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                  Career Suite
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Compensation & Negotiation</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-500" />
                Salary Intelligence & Benchmark Calculator
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
              Verified Market Distributions
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Benchmark Filters Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-500" />
            Configure Role & Market Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Engineering Domain / Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              >
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Fullstack Engineer">Fullstack Engineer</option>
                <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                <option value="DevOps / Cloud Engineer">DevOps / Cloud Engineer</option>
                <option value="Mobile Engineer">Mobile Engineer (iOS/Android)</option>
                <option value="Product Designer (UI/UX)">Product Designer (UI/UX)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Seniority Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceTier)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              >
                <option value="Intern">Intern / Co-Op</option>
                <option value="Junior (0-2y)">Junior (0-2y)</option>
                <option value="Mid-Level (2-5y)">Mid-Level (2-5y)</option>
                <option value="Senior (5-8y)">Senior (5-8y)</option>
                <option value="Lead / Staff (8y+)">Lead / Staff (8y+)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Geography & Location Tier
              </label>
              <select
                value={locationTier}
                onChange={(e) => setLocationTier(e.target.value as LocationTier)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              >
                <option value="US Tech Hubs (SF/NYC/Seattle)">US Tech Hubs (SF/NYC/Seattle)</option>
                <option value="US Remote / Tier 2">US Remote / Tier 2 Cities</option>
                <option value="Europe / UK">Europe / UK</option>
                <option value="India / APAC">India / APAC</option>
                <option value="Global Remote">Global Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Company Tier / Scale
              </label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value as CompanyTier)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              >
                <option value="Early Startup (Seed-A)">Early Startup (Seed-A)</option>
                <option value="Growth Startup (B-D)">Growth Startup (B-D)</option>
                <option value="Established Tech / Enterprise">Established Tech / Enterprise</option>
                <option value="Big Tech / FAANG">Big Tech / FAANG</option>
              </select>
            </div>
          </div>
        </div>

        {/* Percentiles & Total Comp Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Base Salary Percentile Distribution (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-6">
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Annual Base Salary Distribution
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {benchmark.role} • {benchmark.experienceLevel}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estimated market percentile distribution for {benchmark.companyType} in {benchmark.locationTier}
              </p>
            </div>

            {/* 4-Column Percentiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/[0.04]">
                <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">25th Percentile</div>
                <div className="text-lg font-black tabular-nums text-slate-900 dark:text-white font-display">
                  {formatUSD(benchmark.percentiles.p25)}
                </div>
                <div className="text-[10px] text-slate-400">Entry threshold</div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/50">
                <div className="text-[10px] uppercase font-mono text-indigo-600 dark:text-indigo-400 font-bold">50th (Median)</div>
                <div className="text-lg font-black tabular-nums text-indigo-600 dark:text-indigo-400 font-display">
                  {formatUSD(benchmark.percentiles.median)}
                </div>
                <div className="text-[10px] text-indigo-500/80 dark:text-indigo-400/80">Market target</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/[0.04]">
                <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">75th Percentile</div>
                <div className="text-lg font-black tabular-nums text-slate-900 dark:text-white font-display">
                  {formatUSD(benchmark.percentiles.p75)}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">Target offer range</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/[0.04]">
                <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">90th Percentile</div>
                <div className="text-lg font-black tabular-nums text-slate-900 dark:text-white font-display">
                  {formatUSD(benchmark.percentiles.p90)}
                </div>
                <div className="text-[10px] text-slate-400">Top-of-market</div>
              </div>
            </div>

            {/* Visual Distribution Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>P25: {formatUSD(benchmark.percentiles.p25)}</span>
                <span className="font-bold text-indigo-600">Median: {formatUSD(benchmark.percentiles.median)}</span>
                <span>P90: {formatUSD(benchmark.percentiles.p90)}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div className="w-1/4 bg-slate-300 dark:bg-slate-700" title="25th Percentile" />
                <div className="w-1/2 bg-gradient-to-r from-indigo-500 to-indigo-600" title="Interquartile Range" />
                <div className="w-1/4 bg-slate-400 dark:bg-slate-600" title="90th Percentile" />
              </div>
            </div>
          </div>

          {/* Total Compensation Calculator (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Total Compensation (TC)
                </span>
                <PieChart className="w-4 h-4 text-slate-400" />
              </div>

              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Estimated Annual Total Package</div>
                <div className="text-3xl font-black tabular-nums text-slate-900 dark:text-white font-display">
                  {formatUSD(totalComp)}
                  <span className="text-xs font-mono font-normal text-slate-400 ml-1.5">/ yr</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs pt-2">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Base Salary</span>
                  <span className="font-mono font-semibold tabular-nums">{formatUSD(benchmark.compensationBreakdown.baseSalary)}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Annual Target Bonus ({benchmark.compensationBreakdown.targetBonusPercent}%)
                  </span>
                  <span className="font-mono font-semibold tabular-nums">
                    {formatUSD(Math.round(benchmark.compensationBreakdown.baseSalary * (benchmark.compensationBreakdown.targetBonusPercent / 100)))}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Estimated Annual Equity / RSUs</span>
                  <span className="font-mono font-semibold tabular-nums">{formatUSD(benchmark.compensationBreakdown.annualEquityEst)}</span>
                </div>
                {benchmark.compensationBreakdown.remoteStipend > 0 && (
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Remote Work / Wellness Stipend</span>
                    <span className="font-mono font-semibold tabular-nums">{formatUSD(benchmark.compensationBreakdown.remoteStipend)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-900 dark:text-emerald-300">
              💡 <strong>Negotiation Rule:</strong> Always negotiate on <em>Total Compensation</em>. When a base salary band is strict, request higher initial equity or a one-time signing bonus.
            </div>
          </div>

        </div>

        {/* Step-by-Step Negotiation Playbook */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" />
              Tactical Negotiation Scripts & Playbook
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Battle-tested responses for every phase
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benchmark.negotiationTactics.map((tactic, idx: number) => (
              <div 
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/70 dark:border-white/[0.05] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-200/50 dark:border-indigo-800/50">
                      {tactic.stage}
                    </span>
                    <button
                      onClick={() => handleCopyScript(tactic.script, idx)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                      title="Copy Script"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {tactic.headline}
                  </h4>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 italic leading-relaxed">
                    {tactic.script}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <strong>Tactical Tip:</strong> {tactic.tip}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
