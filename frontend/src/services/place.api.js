import api from "./api";

export const placeApi = {
  // Récupérer les lieux avec filtres optionnels (ville, catégorie, budget, recherche)
  async getPlaces(params = {}) {
    const response = await api.get("/places", { params });
    return response.data;
  },

  // Récupérer un lieu par son identifiant
  async getPlaceById(id) {
    const response = await api.get(`/places/${id}`);
    return response.data;
  },
};

export default placeApi;
