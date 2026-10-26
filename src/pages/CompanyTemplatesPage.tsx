import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Filter, 
  Sparkles, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  X,
  Plus
} from 'lucide-react';
import { Company, CompanyTemplate, TemplateFilterState } from '../data/types';
import { CompanyTemplateService } from '../services/companyTemplateService';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../lib/storage';
import { TemplateId, ResumeData } from '../data/types/resume';

export const CompanyTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [templates, setTemplates] = useState<CompanyTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState<TemplateFilterState>({
    companySlug: 'all',
    roleCategory: 'all',
    experienceLevel: 'all',
    layoutStyle: 'all',
    searchQuery: '',
    selectedSkill: ''
  });

  // Preview Modal state
  const [previewTemplate, setPreviewTemplate] = useState<CompanyTemplate | null>(null);

  // Add Company Modal state (admin/user)
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanySlug, setNewCompanySlug] = useState('');
  const [newCompanyCareersUrl, setNewCompanyCareersUrl] = useState('');
  const [newCompanyDesc, setNewCompanyDesc] = useState('');
  const [addCompanyStatus, setAddCompanyStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [comps, tmpls] = await Promise.all([
          CompanyTemplateService.getCompanies(),
          CompanyTemplateService.getTemplates()
        ]);
        setCompanies(comps);
        setTemplates(tmpls);
      } catch (err) {
        console.error('Failed to load company template catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return CompanyTemplateService.applyFilters(templates, filters);
  }, [templates, filters]);

  // Skill pool from highlights for quick chip filtering
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    templates.forEach(t => {
      t.template_data?.highlights?.forEach((h: string) => set.add(h));
    });
    return Array.from(set).slice(0, 10);
  }, [templates]);

  // Handle "Use Template" action
  const handleUseTemplate = useCallback(async (template: CompanyTemplate) => {
    const baseTmpl = (template.template_data?.baseTemplate || 'classic') as TemplateId;
    const targetComp = template.companies?.[0]?.name || '';
    const targetRole = template.roles?.[0]?.title || 'Software Engineer';
    const newId = `res_${Date.now()}`;

    const newResume: ResumeData = {
      id: newId,
      userId: user?.id || '',
      title: `${targetComp ? targetComp + ' ' : ''}${targetRole} Resume`,
      targetCompany: targetComp,
      targetRole: targetRole,
      basics: {
        name: user?.fullName || 'Your Name',
        label: targetRole,
        email: user?.email || 'your.email@example.com',
        phone: '',
        location: '',
        url: '',
        summary: '',
        profiles: []
      },
      education: [],
      work: [],
      projects: [],
      skills: [{ category: 'Technical Skills', items: [] }],
      certificates: [],
      achievements: [],
      hackathons: [],
      volunteering: [],
      meta: {
        sectionOrder: ['summary', 'education', 'work', 'projects', 'skills', 'hackathons', 'achievements', 'certificates'],
        hiddenSections: [],
        fontFamily: 'Inter',
        fontSize: 'base',
        spacing: 'normal',
        lastModified: new Date().toISOString(),
        version: '1.0',
        template: baseTmpl,
        companyTemplateId: template.id,
        targetCompany: targetComp,
        targetRole: targetRole
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await StorageService.saveResume(newResume);
    navigate(`/editor/${newResume.id}`);
  }, [user, navigate]);

  // Handle Add Company
  const handleAddCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    setAddCompanyStatus('Adding company...');
    const slug = newCompanySlug.trim() || newCompanyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const { data, error } = await CompanyTemplateService.addCompany({
      name: newCompanyName.trim(),
      slug,
      official_careers_url: newCompanyCareersUrl.trim() || undefined,
      description: newCompanyDesc.trim() || undefined,
    });
    if (error) {
      setAddCompanyStatus(`Error: ${error.message || 'Failed to add'}`);
      return;
    }
    if (data) {
      setCompanies(prev => [...prev, data]);
      setAddCompanyStatus('Company added successfully!');
      setTimeout(() => {
        setShowAddCompanyModal(false);
        setAddCompanyStatus(null);
        setNewCompanyName('');
        setNewCompanySlug('');
        setNewCompanyCareersUrl('');
        setNewCompanyDesc('');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.08]">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Targeted Career Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Company-Wise Resume Templates
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl text-pretty">
              ATS-tested, single-column resume architectures independently designed and calibrated for Google, Microsoft, Amazon, TCS, Infosys, and leading employers.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setShowAddCompanyModal(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-500" />
              <span>Add Company</span>
            </button>
            <button
              onClick={() => navigate('/admin/templates')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin & AI Agent</span>
            </button>
          </div>
        </div>

        {/* Legal Transparency & Independence Disclaimer */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong className="font-semibold">Independent Design Notice:</strong> These templates are independently researched, open-source designs tailored to standard public job descriptions and ATS requirements. They are not officially sponsored, affiliated with, or endorsed by any employer.
          </div>
        </div>
      </div>

      {/* Main Filter & Content Layout */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Search templates by company, role, skill, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Company Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={filters.companySlug}
                onChange={(e) => setFilters(prev => ({ ...prev, companySlug: e.target.value }))}
                className="w-full py-2.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Companies ({companies.length})</option>
                {companies.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Role Category Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={filters.roleCategory}
                onChange={(e) => setFilters(prev => ({ ...prev, roleCategory: e.target.value }))}
                className="w-full py-2.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Job Categories</option>
                <option value="Software Engineering">Software Engineer</option>
                <option value="Web & Cloud">Full-Stack & Cloud</option>
                <option value="Data & Analytics">Data Analyst</option>
                <option value="AI & Machine Learning">AI & Automation</option>
              </select>
            </div>

            {/* Experience Level Dropdown */}
            <div className="w-full md:w-40">
              <select
                value={filters.experienceLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                className="w-full py-2.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Experience</option>
                <option value="Fresher">Fresher / Campus</option>
                <option value="Entry-Level">Entry-Level</option>
                <option value="Mid-Level">Mid-Level</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {(filters.companySlug !== 'all' || filters.roleCategory !== 'all' || filters.experienceLevel !== 'all' || filters.selectedSkill || filters.searchQuery) && (
              <button
                onClick={() => setFilters({
                  companySlug: 'all',
                  roleCategory: 'all',
                  experienceLevel: 'all',
                  layoutStyle: 'all',
                  searchQuery: '',
                  selectedSkill: ''
                })}
                className="px-3 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Quick Skill Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Quick Skills:
            </span>
            {allSkills.map((skill) => {
              const active = filters.selectedSkill === skill;
              return (
                <button
                  key={skill}
                  onClick={() => setFilters(prev => ({ ...prev, selectedSkill: active ? '' : skill }))}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Showing <strong className="text-slate-900 dark:text-white font-semibold">{filteredTemplates.length}</strong> company-targeted templates</span>
          <span className="font-mono text-[11px]">100% Vector PDF & Single-Column ATS Guaranteed</span>
        </div>

        {/* Template Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No Templates Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No templates match your current filter combination. Try clearing filters or searching for another company or skill.
            </p>
            <button
              onClick={() => setFilters({ companySlug: 'all', roleCategory: 'all', experienceLevel: 'all', layoutStyle: 'all', searchQuery: '', selectedSkill: '' })}
              className="mt-2 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const company = template.companies?.[0];
              const role = template.roles?.[0];
              const badge = template.template_data?.badge || 'ATS Ready';
              const highlights = template.template_data?.highlights || [];

              return (
                <div
                  key={template.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-md hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all flex flex-col overflow-hidden group"
                >
                  {/* Card Header & Badges */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="flex items-center space-x-2">
                        {company?.logo_url ? (
                          <img 
                            src={company.logo_url} 
                            alt={company.name} 
                            className="size-5 rounded-sm object-contain"
                            onError={(e) => { (e.target as any).style.display = 'none'; }}
                          />
                        ) : (
                          <Building2 className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {company?.name || 'General Enterprise'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60">
                        {badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {template.name}
                    </h3>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {template.description}
                    </p>
                  </div>

                  {/* Thumbnail / Mini ATS Layout Mockup */}
                  <div className="px-5 py-2">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 text-[10px] space-y-1.5 font-mono">
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/60 pb-1 text-slate-400">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">ATS Single-Column Flow</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded">
                          {template.experience_level}
                        </span>
                      </div>
                      <div className="h-1.5 w-2/3 bg-slate-300 dark:bg-slate-700 rounded-full" />
                      <div className="h-1.5 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-full" />
                      <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                  </div>

                  {/* Key Highlights / Requirements */}
                  <div className="px-5 py-2 flex-1">
                    <div className="text-[10px] uppercase font-mono font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                      Target Role & Emphasis:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {role.title}
                        </span>
                      )}
                      {highlights.slice(0, 2).map((h: string) => (
                        <span key={h} className="text-[10px] px-2 py-0.5 rounded bg-slate-100/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-mono">
                          {h}
                        </span>
                      ))}
                    </div>

                    {template.source && (
                      <div className="mt-2.5 flex items-center space-x-1.5 text-[9px] font-mono text-slate-400 dark:text-slate-500">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span>Verified: {template.source.license_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="px-4 py-1.5 text-xs font-bold bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  Template Architecture Preview
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {previewTemplate.name}
                </h2>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {previewTemplate.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-mono">
                  <div><strong>Layout Style:</strong> {previewTemplate.layout_style}</div>
                  <div><strong>Target Level:</strong> {previewTemplate.experience_level}</div>
                  <div><strong>Target Company:</strong> {previewTemplate.companies?.[0]?.name || 'Universal'}</div>
                  <div><strong>Role Category:</strong> {previewTemplate.roles?.[0]?.category || 'General'}</div>
                </div>
              </div>

              {previewTemplate.source && (
                <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-[11px] space-y-1">
                  <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Licensing & Attribution Terms:</span>
                  </div>
                  <div><strong>License:</strong> {previewTemplate.source.license_name}</div>
                  <div><strong>Attribution:</strong> {previewTemplate.source.attribution}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    <strong>Cryptographic Hash:</strong> {previewTemplate.source.file_hash}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-300">
                <strong>Disclaimer:</strong> This is an independent resume architecture designed to meet public ATS criteria. It does not guarantee employment and is not an endorsement by {previewTemplate.companies?.[0]?.name || 'any company'}.
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const tmpl = previewTemplate;
                  setPreviewTemplate(null);
                  handleUseTemplate(tmpl);
                }}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>Add New Company</span>
              </h3>
              <button
                onClick={() => setShowAddCompanyModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCompanySubmit} className="py-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => {
                    setNewCompanyName(e.target.value);
                    if (!newCompanySlug) {
                      setNewCompanySlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                  placeholder="e.g. Netflix, Meta, Intel"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={newCompanySlug}
                  onChange={(e) => setNewCompanySlug(e.target.value)}
                  placeholder="e.g. netflix"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Careers URL
                </label>
                <input
                  type="url"
                  value={newCompanyCareersUrl}
                  onChange={(e) => setNewCompanyCareersUrl(e.target.value)}
                  placeholder="https://jobs.netflix.com"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newCompanyDesc}
                  onChange={(e) => setNewCompanyDesc(e.target.value)}
                  placeholder="Overview of engineering domains..."
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              {addCompanyStatus && (
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {addCompanyStatus}
                </div>
              )}

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCompanyModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
                >
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
