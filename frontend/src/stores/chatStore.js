import { create } from "zustand";
import { initSocket, getSocket, emitSendMessage, emitConfirmTrip } from "../services/socket";
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
  socketConnected: false,

  // Initialisation et écoute des événements Socket.io
  initChatSocket: async () => {
    try {
      const socket = await initSocket();
      if (!socket) return;

      set({ socketConnected: socket.connected });

      socket.off("connect");
      socket.off("agent_typing");
      socket.off("agent_chunk");
      socket.off("trip_created");
      socket.off("error");

      socket.on("connect", () => {
        set({ socketConnected: true });
      });

      socket.on("disconnect", () => {
        set({ socketConnected: false });
      });

      // Écoute de l'indicateur de saisie de l'agent
      socket.on("agent_typing", (data) => {
        const { isTyping } = data;
        set({ isTyping });

        // Si l'écriture est terminée et qu'on a du texte streamé
        if (!isTyping) {
          const currentStream = get().streamingText;
          if (currentStream && currentStream.trim()) {
            const newAssistantMsg = {
              id: "assistant-" + Date.now(),
              sender: "assistant",
              content: currentStream,
              createdAt: new Date().toISOString(),
            };
            set((state) => ({
              messages: [...state.messages, newAssistantMsg],
              streamingText: "",
              isStreaming: false,
            }));
          }
        }
      });

      // Écoute de chaque chunk de texte streamé
      socket.on("agent_chunk", (data) => {
        const { textChunk, conversationId } = data;
        if (conversationId && !get().currentConversationId) {
          set({ currentConversationId: conversationId });
        }
        set((state) => ({
          isStreaming: true,
          streamingText: state.streamingText + textChunk,
        }));
      });

      // Écoute de la création de voyage
      socket.on("trip_created", (data) => {
        const { message, trip } = data;
        const confirmationMsg = {
          id: "sys-" + Date.now(),
          sender: "assistant",
          content: `🎉 ${message}\nVotre voyage à **${trip?.city || "Maroc"}** a été enregistré avec succès !`,
          tripData: trip,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          messages: [...state.messages, confirmationMsg],
        }));
      });

      // Écoute des erreurs de l'agent
      socket.on("error", (errData) => {
        set({
          error: errData.message || "Une erreur est survenue avec l'assistant.",
          isTyping: false,
          isStreaming: false,
        });
      });
    } catch (err) {
      console.warn("Erreur lors de l'initialisation du chat socket:", err);
    }
  },

  // Envoi d'un message utilisateur
  sendMessage: (content) => {
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
      streamingText: "",
      isStreaming: true,
      error: null,
    }));

    const conversationId = get().currentConversationId;
    emitSendMessage(conversationId, trimmed);
  },

  // Confirmation d'un plan de voyage proposé par l'IA
  confirmTrip: (tripData) => {
    emitConfirmTrip(tripData);
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
