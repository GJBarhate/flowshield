import { create } from 'zustand';

export const useProjectStore = create((set) => ({
  projects: [],
  loading: false,
  error: null,

  setProjects: (projects) => set({ projects }),

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p._id !== projectId),
    })),

  updateProject: (projectId, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p._id === projectId ? { ...p, ...updates } : p
      ),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
