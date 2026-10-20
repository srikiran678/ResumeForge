import React, { useState } from 'react';
import { Plus, Trash2, FolderGit2, X } from 'lucide-react';
import { ProjectItem } from '../../types';

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
    <div className="bg-white border border-forge-200 rounded-xl p-6 shadow-sm text-left">
      <div className="flex items-center justify-between border-b border-forge-100 pb-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-forge-900 flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-forge-800" />
            <span>Technical Projects</span>
          </h2>
          <p className="text-xs text-forge-500">
            Showcase personal, academic, hackathon, and open-source applications with live repositories.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-forge-900 text-white hover:bg-forge-800 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="py-8 text-center text-xs text-forge-400 bg-forge-50 rounded-lg border border-dashed border-forge-200">
          No projects added yet. Click "Add Project" to add your first project.
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj, idx) => (
            <div key={proj.id} className="p-4 rounded-xl border border-forge-200 bg-forge-50/50 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-forge-200">
                <span className="text-xs font-bold text-forge-700 uppercase tracking-wider">
                  Project #{idx + 1} (ID: {proj.id})
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(proj.id)}
                  className="text-forge-400 hover:text-rose-600 transition-colors p-1"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={proj.name}
                    onChange={(e) => handleUpdate(proj.id, 'name', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="e.g. Distributed Cache or Mobile App"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Date / Period</label>
                  <input
                    type="text"
                    value={proj.date || ''}
                    onChange={(e) => handleUpdate(proj.id, 'date', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="e.g. 2024-04"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Live Demo / Product URL</label>
                  <input
                    type="url"
                    value={proj.url || ''}
                    onChange={(e) => handleUpdate(proj.id, 'url', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="https://preview.app"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">GitHub / Code Repository</label>
                  <input
                    type="url"
                    value={proj.githubUrl || ''}
                    onChange={(e) => handleUpdate(proj.id, 'githubUrl', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="https://github.com/user/repo"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-forge-700 mb-1">Brief Description</label>
                  <input
                    type="text"
                    value={proj.description}
                    onChange={(e) => handleUpdate(proj.id, 'description', e.target.value)}
                    className="w-full text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                    placeholder="One sentence summary of the project's purpose and architecture."
                  />
                </div>
              </div>

              {/* Technologies Tags */}
              <div className="pt-2 border-t border-forge-200">
                <label className="block text-[11px] font-semibold text-forge-700 mb-1">Technologies Used</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {proj.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs bg-white border border-forge-200 text-forge-800"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(proj.id, tIdx)}
                        className="text-forge-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

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
                    placeholder="Add technology tag (e.g. Flutter, FastAPI, Docker)..."
                    className="flex-1 text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTech(proj.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-forge-100 hover:bg-forge-200 text-forge-800 rounded"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Key Highlights / Bullets */}
              <div className="pt-2 border-t border-forge-200">
                <label className="block text-[11px] font-semibold text-forge-700 mb-1.5">
                  Project Architectural Highlights (Bullets)
                </label>
                <div className="space-y-2 mb-2">
                  {proj.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start space-x-2">
                      <span className="text-forge-400 mt-2 text-xs">•</span>
                      <textarea
                        rows={2}
                        value={h}
                        onChange={(e) => handleUpdateHighlight(proj.id, hIdx, e.target.value)}
                        className="flex-1 text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(proj.id, hIdx)}
                        className="text-forge-400 hover:text-rose-600 p-1.5 mt-1"
                        title="Remove highlight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
                    placeholder="Add an engineering highlight (e.g. Engineered OCR pipeline reducing latency by 45%)..."
                    className="flex-1 text-xs p-2 border border-forge-300 rounded focus:ring-1 focus:ring-forge-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddHighlight(proj.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-forge-100 hover:bg-forge-200 text-forge-800 rounded"
                  >
                    Add Highlight
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
