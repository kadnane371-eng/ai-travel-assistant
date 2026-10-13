import api from "./api";

export const tripApi = {
  // Récupérer tous les voyages de l'utilisateur
  async getMyTrips() {
    const response = await api.get("/trips");
    return response.data;
  },

  // Récupérer le détail d'un voyage
  async getTripById(id) {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  // Créer un voyage
  async createTrip(tripData) {
    const response = await api.post("/trips", tripData);
    return response.data;
  },

  // Supprimer un voyage
  async deleteTrip(id) {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },

  // Récupérer l'historique des conversations
  async getConversations() {
    const response = await api.get("/conversations");
    return response.data;
  },
};

export default tripApi;
