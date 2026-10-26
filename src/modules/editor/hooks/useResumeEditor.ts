import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspace } from '@/context/WorkspaceContext';
import { AISuggestion } from '@/data/types';

export function useResumeEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    loadResume, 
    currentResume, 
    updateCurrentResume, 
    saveCurrentResumeImmediately, 
    saveStatus,
    versions,
    createVersionSnapshot,
    restoreVersion
  } = useWorkspace();

  // Active section accordion in editor
  const [activeAccordion, setActiveAccordion] = useState<string>('basics');
  const [previewScale, setPreviewScale] = useState(1);

  // Modals state
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [aiPrivacyModalOpen, setAiPrivacyModalOpen] = useState(false);
  const [bulletModalOpen, setBulletModalOpen] = useState(false);
  const [activeBullet, setActiveBullet] = useState<{
    original: string;
    section: string;
    title: string;
    onApply: (newText: string) => void;
  } | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Testing Persona & Recruiter tools
  const [personaModalOpen, setPersonaModalOpen] = useState(false);
  const [xyzModalOpen, setXyzModalOpen] = useState(false);
  const [scanSimOpen, setScanSimOpen] = useState(false);
  const [activeXyzTarget, setActiveXyzTarget] = useState<{
    initialBullet: string;
    onApply: (b: string) => void;
  } | null>(null);
  const [moreToolsOpen, setMoreToolsOpen] = useState(false);
  const [atsInspectorActive, setAtsInspectorActive] = useState(false);

  useEffect(() => {
    if (id) {
      const res = loadResume(id);
      if (!res) {
        navigate('/resumes');
      }
    }
  }, [id, loadResume, navigate]);

  // Section Reordering Logic
  const reorderSections = useCallback((newOrder: string[]) => {
    updateCurrentResume((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        sectionOrder: newOrder,
      },
    }));
  }, [updateCurrentResume]);

  const moveSection = useCallback((index: number, direction: 'up' | 'down') => {
    if (!currentResume) return;
    const currentOrder = currentResume.meta.sectionOrder || [
      'summary',
      'education',
      'work',
      'projects',
      'skills',
      'hackathons',
      'achievements',
      'certificates',
      'volunteering',
    ];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const newOrder = [...currentOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    reorderSections(newOrder);
  }, [currentResume, reorderSections]);

  const toggleSectionVisibility = useCallback((sectionKey: string) => {
    if (!currentResume) return;
    const hiddenSet = new Set(currentResume.meta.hiddenSections || []);
    if (hiddenSet.has(sectionKey)) {
      hiddenSet.delete(sectionKey);
    } else {
      hiddenSet.add(sectionKey);
    }
    updateCurrentResume((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        hiddenSections: Array.from(hiddenSet),
      },
    }));
  }, [currentResume, updateCurrentResume]);

  const getBulletTelemetry = (text: string) => {
    if (!text || text.trim().length < 10) return { status: 'weak', label: 'Draft bullet' };
    const hasNumber = /\b\d+(\.\d+)?%?|\b\d+\+?|\b\d+x\b/i.test(text);
    const powerVerbs = ['engineered', 'architected', 'developed', 'optimized', 'reduced', 'automated', 'orchestrated', 'streamlined', 'designed', 'built', 'spearheaded', 'implemented', 'scaled', 'refactored', 'accelerated'];
    const hasVerb = powerVerbs.some((v) => text.toLowerCase().includes(v));

    if (hasVerb && hasNumber) return { status: 'strong', label: '⚡ Strong Impact' };
    if (hasVerb && !hasNumber) return { status: 'metric', label: '💡 Add Numbers' };
    return { status: 'verb', label: '💡 Add Action Verb' };
  };

  const handleAutoFitOnePage = () => {
    updateCurrentResume((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        spacing: 'compact',
        fontSize: 'sm',
      },
    }));
  };

  return {
    id,
    navigate,
    currentResume,
    updateCurrentResume,
    saveCurrentResumeImmediately,
    saveStatus,
    versions,
    createVersionSnapshot,
    restoreVersion,
    activeAccordion,
    setActiveAccordion,
    previewScale,
    setPreviewScale,
    versionModalOpen,
    setVersionModalOpen,
    aiPrivacyModalOpen,
    setAiPrivacyModalOpen,
    bulletModalOpen,
    setBulletModalOpen,
    activeBullet,
    setActiveBullet,
    aiSuggestions,
    setAiSuggestions,
    aiLoading,
    setAiLoading,
    isExporting,
    setIsExporting,
    personaModalOpen,
    setPersonaModalOpen,
    xyzModalOpen,
    setXyzModalOpen,
    scanSimOpen,
    setScanSimOpen,
    activeXyzTarget,
    setActiveXyzTarget,
    moreToolsOpen,
    setMoreToolsOpen,
    atsInspectorActive,
    setAtsInspectorActive,
    reorderSections,
    moveSection,
    toggleSectionVisibility,
    getBulletTelemetry,
    handleAutoFitOnePage,
  };
}
