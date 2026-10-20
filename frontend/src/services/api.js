import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import secureStorage from "../utils/secureStore";

const getApiUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(":")[0];
    return `http://${ip}:5000/api`;
  }
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }
  return "http://localhost:5000/api";
};

const API_URL = getApiUrl();
console.log("🌐 [TravelAI API] Connecté à :", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête : attache le token JWT s'il existe
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await secureStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Erreur récupération token dans l'intercepteur:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Variable pour éviter les boucles infinies de refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur de réponse : gère le refresh token automatique en cas de 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ne pas tenter de refresh si l'appel était déjà sur auth/login ou auth/register ou auth/refresh
    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await secureStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("Aucun refresh token disponible");
        }

        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const newAccessToken = res.data?.data?.accessToken;

        if (newAccessToken) {
          await secureStorage.setItem("access_token", newAccessToken);
          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return api(originalRequest);
        } else {
          throw new Error("Token non renouvelé");
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        await secureStorage.removeItem("access_token");
        await secureStorage.removeItem("refresh_token");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
