import { create } from "zustand";
import tripApi from "../services/trip.api";

export const useTripStore = create((set, get) => ({
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,
  filterTab: "upcoming", // 'upcoming' | 'past'

  setFilterTab: (filterTab) => set({ filterTab }),

  // Charger la liste des voyages
  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripApi.getMyTrips();
      const trips = response.data || [];
      set({ trips, isLoading: false });
      return trips;
    } catch (err) {
      const message = err.response?.data?.message || "Impossible de charger vos voyages.";
      set({ isLoading: false, error: message });
      return [];
    }
  },

  // Charger le détail d'un voyage
  fetchTripDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripApi.getTripById(id);
      const currentTrip = response.data || null;
      set({ currentTrip, isLoading: false });
      return currentTrip;
    } catch (err) {
      const message = err.response?.data?.message || "Impossible de charger ce voyage.";
      set({ isLoading: false, error: message, currentTrip: null });
      return null;
    }
  },

  // Créer un voyage
  createTrip: async (tripData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripApi.createTrip(tripData);
      const newTrip = response.data;
      set((state) => ({
        trips: [newTrip, ...state.trips],
        currentTrip: newTrip,
        isLoading: false,
      }));
      return { success: true, trip: newTrip };
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de la création du voyage.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // Supprimer un voyage
  deleteTrip: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await tripApi.deleteTrip(id);
      set((state) => ({
        trips: state.trips.filter((t) => t.id !== id),
        currentTrip: state.currentTrip?.id === id ? null : state.currentTrip,
        isLoading: false,
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de la suppression du voyage.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  clearCurrentTrip: () => set({ currentTrip: null }),
}));

export default useTripStore;
