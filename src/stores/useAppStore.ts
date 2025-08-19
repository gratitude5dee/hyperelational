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
  type: 'fashion_ecommerce' | 'music_touring';
  created_at: string;
}

interface AppState {
  // Current workspace and project
  currentWorkspace: Workspace | null;
  currentProject: Project | null;
  
  // UI state
  sidebarCollapsed: boolean;
  
  // Actions
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setCurrentProject: (project: Project | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentWorkspace: null,
  currentProject: null,
  sidebarCollapsed: false,
  
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));