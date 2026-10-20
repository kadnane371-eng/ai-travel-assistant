import { create } from "zustand";
import chatApi from "../services/chat.api";
import tripApi from "../services/trip.api";

export const useChatStore = create((set, get) => ({
  conversations: [],
  currentConversationId: null,
  messages: [
    {
      id: "welcome-1",
      sender: "assistant",
      content: "Salam ! Je suis votre assistant de voyage pour le Maroc 🇲🇦. Dites-moi où vous souhaitez aller, la durée de votre séjour ou votre budget !",
      createdAt: new Date().toISOString(),
    },
  ],
  isTyping: false,
  isStreaming: false,
  streamingText: "",
  error: null,
  socketConnected: true,

  // Initialisation (charge l'historique sans besoin de WebSocket)
  initChatSocket: async () => {
    await get().loadHistory();
  },

  // Envoi d'un message utilisateur via HTTP REST
  sendMessage: async (content) => {
    if (!content || !content.trim()) return;

    const trimmed = content.trim();
    const userMsg = {
      id: "user-" + Date.now(),
      sender: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
      error: null,
    }));

    try {
      const conversationId = get().currentConversationId;
      const res = await chatApi.sendMessage(conversationId, trimmed);

      if (res?.data) {
        const { conversationId: newConvId, assistantMessage } = res.data;
        if (newConvId && !get().currentConversationId) {
          set({ currentConversationId: newConvId });
        }

        const newMsg = {
          id: assistantMessage.id || "assistant-" + Date.now(),
          sender: "assistant",
          content: assistantMessage.content,
          createdAt: assistantMessage.createdAt || new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, newMsg],
          isTyping: false,
        }));
      }
    } catch (err) {
      console.error("Erreur sendMessage HTTP:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Erreur de communication avec l'assistant.";
      set({
        error: errMsg,
        isTyping: false,
      });
    }
  },

  // Confirmation d'un plan de voyage proposé par l'IA via HTTP REST
  confirmTrip: async (tripData) => {
    try {
      set({ isTyping: true, error: null });
      const res = await chatApi.confirmTrip(tripData);
      const trip = res?.data;

      const confirmationMsg = {
        id: "sys-" + Date.now(),
        sender: "assistant",
        content: `🎉 ${res?.message || "Itinéraire enregistré !"}\nVotre voyage à **${trip?.city || "Maroc"}** a été enregistré avec succès !`,
        tripData: trip,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, confirmationMsg],
        isTyping: false,
      }));
    } catch (err) {
      console.error("Erreur confirmTrip HTTP:", err);
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la confirmation du voyage.",
        isTyping: false,
      });
    }
  },

  // Charger l'historique des conversations
  loadHistory: async () => {
    try {
      const response = await tripApi.getConversations();
      if (response?.data && response.data.length > 0) {
        set({ conversations: response.data });
      }
    } catch (err) {
      console.warn("Erreur chargement conversations:", err);
    }
  },

  // Réinitialiser la conversation
  resetChat: () => {
    set({
      currentConversationId: null,
      messages: [
        {
          id: "welcome-1",
          sender: "assistant",
          content: "Salam ! Je suis votre assistant de voyage pour le Maroc 🇲🇦. Dites-moi où vous souhaitez aller, la durée de votre séjour ou votre budget !",
          createdAt: new Date().toISOString(),
        },
      ],
      streamingText: "",
      isTyping: false,
      isStreaming: false,
      error: null,
    });
  },
}));

export default useChatStore;
