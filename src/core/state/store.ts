import { create } from 'zustand';

export type AppView = 'markdown' | 'terminal' | 'settings';

interface AppState {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Theme state
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  // Window state
  isMaximized: boolean;
  setIsMaximized: (maximized: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'markdown',
  setCurrentView: (view) => set({ currentView: view }),

  theme: 'dark',
  setTheme: (theme) => set({ theme }),

  isMaximized: false,
  setIsMaximized: (maximized) => set({ isMaximized: maximized }),
}));