import api from "./api";

export const authApi = {
  // Inscription
  async register(fullName, email, password) {
    const response = await api.post("/auth/register", { fullName, email, password });
    return response.data;
  },

  // Connexion
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Rafraîchir l'access token
  async refresh(refreshToken) {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  // Déconnexion
  async logout() {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch {
      return { success: true };
    }
  },

  // Profil utilisateur
  async getProfile() {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export default authApi;
