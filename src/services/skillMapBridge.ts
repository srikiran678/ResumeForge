// ============================================================
// SKILLMAP DEEP-LINK BRIDGE SERVICE — ResumeForge 2026
// Connects ResumeForge candidate skill gaps to SkillMap Learning Hub
// ============================================================

export const getSkillMapBaseUrl = (): string => {
  return (import.meta as any).env?.VITE_SKILLMAP_URL || 'http://localhost:5173';
};

export const getSkillMapLearnUrl = (skills: string[] = [], role: string = ''): string => {
  const base = getSkillMapBaseUrl();
  const params = new URLSearchParams();
  if (skills.length > 0) {
    params.set('skills', skills.join(','));
  }
  if (role) {
    params.set('role', role);
  }
  const queryStr = params.toString();
  return `${base}/learn${queryStr ? `?${queryStr}` : ''}`;
};

export const getSkillMapRoadmapUrl = (skills: string[] = [], role: string = ''): string => {
  const base = getSkillMapBaseUrl();
  const params = new URLSearchParams();
  if (skills.length > 0) {
    params.set('skills', skills.join(','));
  }
  if (role) {
    params.set('role', role);
  }
  const queryStr = params.toString();
  return `${base}/roadmap${queryStr ? `?${queryStr}` : ''}`;
};
