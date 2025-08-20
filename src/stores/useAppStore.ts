import { create } from 'zustand';

interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

interface Project {
  id: string;
  workspace_id: string;
  name: string;
  type: 'fashion_ecommerce' | 'creative_hub';
  created_at: string;
}

type IndustryMode = 'fashion' | 'artist';

interface AppState {
  // Current workspace and project
  currentWorkspace: Workspace | null;
  currentProject: Project | null;
  
  // UI state
  sidebarCollapsed: boolean;
  industryMode: IndustryMode;
  
  // Actions
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setCurrentProject: (project: Project | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setIndustryMode: (mode: IndustryMode) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentWorkspace: null,
  currentProject: null,
  sidebarCollapsed: false,
  industryMode: 'fashion',
  
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setIndustryMode: (mode) => set({ industryMode: mode }),
}));
