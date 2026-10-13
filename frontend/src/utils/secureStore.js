import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Utilitaire sécurisé pour stocker les tokens (SecureStore sur iOS/Android, AsyncStorage sur Web)
 */
export const secureStorage = {
  async setItem(key, value) {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.warn(`Erreur lors de la sauvegarde de ${key}:`, error);
      // Fallback
      await AsyncStorage.setItem(key, value).catch(() => {});
    }
  },

  async getItem(key) {
    try {
      if (Platform.OS === "web") {
        return await AsyncStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.warn(`Erreur lors de la lecture de ${key}:`, error);
      // Fallback
      return await AsyncStorage.getItem(key).catch(() => null);
    }
  },

  async removeItem(key) {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.warn(`Erreur lors de la suppression de ${key}:`, error);
      await AsyncStorage.removeItem(key).catch(() => {});
    }
  },
};

export default secureStorage;
