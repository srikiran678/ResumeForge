import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TemplateGalleryModal } from '../components/resume/TemplateGalleryModal';
import { ResumePhotoUploadModal } from '../components/profile/ResumePhotoUploadModal';
import { useWorkspace } from '../context/WorkspaceContext';
import { TemplateId } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { masterProfile, updateMasterProfile, createResume } = useWorkspace();

  // Modals state
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');

  // FAQ Accordion State (single open item or null)
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // ATS Scanner Sandbox State
  const [activeSample, setActiveSample] = useState<'sample-1' | 'sample-2' | 'sample-3'>('sample-1');

  const samples = {
    'sample-1': {
      filename: 'Elena_Rostova_VP_Cloud_2025.pdf',
      filesize: 'A4 Executive • 482 KB • Parsing complete',
      composite: 98,
      status: 'Exceptional',
      readability: '99%',
      verbs: '94%',
      metrics: '96%',
      in1: 'Standard reverse-chronological header structure strictly adheres to Workday 2025 parser guidelines.',
      in2: 'Primary hard skills matched against 1,200 verified Enterprise Architect job descriptions with zero token collision.',
      in3: 'Opportunity: Adding certification credential ID numbers directly in the top header will increase automated screening confidence by +3.4%.',
    },
    'sample-2': {
      filename: 'Dev_Candidate_Draft_Junior.docx',
      filesize: 'US Letter • 112 KB • Warnings detected',
      composite: 64,
      status: 'At Risk',
      readability: '72%',
      verbs: '61%',
      metrics: '52%',
      in1: 'Warning: 2-column tabular layout detected in Experience block; Taleo parsers may scramble chronology.',
      in2: 'Action verb frequency is weak: 6 bullet points begin with passive phrases ("assisted with", "worked on").',
      in3: 'Critical: Only 2 out of 8 bullets include quantified metrics. ResumeForge Kinetic Enhancer can upgrade this in 1-click.',
    },
    'sample-3': {
      filename: 'Marcus_Adebayo_Staff_Product.pdf',
      filesize: 'A4 Executive • 390 KB • Highly Optimized',
      composite: 95,
      status: 'Interview Ready',
      readability: '96%',
      verbs: '98%',
      metrics: '92%',
      in1: 'P&L references ($35M) and ARR scaling milestones match Greenhouse high-priority executive filter thresholds.',
      in2: 'Flawless typography flow; zero orphan words or hyphenated section boundaries.',
      in3: 'Refinement: Add 2 enterprise agile certification keywords to top technical competencies block.',
    },
  };

  const currentSampleData = samples[activeSample];

  // 3D Card Interactive Tilt and Sheen Effect
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const sheen = sheenRef.current;
    if (!stage || !card) return;

    let isHovered = false;
    let targetRotateX = 12;
    let targetRotateY = -8;
    let targetRotateZ = 1.5;
    let targetScale = 1;
    let currentRotateX = 12;
    let currentRotateY = -8;
    let currentRotateZ = 1.5;
    let currentScale = 1;
    let animationFrameId: number | null = null;

    const baseRotateX = 12;
    const baseRotateY = -8;
    const baseRotateZ = 1.5;

    function updateCardTransform() {
      currentRotateX += (targetRotateX - currentRotateX) * 0.12;
      currentRotateY += (targetRotateY - currentRotateY) * 0.12;
      currentRotateZ += (targetRotateZ - currentRotateZ) * 0.12;
      currentScale += (targetScale - currentScale) * 0.12;

      if (card) {
        card.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) rotateZ(${currentRotateZ.toFixed(2)}deg) scale3d(${currentScale.toFixed(3)}, ${currentScale.toFixed(3)}, ${currentScale.toFixed(3)})`;
      }

      if (
        isHovered ||
        Math.abs(targetRotateX - currentRotateX) > 0.05 ||
        Math.abs(targetRotateY - currentRotateY) > 0.05
      ) {
        animationFrameId = requestAnimationFrame(updateCardTransform);
      } else {
        animationFrameId = null;
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      isHovered = true;
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      targetRotateY = percentX * 16;
      targetRotateX = -percentY * 16;
      targetRotateZ = -percentX * 2;
      targetScale = 1.025;

      if (sheen) {
        sheen.style.opacity = '1';
        const sheenX = ((x / rect.width) * 100).toFixed(1);
        const sheenY = ((y / rect.height) * 100).toFixed(1);
        sheen.style.background = `radial-gradient(circle 380px at ${sheenX}% ${sheenY}%, rgba(76,215,246,0.22) 0%, rgba(192,193,255,0.08) 40%, transparent 80%)`;
      }

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateCardTransform);
      }
    };

    const handleMouseLeave = () => {
      isHovered = false;
      targetRotateX = baseRotateX;
      targetRotateY = baseRotateY;
      targetRotateZ = baseRotateZ;
      targetScale = 1.0;

      if (sheen) {
        sheen.style.opacity = '0';
      }

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateCardTransform);
      }
    };

    stage.addEventListener('mousemove', handleMouseMove);
    stage.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      stage.removeEventListener('mousemove', handleMouseMove);
      stage.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollToScanner = () => {
    const el = document.getElementById('ats-scanner-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'How does ResumeForge ensure 100% compliance with ATS parsers?',
      a: 'Unlike standard graphic design tools that output multi-layered vector PDFs where text is scrambled into non-sequential text-flow boxes, ResumeForge uses a linear semantic document model. We render clean, single-stream OpenType typography with standard heading structures that Workday, Taleo, Greenhouse, and Lever parse into precise database columns with zero loss.',
    },
    {
      q: 'Will recruiters know my resume was generated with AI?',
      a: 'No. Standard generative AI outputs predictable buzzword cliches like "delved into" or "spearheaded cross-functional synergies". ResumeForge is fine-tuned against real executive resumes and uses programmatic metric anchoring: every sentence is grounded in quantitative metrics and authentic engineering/leadership vernacular.',
    },
    {
      q: 'Can I export directly to both US Letter and International A4?',
      a: 'Yes. Switching between US Letter (8.5 x 11 in) and ISO A4 (210 x 297 mm) is instantaneous. Our kinetic reflow layout recalculates line heights and margin distributions dynamically so your page count never breaks unexpectedly into an orphan 2nd or 3rd page.',
    },
    {
      q: 'Is my career data and personal contact information kept private?',
      a: 'We operate on a zero-retention ephemeral privacy framework. Your draft resumes, target company benchmarks, and contact details are encrypted in transit via TLS 1.3 and at rest with AES-256. We do not use candidate career data to train public foundation models.',
    },
  ];

  return (
    <div className="dark bg-[#0b0e14] text-on-surface font-body-md antialiased min-h-screen selection:bg-primary/20 selection:text-primary-fixed">
      {/* =========================================================================
          1. FIXED TOP HEADER BAR
      ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
        <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" onClick={scrollToHero} className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-container via-primary to-secondary-fixed flex items-center justify-center font-bold text-on-primary shadow-[0_0_15px_rgba(6,182,212,0.4)] text-sm tracking-tighter">
                RF
              </div>
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-sm sm:text-headline-sm text-on-surface tracking-tight group-hover:text-primary transition-colors">
                  ResumeForge
                </span>
                <span className="hidden xs:inline-block px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-label-sm bg-primary/10 text-primary border border-primary/30 shadow-[0_0_12px_rgba(76,215,246,0.35)]">
                  AI 3.0
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 p-1 bg-surface-container-low/60 rounded-xl">
              <button
                onClick={scrollToHero}
                className="px-3.5 py-1.5 transition-all bg-surface-container-high text-on-surface font-medium rounded-lg text-sm cursor-pointer"
              >
                Product Showcase
              </button>
              <Link
                to={user ? "/resumes" : "/login?mode=signup"}
                className="px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md"
              >
                Resume Studio
              </Link>
              <button
                onClick={() => setTemplateGalleryOpen(true)}
                className="px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md cursor-pointer"
              >
                10 ATS Templates
              </button>
              <button
                onClick={scrollToScanner}
                className="px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md cursor-pointer"
              >
                ATS Scanner & Analytics
              </button>
            </nav>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ATS Rate Metric Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-tertiary-container/30 shadow-[0_0_14px_rgba(78,222,163,0.15)]">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-surface-variant">ATS Rate:</span>
              <span className="font-label-md text-label-md text-tertiary font-bold tracking-tight">98%</span>
            </div>

            {/* Authentication Buttons */}
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-primary-container to-secondary-container text-on-primary font-label-md text-xs sm:text-label-md shadow-[0_0_16px_-2px_rgba(6,182,212,0.4)] hover:brightness-110 active:translate-y-0.5 transition-all font-semibold"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">dashboard</span>
                <span>Dashboard</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/login?mode=signin"
                  className="px-2 sm:px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-md text-xs sm:text-label-md transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?mode=signup"
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-primary-container to-secondary-container text-on-primary font-label-md text-xs sm:text-label-md shadow-[0_0_16px_-2px_rgba(6,182,212,0.4)] hover:brightness-110 active:translate-y-0.5 transition-all font-semibold whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">person_add</span>
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. TOP HERO AMBIENCE & 3D INTERACTIVE SHOWCASE
      ========================================================================= */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-4rem)]">
        <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 pt-10 pb-24 lg:pt-16 lg:pb-36">
          {/* Atmospheric Ambient Glows */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[68rem] h-[36rem] bg-gradient-to-tr from-primary-container/20 via-secondary-container/25 to-tertiary/10 blur-[130px] rounded-full opacity-70" />
          <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
          <div className="pointer-events-none absolute top-1/2 -left-32 w-80 h-80 bg-secondary-container/15 blur-[90px] rounded-full" />

          <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center z-10">
            {/* Top Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high shadow-lg hover:shadow-cyan-500/10 transition-all cursor-default mb-8">
              <span className="flex h-2 w-2 rounded-full bg-tertiary animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary -ml-3.5" />
              <span className="font-label-sm text-label-sm text-tertiary tracking-wide uppercase">
                ResumeForge 3.0 Engine Released
              </span>
              <span className="text-outline text-xs">/</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                Next-Gen Kinetic Modeling
                <span className="material-symbols-outlined text-xs">bolt</span>
              </span>
            </div>

            {/* Main Headline with Gradient Radiance */}
            <h1 className="font-display-lg text-display-lg max-w-5xl tracking-tight text-on-surface">
              Craft Careers with <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary-fixed-dim via-primary-container to-secondary-fixed bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(76,215,246,0.3)]">
                3D Precision
              </span>{' '}
              &amp; AI Brilliance
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-2xl font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Generate battle-tested, ATS-bypassing resumes in seconds. Powered by kinetic layout intelligence and real-time recruiter benchmarking across 40+ industries.
            </p>

            {/* CTA Cluster */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/login?mode=signup"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-container via-primary-fixed-dim to-secondary-container text-on-primary font-label-md text-label-md font-semibold tracking-wide shadow-[0_0_24px_rgba(6,182,212,0.45)] hover:shadow-[0_0_36px_rgba(6,182,212,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span className="material-symbols-outlined text-xl transition-transform group-hover:rotate-12">
                  auto_awesome
                </span>
                <span>Create Free Account</span>
                <span className="material-symbols-outlined text-lg opacity-80 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>

              <button
                onClick={scrollToScanner}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-surface-container-high/90 hover:bg-surface-container-highest text-on-surface font-label-md text-label-md tracking-wide shadow-md transition-all duration-200 group cursor-pointer"
                type="button"
              >
                <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                </span>
                <span>Live ATS Scan Demo</span>
              </button>

              <button
                onClick={() => setTemplateGalleryOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/30 font-label-md text-label-md tracking-wide transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-lg text-primary">view_quilt</span>
                <span>Explore Templates</span>
              </button>
            </div>

            {/* Live Trust Metrics Banner */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-on-surface-variant font-label-md text-label-md py-3 px-6 rounded-2xl bg-surface-container-low/70 backdrop-blur-md shadow-inner">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-lg">verified</span>
                <span className="text-on-surface font-semibold">450,000+</span> resumes benchmarked
              </div>
              <span className="hidden sm:inline text-outline-variant">•</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">trending_up</span>
                <span className="text-on-surface font-semibold">94.8%</span> interview invite rate
              </div>
              <span className="hidden sm:inline text-outline-variant">•</span>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-lg">domain</span>
                <span>Google, Meta &amp; Stripe approved</span>
              </div>
            </div>

            {/* =========================================================================
                HERO VISUAL CENTERPIECE: Isometric Multi-Layered 3D Float with Tilt
            ========================================================================= */}
            <div
              ref={stageRef}
              id="hero-3d-stage"
              className="relative w-full max-w-5xl mt-16 lg:mt-24 flex justify-center items-center select-none"
              style={{ perspective: 1200 }}
            >
              {/* Diffuse Backing Ground Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container/20 to-transparent blur-3xl rounded-3xl -z-10 transform scale-90 pointer-events-none" />

              {/* 3D Transform Main Document Container */}
              <div
                ref={cardRef}
                id="hero-3d-card"
                className="relative w-full max-w-3xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(12deg) rotateY(-8deg) rotateZ(1.5deg)',
                  transition: 'transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)',
                }}
              >
                {/* Outer Glass Frame with Glowing Gradient Edge & Dynamic Mouse Sheen */}
                <div
                  id="card-outer-frame"
                  className="relative p-1 rounded-2xl bg-gradient-to-br from-primary/40 via-outline-variant/30 to-secondary-container/50 overflow-hidden"
                >
                  {/* Interactive Dynamic Holographic Sheen Overlay */}
                  <div
                    ref={sheenRef}
                    id="card-sheen"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-10"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 50%, rgba(76,215,246,0.18) 0%, rgba(192,193,255,0.08) 35%, transparent 70%)',
                    }}
                  />

                  <div className="relative rounded-xl bg-surface-container-lowest/95 backdrop-blur-2xl p-6 sm:p-10 text-left overflow-hidden">
                    {/* Subtle decorative grid inside resume frame */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/5 via-transparent to-transparent pointer-events-none" />

                    {/* Resume Header Block */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 bg-surface-container-low/50 -mx-6 -mt-6 p-6 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary/40 shadow-lg"
                            alt="Executive Candidate"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlOnSwTScLtvakVDF5XBkVsCDd0FiCoeIzxIUm4Uwg7TtkuujYbV9OF27uFdLTbXSq8QfAeQC-F8cLbEDLYPeyEr0EEoBNhU-uUY_v1RvLQMzAVG5mFJfmYShEz4OIXLRhjIggYZA4weO3htGOJrsd9DjinrDQ4MO9EwZUO9B5ywjt5xCgD0YYXJqofIlQ0zlaUGMNMcJRvtIuvl0NouyYH8UO-fT0a-mDD9Kb5Ub7u9Fm8gjOo82Qbg"
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary rounded-full ring-2 ring-surface-container-lowest flex items-center justify-center">
                            <span className="material-symbols-outlined text-[10px] text-surface-container-lowest font-bold">
                              check
                            </span>
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                              Elena Rostova
                            </h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase bg-primary-container/20 text-primary-fixed">
                              Executive Tech
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-primary">
                            Principal Cloud Architect &amp; VP Engineering
                          </p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                            <span>San Francisco, CA</span> • <span>elena.cloud@resumeforge.internal</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        <div className="px-3 py-1.5 rounded-lg bg-surface-container-high/80 text-right">
                          <span className="font-label-sm text-label-sm text-on-surface-variant block">Target Match</span>
                          <span className="font-metric-display text-metric-display text-tertiary leading-none">
                            99.4%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Executive Summary Section */}
                    <div className="space-y-4">
                      <div>
                        <span className="font-label-sm text-label-sm tracking-widest uppercase text-outline">
                          Executive Core
                        </span>
                        <p className="mt-1 font-body-md text-body-md text-on-surface leading-relaxed">
                          Engineering leader with 11+ years directing hyper-scale distributed infrastructure across Fortune 50 cloud environments. Orchestrated zero-downtime migration of 14,000+ microservices yielding $4.2M in annual cloud OPEX reduction.
                        </p>
                      </div>

                      {/* Experience Entries with AI Highlighting */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-label-sm tracking-widest uppercase text-outline">
                            Highlighted Impact
                          </span>
                          <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">auto_graph</span> High Recruiter Resonance
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-surface-container-low/80 space-y-2">
                          <div className="flex items-center justify-between text-xs font-label-md">
                            <span className="text-on-surface font-semibold">VP Infrastructure — Scaleworks Inc.</span>
                            <span className="text-on-surface-variant">2021 — PRESENT</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-on-surface-variant">
                            <li className="flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>
                                Architected global multi-region Kubernetes mesh, driving system availability to{' '}
                                <strong className="text-on-surface">99.999% SLA</strong> for 180M active consumer sessions.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>
                                Led 64 cross-functional engineers; reduced mean deployment cycle time from{' '}
                                <strong className="text-on-surface">14 days to 28 minutes</strong> using declarative GitOps pipelines.
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Skill Grid Badges with interactive micro-hover states */}
                    <div className="mt-5 pt-4 bg-surface-container-lowest flex flex-wrap gap-1.5">
                      <span className="skill-chip border border-outline-variant/40 px-2.5 py-1 rounded bg-surface-container-high text-xs text-on-surface-variant font-medium cursor-pointer">
                        Distributed Consensus
                      </span>
                      <span className="skill-chip border border-outline-variant/40 px-2.5 py-1 rounded bg-surface-container-high text-xs text-on-surface-variant font-medium cursor-pointer">
                        Zero-Trust Security
                      </span>
                      <span className="skill-chip border border-outline-variant/40 px-2.5 py-1 rounded bg-surface-container-high text-xs text-on-surface-variant font-medium cursor-pointer">
                        Rust / Go Systems
                      </span>
                      <span className="skill-chip border border-outline-variant/40 px-2.5 py-1 rounded bg-surface-container-high text-xs text-on-surface-variant font-medium cursor-pointer">
                        P&amp;L Ownership ($35M)
                      </span>
                      <span
                        onClick={() => setTemplateGalleryOpen(true)}
                        className="skill-chip border border-primary/30 px-2.5 py-1 rounded bg-primary-container/20 text-xs text-primary font-medium cursor-pointer hover:bg-primary-container/30 hover:shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                      >
                        +14 Verified Recruiter Keywords
                      </span>
                    </div>
                  </div>
                </div>

                {/* FLOATING LAYER 1: Top-Right Glass Badge (ATS Score 98) */}
                <div
                  onClick={scrollToScanner}
                  className="absolute -top-7 -right-6 sm:-right-12 z-20 p-4 rounded-2xl bg-surface-container-high/90 backdrop-blur-xl border border-tertiary/25 animate-float-subtle hover:scale-110 transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-tertiary/15 flex items-center justify-center text-tertiary shadow-inner">
                      <span className="material-symbols-outlined text-2xl font-bold">verified_user</span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">98</span>
                        <span className="text-xs text-on-surface-variant">/ 100</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                        Top 0.5% ATS Pass Tier
                      </span>
                    </div>
                  </div>
                </div>

                {/* FLOATING LAYER 2: Bottom-Left Glass Badge (Keyword Density) */}
                <div
                  onClick={() => setTemplateGalleryOpen(true)}
                  className="absolute -bottom-8 -left-6 sm:-left-10 z-20 p-4 rounded-2xl bg-surface-container-high/90 backdrop-blur-xl border border-primary/25 animate-float-slow hover:scale-110 transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-xl">token</span>
                    </div>
                    <div className="text-left">
                      <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
                        Semantic Match
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        99.2% Density
                      </span>
                      <span className="text-[11px] text-primary block mt-0.5">
                        Tuned for Workday &amp; Greenhouse
                      </span>
                    </div>
                  </div>
                </div>

                {/* FLOATING LAYER 3: Middle Floating Kinetic Pill */}
                <div
                  onClick={() => setPhotoUploadOpen(true)}
                  className="hidden sm:flex absolute top-1/2 -right-16 z-30 px-4 py-2.5 rounded-xl bg-gradient-to-r from-surface-container-highest to-surface-container-high backdrop-blur-lg border border-primary/30 animate-float-pill items-center gap-2.5 hover:scale-105 hover:border-tertiary/60 transition-transform cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-primary text-lg animate-spin"
                    style={{ animationDuration: '6s' }}
                  >
                    bolt
                  </span>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-on-surface block">AI Bullet Enhancer: Active</span>
                    <span className="text-[11px] text-tertiary font-medium">+42% Quantitative Impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. INTERACTIVE ATS INSTANT SCANNER PREVIEW SECTION
        ========================================================================= */}
        <section
          id="ats-scanner-section"
          className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 font-label-sm text-label-sm text-primary uppercase tracking-widest mb-2">
                  <span className="material-symbols-outlined text-sm">troubleshoot</span>
                  <span>Diagnostic Sandbox</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Instant ATS Recruiter Simulator
                </h2>
                <p className="mt-2 font-body-md text-body-md text-on-surface-variant max-w-xl">
                  Simulate how Workday, Lever, and Greenhouse parse your document. Test real sample candidate profiles or drop your draft to preview live algorithmic feedback.
                </p>
              </div>

              {/* Sample Switcher Buttons */}
              <div className="flex items-center gap-2 p-1.5 bg-surface-container-high rounded-xl self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveSample('sample-1')}
                  className={`scanner-tab-btn px-4 py-2 rounded-lg text-xs font-label-md transition-all cursor-pointer ${
                    activeSample === 'sample-1'
                      ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  Cloud Architect (High ATS)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSample('sample-2')}
                  className={`scanner-tab-btn px-4 py-2 rounded-lg text-xs font-label-md transition-all cursor-pointer ${
                    activeSample === 'sample-2'
                      ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  Junior Frontend (Needs Work)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSample('sample-3')}
                  className={`scanner-tab-btn px-4 py-2 rounded-lg text-xs font-label-md transition-all cursor-pointer ${
                    activeSample === 'sample-3'
                      ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  Product Lead (Optimized)
                </button>
              </div>
            </div>

            {/* Main Interactive Scanner Display Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left: Upload Simulator Dropzone (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-surface-container-low relative group hover:bg-surface-container transition-colors">
                <div>
                  <div className="flex items-center justify-between pb-6 mb-6">
                    <span className="font-headline-sm text-headline-sm text-on-surface">Input Payload</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Live Ready
                    </span>
                  </div>

                  {/* Drag & Drop Zone Area -> Opens Upload Photo Modal */}
                  <div
                    onClick={() => setPhotoUploadOpen(true)}
                    className="rounded-xl p-8 text-center bg-surface-container-lowest/60 hover:bg-surface-container-lowest cursor-pointer transition-all border border-dashed border-outline-variant/50 hover:border-primary/50"
                  >
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-surface-container-high flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform shadow-md">
                      <span className="material-symbols-outlined text-3xl">upload_file</span>
                    </div>
                    <p className="font-headline-sm text-headline-sm text-on-surface">
                      Drop your resume PDF or photo
                    </p>
                    <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                      or browse from camera / files to auto-fill
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high text-xs font-label-md text-on-surface hover:bg-surface-bright transition-colors">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      <span>Scan Photo or Document</span>
                    </div>
                  </div>

                  {/* Active Test Sample Meta Box */}
                  <div className="mt-6 p-4 rounded-xl bg-surface-container-lowest/80 flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary-container/20 text-primary">
                      <span className="material-symbols-outlined text-xl">description</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-on-surface truncate">
                        {currentSampleData.filename}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {currentSampleData.filesize}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  </div>
                </div>

                <div className="mt-8 pt-4 flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-tertiary">lock</span> 256-bit ephemeral encryption
                  </span>
                  <span>No data retained</span>
                </div>
              </div>

              {/* Right: Real-time Analytics Breakdown Panel (7 cols) */}
              <div className="lg:col-span-7 p-8 rounded-2xl bg-surface-container flex flex-col justify-between shadow-2xl">
                <div>
                  {/* Header Score Overview */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6">
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                        Real-time Simulation Audit
                      </span>
                      <h3 className="font-headline-md text-headline-md text-on-surface mt-0.5">
                        Composite Recruiter Score
                      </h3>
                    </div>
                    <div className="flex items-baseline gap-2 bg-surface-container-high px-4 py-2 rounded-xl">
                      <span
                        className={`font-metric-display text-metric-display font-bold ${
                          currentSampleData.composite >= 85 ? 'text-tertiary' : 'text-error'
                        }`}
                      >
                        {currentSampleData.composite}
                      </span>
                      <span className="text-sm font-label-md text-on-surface-variant">/ 100</span>
                      <span
                        className={`ml-2 text-xs font-label-sm px-2 py-0.5 rounded-full ${
                          currentSampleData.composite >= 85
                            ? 'bg-tertiary-container/30 text-tertiary'
                            : 'bg-error-container/30 text-error'
                        }`}
                      >
                        {currentSampleData.status}
                      </span>
                    </div>
                  </div>

                  {/* Radar / Metric Breakdown Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {/* Metric 1: ATS Readability */}
                    <div className="p-4 rounded-xl bg-surface-container-low shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">ATS Readability</span>
                        <span className="material-symbols-outlined text-primary text-base">visibility</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          {currentSampleData.readability}
                        </span>
                        <span className="text-[11px] text-tertiary">+12% vs avg</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-highest mt-3 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: currentSampleData.readability }}
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-on-surface-variant">Zero multi-column traps</p>
                    </div>

                    {/* Metric 2: Action Verb Power */}
                    <div className="p-4 rounded-xl bg-surface-container-low shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Action Verb Power</span>
                        <span className="material-symbols-outlined text-tertiary text-base">offline_bolt</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          {currentSampleData.verbs}
                        </span>
                        <span className="text-[11px] text-tertiary">Strong Lexicon</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-highest mt-3 overflow-hidden">
                        <div
                          className="h-full bg-tertiary rounded-full transition-all duration-500"
                          style={{ width: currentSampleData.verbs }}
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-on-surface-variant">18 assertive lead stems</p>
                    </div>

                    {/* Metric 3: Impact Metrics */}
                    <div className="p-4 rounded-xl bg-surface-container-low shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Impact Metrics</span>
                        <span className="material-symbols-outlined text-secondary text-base">query_stats</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          {currentSampleData.metrics}
                        </span>
                        <span className="text-[11px] text-tertiary">High Quant</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-highest mt-3 overflow-hidden">
                        <div
                          className="h-full bg-secondary-fixed-dim rounded-full transition-all duration-500"
                          style={{ width: currentSampleData.metrics }}
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-on-surface-variant">8 out of 9 bullets quantified</p>
                    </div>
                  </div>

                  {/* Algorithmic Recruiter Insights Box */}
                  <div className="p-5 rounded-xl bg-surface-container-low space-y-3">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                      Automated Parsing Diagnostic
                    </span>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-tertiary mt-0.5 text-base">check_circle</span>
                      <p className="text-xs text-on-surface">{currentSampleData.in1}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-tertiary mt-0.5 text-base">check_circle</span>
                      <p className="text-xs text-on-surface">{currentSampleData.in2}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary mt-0.5 text-base">lightbulb</span>
                      <p className="text-xs text-on-surface-variant">{currentSampleData.in3}</p>
                    </div>
                  </div>
                </div>

                {/* Sandbox Action Footer */}
                <div className="mt-8 pt-4 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-on-surface-variant">Evaluated using 36 recruiter models</span>
                  <Link
                    to="/login?mode=signup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:brightness-110 shadow-lg shadow-primary/20 transition-all font-semibold"
                  >
                    <span>Run In-Depth Audit Report</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. KEY CAPABILITIES: 3D INTERACTIVE CARDS
        ========================================================================= */}
        <section className="w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-widest mb-3">
              <span className="material-symbols-outlined text-sm">hub</span>
              Architectural Breakthroughs
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Engineered for the Modern Executive Talent Pipeline
            </h2>
            <p className="mt-3 font-body-md text-body-md text-on-surface-variant">
              Every feature is constructed to eliminate recruiter hesitation and bypass strict corporate screening heuristics without sacrificing human executive aesthetics.
            </p>
          </div>

          {/* 3D Grid of Dynamic Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Kinetic AI Rewriting */}
            <div className="group relative rounded-2xl bg-surface-container-low p-8 flex flex-col justify-between hover:bg-surface-container transition-all duration-300 hover:-translate-y-1.5 shadow-xl">
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container/15 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-label-sm font-semibold tracking-wide">
                    GPT-4o + Custom Fine-Tune
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                  Kinetic AI Rewriting
                </h3>
                <p className="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Converts passive duty logs into assertive executive impact vectors with verified quantitative metrics, dynamic strong verbs, and context-aware impact multipliers.
                </p>

                {/* Micro Visual Element: Before / After Snippet */}
                <div className="mt-6 p-4 rounded-xl bg-surface-container-lowest space-y-2.5">
                  <div className="text-[11px] text-error flex items-start gap-2">
                    <span className="material-symbols-outlined text-xs mt-0.5">close</span>
                    <span className="line-through opacity-70">Responsible for managing team cloud servers</span>
                  </div>
                  <div className="text-[11px] text-tertiary flex items-start gap-2">
                    <span className="material-symbols-outlined text-xs mt-0.5">check</span>
                    <span>Architected AWS mesh across 4 zones, cutting downtime by 62%</span>
                  </div>
                </div>
              </div>
              <div
                onClick={() => navigate('/login?mode=signup')}
                className="mt-8 pt-4 flex items-center gap-1.5 text-xs text-primary font-label-md group-hover:underline cursor-pointer"
              >
                <span>Explore rewriting syntax</span>
                <span className="material-symbols-outlined text-sm">east</span>
              </div>
            </div>

            {/* Card 2: Instant Multi-Format A4/Letter Export */}
            <div className="group relative rounded-2xl bg-surface-container-low p-8 flex flex-col justify-between hover:bg-surface-container transition-all duration-300 hover:-translate-y-1.5 shadow-xl">
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-container/20 flex items-center justify-center text-secondary-fixed shadow-inner group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary-fixed text-[11px] font-label-sm font-semibold tracking-wide">
                    Vector Clean Export
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-secondary-fixed transition-colors">
                  Pixel-Perfect Dual Format
                </h3>
                <p className="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Eliminates awkward 1-line page spills forever. Our algorithmic typography re-flows typography dynamically to ensure immaculate single or double page bounds in US Letter and ISO A4.
                </p>

                {/* Micro Visual Element: Dynamic Page Fit Diagram */}
                <div className="mt-6 p-4 rounded-xl bg-surface-container-lowest flex items-center justify-around">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-14 rounded bg-surface-container-high shadow-md p-1 flex flex-col gap-1">
                      <div className="w-full h-1 bg-primary/60 rounded" />
                      <div className="w-4/5 h-0.5 bg-outline-variant rounded" />
                      <div className="w-3/4 h-0.5 bg-outline-variant rounded" />
                      <div className="w-full h-0.5 bg-outline-variant rounded" />
                    </div>
                    <span className="text-[10px] text-on-surface-variant">US Letter (100%)</span>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant">sync_alt</span>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-14 rounded bg-surface-container-high shadow-md p-1 flex flex-col gap-1">
                      <div className="w-full h-1 bg-secondary-fixed/60 rounded" />
                      <div className="w-4/5 h-0.5 bg-outline-variant rounded" />
                      <div className="w-3/4 h-0.5 bg-outline-variant rounded" />
                      <div className="w-full h-0.5 bg-outline-variant rounded" />
                    </div>
                    <span className="text-[10px] text-on-surface-variant">ISO A4 (100%)</span>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setTemplateGalleryOpen(true)}
                className="mt-8 pt-4 flex items-center gap-1.5 text-xs text-secondary-fixed font-label-md group-hover:underline cursor-pointer"
              >
                <span>See typography specifications</span>
                <span className="material-symbols-outlined text-sm">east</span>
              </div>
            </div>

            {/* Card 3: Recruiter Heatmap Simulation */}
            <div className="group relative rounded-2xl bg-surface-container-low p-8 flex flex-col justify-between hover:bg-surface-container transition-all duration-300 hover:-translate-y-1.5 shadow-xl">
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-tertiary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-tertiary/15 flex items-center justify-center text-tertiary shadow-inner group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">heat_pump</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary text-[11px] font-label-sm font-semibold tracking-wide">
                    6-Second Scan Eye-Tracking
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-tertiary transition-colors">
                  Recruiter Heatmap Simulation
                </h3>
                <p className="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Trained on 100,000+ real executive recruiter eye-tracking recordings. Visualizes exactly where hiring managers look during the critical initial 6-second scan.
                </p>

                {/* Micro Visual Element: Mini Heatmap Graphic */}
                <div className="mt-6 p-4 rounded-xl bg-surface-container-lowest relative overflow-hidden flex items-center justify-between">
                  <div className="relative w-full h-12 flex items-center justify-around">
                    <div className="w-10 h-10 rounded-full bg-error/40 blur-md absolute left-4" />
                    <div className="w-8 h-8 rounded-full bg-tertiary/30 blur-md absolute left-24" />
                    <div className="w-6 h-6 rounded-full bg-primary/40 blur-md absolute right-8" />
                    <span className="relative z-10 text-[11px] font-mono text-on-surface-variant flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                      Primary F-Pattern Fixation Detected
                    </span>
                  </div>
                </div>
              </div>
              <div
                onClick={() => navigate('/login?mode=signup')}
                className="mt-8 pt-4 flex items-center gap-1.5 text-xs text-tertiary font-label-md group-hover:underline cursor-pointer"
              >
                <span>Review eye-tracking model</span>
                <span className="material-symbols-outlined text-sm">east</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. INTERACTIVE RECRUITER & CANDIDATE ENDORSEMENT SECTION
        ========================================================================= */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-container-low/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest block mb-1">
                  Proven Career Trajectories
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Trusted by Leaders at Tier-1 Tech &amp; Finance
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant">Verified via LinkedIn &amp; Offer Letters</span>
              </div>
            </div>

            {/* Testimonial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Review 1 */}
              <div className="p-6 rounded-2xl bg-surface-container flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-1 text-primary-fixed mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                    <span className="ml-2 text-xs text-on-surface-variant font-mono">5.0</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    “I spent 3 weeks getting zero callbacks with my traditional LaTeX resume. ResumeForge overhauled my quantified impacts and Workday score to 99%. Landed L7 interviews at Meta and Databricks within 5 business days.”
                  </p>
                </div>
                <div className="mt-6 pt-4 flex items-center gap-3">
                  <img
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-primary/40"
                    alt="David Chen"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjhE5E8SIJd2Aeqj7BS7KAtaLWAst2jSfLXJxLIAqHrkKXYtMSPauWPi6_VfnGxYP6huqtQkRPy7Y0ZuodpAiE9WvFhWnRRzv5S2bMi8JZXONcMiWXy2AV_cIKbMuoe5oSv0GgHrZksAd1cNjOYPT9stE9lIbnDtvZgheKZ0ppF0pWYIuGaSZDsJb-sBTz3rMaaK-RxanjQvChy6e72IIAMHi1taQeezK92QnAWtuvt2MMNSSl9USLLw"
                  />
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-semibold">David Chen</h4>
                    <p className="text-xs text-on-surface-variant">Director of Infrastructure, Now at Meta</p>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="p-6 rounded-2xl bg-surface-container flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-1 text-primary-fixed mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                    <span className="ml-2 text-xs text-on-surface-variant font-mono">5.0</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    “As a Principal Talent Partner reviewing 400 resumes a day, I can spot poorly formatted AI slop in 2 seconds. ResumeForge templates are radically different: ultra-clean visual hierarchy and genuine executive density.”
                  </p>
                </div>
                <div className="mt-6 pt-4 flex items-center gap-3">
                  <img
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-tertiary/40"
                    alt="Sarah Jenkins"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd1_tp5gNvazVNL7sb0eZchDpGgtIp2Ceh7RHY02JL9PKh3VPHI1pAcPh9X5UnYLZ06cEOXeWA5IdNQKN1yH0fvMjcf7P1-_crps7YzGb42YIC_7KXbu9BHFEpgp4N0DTblDIU_rKIrYnUNwn_pZ-pXNPcCWpSPtZdrTk3uV07NXo4IEB_p4l-SHxCvwsc5abndT1d-vRv1KTLg5SqqC0FlFzLUXyvdYqNOSBFesACJbpPiv8ZuuQXEQ"
                  />
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-semibold">Sarah Jenkins</h4>
                    <p className="text-xs text-on-surface-variant">Principal Executive Recruiter, Ex-Stripe</p>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="p-6 rounded-2xl bg-surface-container flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-1 text-primary-fixed mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                    <span className="ml-2 text-xs text-on-surface-variant font-mono">5.0</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    “The kinetic layout engine solved my multi-page headache immediately. It automatically formatted my 14-year career history into a flawless two-page artifact without single orphan lines. Truly exceptional tool.”
                  </p>
                </div>
                <div className="mt-6 pt-4 flex items-center gap-3">
                  <img
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-secondary/40"
                    alt="Marcus Adebayo"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4aMaqy8T4mRUElmI9h8QT1ccD9UrlmxAqZCKN_SDLaeMImBU0QAES-wp4f8sVZTIvdzv8PZjmfiwd50t_itzAjEMylvZNKV1Cgv0foDxa9_SgwxdV9Lz_O_gKsKuTIjPzdrxRIsHCwk3j0gNHJFt4aF-6RZt3wmWVl1HJuc4TD2uYxTcNcezY55GhcvF47f_zIeyE1X3x-DA_ewkQPafYMBX28Pku4R1D6apsnrYqHz6yg-pHYKOJbg"
                  />
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-semibold">Marcus Adebayo</h4>
                    <p className="text-xs text-on-surface-variant">Staff Product Manager, Cloudflare</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. INTERACTIVE FAQ ACCORDION SECTION
        ========================================================================= */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-2">
              Technical Clarifications
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3" id="faq-accordion">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="faq-card rounded-2xl bg-surface-container-low overflow-hidden transition-all border border-outline-variant/20 hover:border-outline-variant/40"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="faq-toggle w-full px-6 py-5 flex items-center justify-between text-left text-on-surface font-headline-sm text-headline-sm hover:text-primary transition-colors cursor-pointer"
                    type="button"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`material-symbols-outlined text-xl transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-content px-6 pb-6 text-on-surface-variant font-body-md text-body-md leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            7. BOTTOM HIGH-IMPACT LAUNCH CTA CARD
        ========================================================================= */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
          <div className="relative rounded-3xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low p-8 sm:p-14 overflow-hidden shadow-2xl border border-outline-variant/30">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest block mb-3">
                Instant Free Access
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Ready to Bypass the ATS Filter and Claim Your Next Executive Title?
              </h2>
              <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant">
                Join 450,000+ candidates who transformed their response rates using algorithmic precision. No credit card required.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/login?mode=signup"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-on-primary font-label-md text-label-md font-semibold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 hover:scale-[1.02] transition-all"
                >
                  <span className="material-symbols-outlined">person_add</span>
                  <span>Create Free Account</span>
                </Link>
                <button
                  onClick={() => setTemplateGalleryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-surface-bright transition-colors cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined">style</span>
                  <span>Browse 10 ATS Templates</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          8. FOOTER
      ========================================================================= */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary-container to-secondary-container flex items-center justify-center font-bold text-on-primary text-xs shadow-xs">
              RF
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant">
              © 2025 ResumeForge 3D AI Platform. Precision Engineered for Leaders.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={scrollToHero}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Platform
            </button>
            <button
              onClick={() => setTemplateGalleryOpen(true)}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Templates
            </button>
            <button
              onClick={scrollToScanner}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              ATS Algorithms
            </button>
            <Link
              to="/login"
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          9. MODALS INTEGRATION
      ========================================================================= */}
      {/* 10 Professional ATS Templates Modal */}
      <TemplateGalleryModal
        isOpen={templateGalleryOpen}
        selectedTemplateId={selectedTemplate}
        onSelectTemplate={(templateId) => {
          setSelectedTemplate(templateId);
          setTemplateGalleryOpen(false);
          if (user) {
            const newResume = createResume(
              `${masterProfile.personalInfo.fullName || 'Professional'} Resume`,
              masterProfile.personalInfo.label || 'Software Engineer',
              '',
              templateId
            );
            navigate(`/editor/${newResume.id}`);
          } else {
            navigate(`/login?mode=signup`);
          }
        }}
        onClose={() => setTemplateGalleryOpen(false)}
      />

      {/* Resume Photo / Document Upload Modal */}
      <ResumePhotoUploadModal
        isOpen={photoUploadOpen}
        masterProfile={masterProfile}
        onSaveToProfile={(updated) => {
          updateMasterProfile(updated);
          setPhotoUploadOpen(false);
          if (user) {
            const newResume = createResume(
              `${updated.personalInfo.fullName || 'Professional'} Resume`,
              updated.personalInfo.label || 'Software Engineer',
              '',
              'modern'
            );
            navigate(`/editor/${newResume.id}`);
          } else {
            navigate('/login?mode=signup');
          }
        }}
        onClose={() => setPhotoUploadOpen(false)}
      />
    </div>
  );
};
