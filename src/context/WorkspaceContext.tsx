import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  MasterProfile, 
  ResumeData, 
  JobApplication, 
  AIUsageRecord, 
  PublicResumeLink, 
  PortfolioProfile,
  ResumeVersion
} from '../types';
import { StorageService } from '@/modules/database';
import { useAuth } from './AuthContext';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface WorkspaceContextType {
  masterProfile: MasterProfile;
  updateMasterProfile: (profile: MasterProfile) => void;
  resumes: ResumeData[];
  currentResume: ResumeData | null;
  loadResume: (id: string) => ResumeData | undefined;
  updateCurrentResume: (updater: (prev: ResumeData) => ResumeData) => void;
  saveCurrentResumeImmediately: () => void;
  createResume: (
    title?: string,
    targetRole?: string,
    targetCompany?: string,
    template?: ResumeData['meta']['template']
  ) => ResumeData;
  createResumeFromProfile: (title: string, selectedIds: {
    educationIds: string[];
    experienceIds: string[];
    projectIds: string[];
    skillsCategories: string[];
    certificationIds: string[];
    achievementIds: string[];
    hackathonIds: string[];
    volunteeringIds: string[];
  }, template: ResumeData['meta']['template']) => ResumeData;
  duplicateResume: (id: string) => ResumeData | undefined;
  moveToTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  deletePermanently: (id: string) => void;
  saveStatus: SaveStatus;
  
  // Versions
  versions: ResumeVersion[];
  createVersionSnapshot: (name?: string, note?: string) => ResumeVersion | undefined;
  restoreVersion: (versionId: string) => void;

  // Applications
  applications: JobApplication[];
  saveApplication: (app: JobApplication) => void;
  deleteApplication: (id: string) => void;

  // AI Usage
  aiUsage: AIUsageRecord;
  refreshAIUsage: () => void;

  // Public Links
  publicLinks: PublicResumeLink[];
  getPublicLink: (resumeId: string) => PublicResumeLink | undefined;
  togglePublicLink: (resumeId: string, accessType: 'public' | 'unlisted' | 'private') => PublicResumeLink;
  revokePublicLink: (slug: string) => void;

  // Portfolio
  portfolio: PortfolioProfile;
  updatePortfolio: (portfolio: PortfolioProfile) => void;

  // Data Ownership
  exportAllData: () => string;
  importAllData: (jsonStr: string) => { success: boolean; error?: string };
  resetAllData: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [masterProfile, setMasterProfile] = useState<MasterProfile>(() => StorageService.getMasterProfile());
  const [resumes, setResumes] = useState<ResumeData[]>(() => StorageService.getResumes());
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>(() => StorageService.getApplications());
  const [aiUsage, setAiUsage] = useState<AIUsageRecord>(() => StorageService.getAIUsage());
  const [publicLinks, setPublicLinks] = useState<PublicResumeLink[]>(() => StorageService.getPublicLinks());
  const [portfolio, setPortfolio] = useState<PortfolioProfile>(() => StorageService.getPortfolio());
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  // Cloud data hydration from live InsForge PostgreSQL for authenticated users
  useEffect(() => {
    let isMounted = true;
    const hydrateCloudData = async () => {
      if (user?.id) {
        try {
          const [remoteResumes, remoteProfile, remoteApps] = await Promise.all([
            StorageService.loadResumes(user.id),
            StorageService.loadMasterProfile(user.id),
            StorageService.loadApplications(user.id),
          ]);
          if (isMounted) {
            setResumes(remoteResumes || []);
            if (remoteProfile && remoteProfile.personalInfo && (remoteProfile.personalInfo.fullName || remoteProfile.personalInfo.email)) {
              setMasterProfile(remoteProfile);
            } else {
              const current = StorageService.getMasterProfile(user.id);
              if (user.fullName && !current.personalInfo.fullName) {
                current.personalInfo.fullName = user.fullName;
              }
              if (user.email && !current.personalInfo.email) {
                current.personalInfo.email = user.email;
              }
              current.userId = user.id;
              setMasterProfile(current);
            }
            setApplications(remoteApps || []);
          }
        } catch (error) {
          console.warn('Failed to hydrate cloud data from InsForge PostgreSQL:', error);
        }
      } else {
        if (isMounted) {
          setResumes([]);
          setMasterProfile(StorageService.getMasterProfile());
          setApplications([]);
        }
      }
    };

    hydrateCloudData();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.email, user?.fullName]);

  // Debounced autosave ref (800ms)
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update master profile
  const updateMasterProfile = useCallback((profile: MasterProfile) => {
    setMasterProfile(profile);
    StorageService.saveMasterProfile(profile);
  }, []);

  // Load a resume into editor
  const loadResume = useCallback((id: string): ResumeData | undefined => {
    const found = 
      (user?.id ? StorageService.getResumeById(id, user.id) : undefined) ||
      StorageService.getResumeById(id) ||
      resumes.find((r) => r.id === id);
      
    if (found) {
      setCurrentResume(found);
      setVersions(StorageService.getVersions(id));
      setSaveStatus('saved');
    }
    return found;
  }, [user, resumes]);

  // Debounced Autosave (Section 11: 800ms debounce)
  const updateCurrentResume = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setCurrentResume((prev) => {
      if (!prev) return null;
      const updated = updater(prev);
      setSaveStatus('unsaved');

      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }

      setSaveStatus('saving');
      autosaveTimeoutRef.current = setTimeout(() => {
        try {
          StorageService.saveResume(updated);
          setResumes(StorageService.getResumes());
          setSaveStatus('saved');
        } catch (e) {
          console.error('Autosave failed:', e);
          setSaveStatus('error');
        }
      }, 800);

      return updated;
    });
  }, []);

  const saveCurrentResumeImmediately = useCallback(() => {
    if (!currentResume) return;
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    setSaveStatus('saving');
    try {
      StorageService.saveResume(currentResume);
      setResumes(StorageService.getResumes());
      setSaveStatus('saved');
    } catch (e) {
      console.error('Immediate save failed:', e);
      setSaveStatus('error');
    }
  }, [currentResume]);

  // Section 9: Create Resume from Master Profile
  const createResumeFromProfile = useCallback(
    (
      title: string,
      selectedIds: {
        educationIds: string[];
        experienceIds: string[];
        projectIds: string[];
        skillsCategories: string[];
        certificationIds: string[];
        achievementIds: string[];
        hackathonIds: string[];
        volunteeringIds: string[];
      },
      template: ResumeData['meta']['template'] = 'classic'
    ): ResumeData => {
      const p = masterProfile;
      const newId = `res_${Date.now()}`;

      // Build skills categories
      const skillsData: { category: string; items: string[] }[] = [];
      if (selectedIds.skillsCategories.includes('languages') && p.skills.languages.length > 0) {
        skillsData.push({ category: 'Languages', items: p.skills.languages });
      }
      if (selectedIds.skillsCategories.includes('frameworks') && p.skills.frameworks.length > 0) {
        skillsData.push({ category: 'Frameworks & Libraries', items: [...p.skills.frameworks, ...p.skills.libraries] });
      }
      if (selectedIds.skillsCategories.includes('databases') && p.skills.databases.length > 0) {
        skillsData.push({ category: 'Databases', items: p.skills.databases });
      }
      if (selectedIds.skillsCategories.includes('cloud') && p.skills.cloud.length > 0) {
        skillsData.push({ category: 'Cloud & DevOps', items: p.skills.cloud });
      }
      if (selectedIds.skillsCategories.includes('tools') && p.skills.tools.length > 0) {
        skillsData.push({ category: 'Developer Tools', items: p.skills.tools });
      }

      const newResume: ResumeData = {
        id: newId,
        userId: user?.id || '',
        title: title || 'New Resume',
        basics: {
          name: p.personalInfo.fullName || user?.fullName || '',
          label: p.personalInfo.label || '',
          email: p.personalInfo.email || user?.email || '',
          phone: p.personalInfo.phone || '',
          location: p.personalInfo.location || '',
          url: p.personalInfo.website || '',
          summary: p.personalInfo.summary || '',
          profiles: [
            ...(p.personalInfo.github ? [{ network: 'GitHub', username: p.personalInfo.github.split('/').pop() || '', url: p.personalInfo.github }] : []),
            ...(p.personalInfo.linkedIn ? [{ network: 'LinkedIn', username: p.personalInfo.linkedIn.split('/').pop() || '', url: p.personalInfo.linkedIn }] : []),
          ],
        },
        education: p.education.filter((e) => selectedIds.educationIds.includes(e.id)),
        work: p.experience.filter((e) => selectedIds.experienceIds.includes(e.id)),
        projects: p.projects.filter((pr) => selectedIds.projectIds.includes(pr.id)),
        skills: skillsData.length > 0 ? skillsData : [{ category: 'Technical Skills', items: p.skills.languages }],
        certificates: p.certifications.filter((c) => selectedIds.certificationIds.includes(c.id)),
        achievements: p.achievements.filter((a) => selectedIds.achievementIds.includes(a.id)),
        hackathons: p.hackathons.filter((h) => selectedIds.hackathonIds.includes(h.id)),
        volunteering: p.volunteering.filter((v) => selectedIds.volunteeringIds.includes(v.id)),
        meta: {
          sectionOrder: ['summary', 'education', 'work', 'projects', 'skills', 'hackathons', 'achievements', 'certificates'],
          hiddenSections: [],
          fontFamily: 'Inter',
          fontSize: 'base',
          spacing: 'normal',
          lastModified: new Date().toISOString(),
          version: '1.0',
          template,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      StorageService.saveResume(newResume);
      setResumes(StorageService.getResumes(user?.id));
      return newResume;
    },
    [masterProfile, user]
  );

  const createResume = useCallback(
    (
      title: string = 'Software Engineer Resume',
      targetRole: string = '',
      targetCompany: string = '',
      template: ResumeData['meta']['template'] = 'classic'
    ): ResumeData => {
      const newId = `res_${Date.now()}`;
      const newResume: ResumeData = {
        id: newId,
        userId: user?.id || '',
        title: title || 'Software Engineer Resume',
        targetRole: targetRole || '',
        targetCompany: targetCompany || '',
        basics: {
          name: user?.fullName || 'Your Name',
          label: targetRole || 'Software Engineer',
          email: user?.email || 'your.email@example.com',
          phone: '',
          location: '',
          url: '',
          summary: '',
          profiles: [],
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
          template,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      StorageService.saveResume(newResume);
      setResumes(StorageService.getResumes(user?.id));
      return newResume;
    },
    [user]
  );

  const duplicateResume = useCallback((id: string) => {
    const dup = StorageService.duplicateResume(id);
    if (dup) {
      setResumes(StorageService.getResumes());
    }
    return dup;
  }, []);

  const moveToTrash = useCallback((id: string) => {
    StorageService.moveToTrash(id);
    setResumes(StorageService.getResumes());
  }, []);

  const restoreFromTrash = useCallback((id: string) => {
    StorageService.restoreFromTrash(id);
    setResumes(StorageService.getResumes());
  }, []);

  const deletePermanently = useCallback((id: string) => {
    StorageService.deletePermanently(id);
    setResumes(StorageService.getResumes());
    if (currentResume?.id === id) {
      setCurrentResume(null);
    }
  }, [currentResume]);

  // Versioning
  const createVersionSnapshot = useCallback((name?: string, note?: string) => {
    if (!currentResume) return undefined;
    const v = StorageService.createVersion(currentResume, name, note);
    setVersions(StorageService.getVersions(currentResume.id));
    return v;
  }, [currentResume]);

  const restoreVersion = useCallback((versionId: string) => {
    const restored = StorageService.restoreVersion(versionId);
    if (restored) {
      setCurrentResume(restored);
      setResumes(StorageService.getResumes());
      setSaveStatus('saved');
    }
  }, []);

  // Applications
  const saveApplication = useCallback((app: JobApplication) => {
    StorageService.saveApplication(app);
    setApplications(StorageService.getApplications());
  }, []);

  const deleteApplication = useCallback((id: string) => {
    StorageService.deleteApplication(id);
    setApplications(StorageService.getApplications());
  }, []);

  // AI Usage
  const refreshAIUsage = useCallback(() => {
    setAiUsage(StorageService.getAIUsage());
  }, []);

  // Public Links
  const getPublicLink = useCallback((resumeId: string) => {
    return StorageService.getPublicLinkForResume(resumeId);
  }, []);

  const togglePublicLink = useCallback((resumeId: string, accessType: 'public' | 'unlisted' | 'private') => {
    let link = StorageService.getPublicLinkForResume(resumeId);
    if (!link) {
      link = {
        id: `pub_${Date.now()}`,
        slug: StorageService.generateSlug(),
        resumeId,
        isPublic: accessType !== 'private',
        accessType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 0,
      };
    } else {
      link = {
        ...link,
        accessType,
        isPublic: accessType !== 'private',
        updatedAt: new Date().toISOString(),
      };
    }
    StorageService.savePublicLink(link);
    setPublicLinks(StorageService.getPublicLinks());
    return link;
  }, []);

  const revokePublicLink = useCallback((slug: string) => {
    StorageService.revokePublicLink(slug);
    setPublicLinks(StorageService.getPublicLinks());
  }, []);

  // Portfolio
  const updatePortfolio = useCallback((port: PortfolioProfile) => {
    StorageService.savePortfolio(port);
    setPortfolio(port);
  }, []);

  // Data Export / Import
  const exportAllData = useCallback(() => {
    return StorageService.exportAllData();
  }, []);

  const importAllData = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'File is not a valid JSON object.' };
      }
      if (parsed.masterProfile) {
        StorageService.saveMasterProfile(parsed.masterProfile);
        setMasterProfile(parsed.masterProfile);
      }
      if (Array.isArray(parsed.resumes)) {
        localStorage.setItem('resumeforge_resumes', JSON.stringify(parsed.resumes));
        setResumes(parsed.resumes);
      }
      if (Array.isArray(parsed.applications)) {
        localStorage.setItem('resumeforge_applications', JSON.stringify(parsed.applications));
        setApplications(parsed.applications);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: `Invalid JSON format: ${err.message}` };
    }
  }, []);

  const resetAllData = useCallback(() => {
    StorageService.deleteAllUserData();
    setMasterProfile(StorageService.getMasterProfile());
    setResumes(StorageService.getResumes());
    setApplications(StorageService.getApplications());
    setPublicLinks(StorageService.getPublicLinks());
    setPortfolio(StorageService.getPortfolio());
    setCurrentResume(null);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        masterProfile,
        updateMasterProfile,
        resumes,
        currentResume,
        loadResume,
        updateCurrentResume,
        saveCurrentResumeImmediately,
        createResume,
        createResumeFromProfile,
        duplicateResume,
        moveToTrash,
        restoreFromTrash,
        deletePermanently,
        saveStatus,
        versions,
        createVersionSnapshot,
        restoreVersion,
        applications,
        saveApplication,
        deleteApplication,
        aiUsage,
        refreshAIUsage,
        publicLinks,
        getPublicLink,
        togglePublicLink,
        revokePublicLink,
        portfolio,
        updatePortfolio,
        exportAllData,
        importAllData,
        resetAllData,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
