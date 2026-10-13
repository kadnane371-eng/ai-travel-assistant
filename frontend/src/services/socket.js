import { io } from "socket.io-client";
import Constants from "expo-constants";
import { Platform } from "react-native";
import secureStorage from "../utils/secureStore";

const getSocketUrl = () => {
  if (process.env.EXPO_PUBLIC_SOCKET_URL) {
    return process.env.EXPO_PUBLIC_SOCKET_URL;
  }
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(":")[0];
    return `http://${ip}:5000`;
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000";
  }
  return "http://localhost:5000";
};

const SOCKET_URL = getSocketUrl();
console.log("⚡ [TravelAI Socket] Connecté à :", SOCKET_URL);

let socketInstance = null;

export const initSocket = async () => {
  const token = await secureStorage.getItem("access_token");

  if (!token) {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
    return null;
  }

  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  socketInstance = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socketInstance.on("connect", () => {
    console.log("⚡ Socket.io connecté au serveur avec succès !");
  });

  socketInstance.on("connect_error", (err) => {
    console.warn("⚠️ Erreur de connexion Socket.io :", err.message);
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("🔌 Socket.io déconnecté :", reason);
  });

  return socketInstance;
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const emitSendMessage = (conversationId, content) => {
  if (socketInstance && socketInstance.connected) {
    socketInstance.emit("send_message", { conversationId, content });
  } else {
    console.warn("Socket non connecté lors de l'envoi du message.");
  }
};

export const emitConfirmTrip = (tripData) => {
  if (socketInstance && socketInstance.connected) {
    socketInstance.emit("confirm_trip", { tripData });
  } else {
    console.warn("Socket non connecté lors de la confirmation du voyage.");
  }
};

export default {
  initSocket,
  getSocket,
  disconnectSocket,
  emitSendMessage,
  emitConfirmTrip,
};
