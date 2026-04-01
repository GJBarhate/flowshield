import { create } from 'zustand';

export const useEventStore = create((set) => ({
  events: [],
  stats: { total: 0, success: 0, failed: 0, pending: 0, retrying: 0 },
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, pages: 1 },

  setEvents: (events) => set({ events }),

  appendEvents: (events) =>
    set((state) => ({ events: [...state.events, ...events] })),

  updateEvent: (updatedEvent) =>
    set((state) => ({
      events: state.events.map((e) =>
        e._id === updatedEvent._id ? { ...e, ...updatedEvent } : e
      ),
    })),

  prependEvent: (event) =>
    set((state) => ({ events: [event, ...state.events] })),

  setStats: (stats) => set({ stats }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setPagination: (pagination) => set({ pagination }),
}));
