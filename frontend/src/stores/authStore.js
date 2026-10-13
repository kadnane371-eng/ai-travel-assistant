import { create } from "zustand";
import secureStorage from "../utils/secureStore";
import authApi from "../services/auth.api";
import { initSocket, disconnectSocket } from "../services/socket";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialisation au démarrage de l'app
  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await secureStorage.getItem("access_token");
      const refresh = await secureStorage.getItem("refresh_token");

      if (token) {
        try {
          const profileRes = await authApi.getProfile();
          if (profileRes?.data) {
            set({
              user: profileRes.data,
              accessToken: token,
              refreshToken: refresh,
              isAuthenticated: true,
              isLoading: false,
            });
            await initSocket();
            return;
          }
        } catch (e) {
          console.warn("Échec de vérification du profil au démarrage, tentative de refresh:", e.message);
        }
      }

      // Si pas de token ou validation échouée
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },

  // Connexion
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(email, password);
      const { user, accessToken, refreshToken } = response.data;

      await secureStorage.setItem("access_token", accessToken);
      if (refreshToken) {
        await secureStorage.setItem("refresh_token", refreshToken);
      }

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      await initSocket();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Identifiants invalides ou problème de connexion.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // Inscription
  register: async (fullName, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(fullName, email, password);
      const { user, accessToken, refreshToken } = response.data;

      await secureStorage.setItem("access_token", accessToken);
      if (refreshToken) {
        await secureStorage.setItem("refresh_token", refreshToken);
      }

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      await initSocket();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Erreur lors de l'inscription.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // Déconnexion
  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } catch (e) {
      console.warn("Erreur déconnexion côté serveur:", e);
    } finally {
      await secureStorage.removeItem("access_token");
      await secureStorage.removeItem("refresh_token");
      disconnectSocket();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
