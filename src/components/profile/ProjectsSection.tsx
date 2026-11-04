import React, { useState } from 'react';
import { Plus, Trash2, FolderGit2, X, ExternalLink, Calendar, Code, Sparkles } from 'lucide-react';
import { ProjectItem } from '../../types';

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onChange: (updated: ProjectItem[]) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onChange }) => {
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});
  const [highlightInputs, setHighlightInputs] = useState<Record<string, string>>({});

  const handleAddProject = () => {
    const newItem: ProjectItem = {
      id: `proj_${Date.now()}`,
      name: '',
      description: '',
      url: '',
      githubUrl: '',
      technologies: ['TypeScript', 'React'],
      highlights: ['Engineered key features utilizing modern development workflows.'],
      date: '2024-03',
    };
    onChange([...projects, newItem]);
  };

  const handleUpdate = (id: string, field: keyof ProjectItem, value: any) => {
    onChange(
      projects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleDelete = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  const handleAddTech = (projId: string) => {
    const text = techInputs[projId]?.trim();
    if (!text) return;
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;

    handleUpdate(projId, 'technologies', [...proj.technologies, text]);
    setTechInputs({ ...techInputs, [projId]: '' });
  };

  const handleRemoveTech = (projId: string, index: number) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    const updated = proj.technologies.filter((_, idx) => idx !== index);
    handleUpdate(projId, 'technologies', updated);
  };

  const handleAddHighlight = (projId: string) => {
    const text = highlightInputs[projId]?.trim();
    if (!text) return;
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;

    handleUpdate(projId, 'highlights', [...proj.highlights, text]);
    setHighlightInputs({ ...highlightInputs, [projId]: '' });
  };

  const handleRemoveHighlight = (projId: string, index: number) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    const updated = proj.highlights.filter((_, idx) => idx !== index);
    handleUpdate(projId, 'highlights', updated);
  };

  const handleUpdateHighlight = (projId: string, index: number, text: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    const updated = [...proj.highlights];
    updated[index] = text;
    handleUpdate(projId, 'highlights', updated);
  };

  return (
    <div className="bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs text-left transition-colors duration-150">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-4 mb-6 gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200/70 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-[10px] font-mono font-semibold mb-1.5">
            <FolderGit2 className="size-3 text-purple-500" />
            <span>Technical Proof of Work</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Technical Projects</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showcase personal, academic, hackathon, and open-source applications with live repositories.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="py-12 px-4 text-center bg-slate-50/70 dark:bg-[#16171c] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="size-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 flex items-center justify-center mx-auto mb-3 text-purple-600 dark:text-purple-400">
            <FolderGit2 className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">No technical projects added</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Technical projects are the #1 way for students and freshers to land interviews without formal years of experience.
          </p>
          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add First Project</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj, idx) => (
            <div 
              key={proj.id} 
              className="p-5 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#16171c] space-y-4 transition-all"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-200/70 dark:border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center size-6 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-mono font-bold">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {proj.name || 'Untitled Project'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(proj.id)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                  title="Delete project"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={proj.name}
                    onChange={(e) => handleUpdate(proj.id, 'name', e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g. Distributed Cache & Key-Value Store"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date / Duration
                  </label>
                  <div className="relative">
                    <Calendar className="size-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={proj.date}
                      onChange={(e) => handleUpdate(proj.id, 'date', e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g. 2024-03 or Spring 2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <GithubIcon className="size-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="url"
                      value={proj.githubUrl || ''}
                      onChange={(e) => handleUpdate(proj.id, 'githubUrl', e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Live Demo / Deployment URL
                  </label>
                  <div className="relative">
                    <ExternalLink className="size-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="url"
                      value={proj.url || ''}
                      onChange={(e) => handleUpdate(proj.id, 'url', e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                      placeholder="https://project-demo.vercel.app"
                    />
                  </div>
                </div>
              </div>

              {/* Technologies Used */}
              <div className="pt-3 border-t border-slate-200/70 dark:border-white/[0.06]">
                <div className="flex items-center space-x-1.5 mb-2">
                  <Code className="size-3.5 text-purple-500" />
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Technologies & Frameworks
                  </label>
                </div>

                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {proj.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-800 dark:text-purple-200 font-mono font-medium shadow-2xs"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(proj.id, tIdx)}
                          className="text-purple-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={techInputs[proj.id] || ''}
                    onChange={(e) =>
                      setTechInputs({ ...techInputs, [proj.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech(proj.id);
                      }
                    }}
                    placeholder="Type tech name and press Enter (e.g. Go, Redis, Docker)"
                    className="flex-1 text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTech(proj.id)}
                    className="px-4 py-2 text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Add Tech
                  </button>
                </div>
              </div>

              {/* Highlights / Bullets */}
              <div className="pt-3 border-t border-slate-200/70 dark:border-white/[0.06]">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="size-3.5 text-amber-500" />
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Technical Impact Bullets
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    Include architecture, benchmarks, or scale metrics
                  </span>
                </div>

                <div className="space-y-2.5 mb-3">
                  {proj.highlights.map((bullet, hIdx) => (
                    <div key={hIdx} className="flex items-start space-x-2">
                      <span className="size-1.5 rounded-full bg-purple-500 mt-3 shrink-0" />
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleUpdateHighlight(proj.id, hIdx, e.target.value)}
                        className="flex-1 text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                        placeholder="Architected [feature] using [tools], improving [latency/throughput] by [metric]..."
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(proj.id, hIdx)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors mt-1 cursor-pointer"
                        title="Remove bullet"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={highlightInputs[proj.id] || ''}
                    onChange={(e) =>
                      setHighlightInputs({ ...highlightInputs, [proj.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight(proj.id);
                      }
                    }}
                    placeholder="Add a technical impact bullet and press Enter..."
                    className="flex-1 text-xs p-2.5 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddHighlight(proj.id)}
                    className="px-4 py-2 text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Add Bullet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
