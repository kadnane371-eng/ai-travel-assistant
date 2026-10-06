import { Conversation, Message } from "../models/index.js";
import { processChatMessageStream } from "../services/ai.service.js";
import * as tripService from "../services/trip.service.js";

/**
 * Gestionnaire des événements Socket.io pour le chat et l'agent IA
 */
export const registerChatSocket = (io) => {
  io.on("connection", (socket) => {
    const user = socket.user;
    console.log(`🔌 Voyageur connecté via WebSocket : ${user.fullName} (ID: ${user.id})`);

    // Rejoindre une room propre à l'utilisateur
    socket.join(`user_${user.id}`);

    /**
     * Événement 1 : Réception d'un message utilisateur
     */
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, content } = data;

        if (!content || content.trim() === "") {
          return socket.emit("error", { message: "Le message ne peut pas être vide." });
        }

        // Trouver ou créer la conversation
        let conversation = null;
        if (conversationId) {
          conversation = await Conversation.findOne({
            where: { id: conversationId, userId: user.id },
          });
        }

        if (!conversation) {
          conversation = await Conversation.create({
            userId: user.id,
            title: content.slice(0, 35) + "...",
          });
        }

        // Sauvegarder le message de l'utilisateur
        await Message.create({
          conversationId: conversation.id,
          sender: "user",
          content,
        });

        // 1. Indicateur visuel d'écriture
        socket.emit("agent_typing", { isTyping: true });

        // 2. Traitement IA avec streaming token par token
        const fullResponse = await processChatMessageStream(
          content,
          user.id,
          (textChunk) => {
            socket.emit("agent_chunk", {
              conversationId: conversation.id,
              textChunk,
            });
          }
        );

        // 3. Sauvegarder la réponse de l'assistant en base
        await Message.create({
          conversationId: conversation.id,
          sender: "assistant",
          content: fullResponse,
        });

        // 4. Fin de saisie
        socket.emit("agent_typing", { isTyping: false });
      } catch (err) {
        console.error("Erreur lors du traitement send_message:", err.message);
        socket.emit("agent_typing", { isTyping: false });
        socket.emit("error", { message: "Une erreur est survenue lors de la réponse de l'agent." });
      }
    });

    /**
     * Événement 2 : Confirmation d'un plan de voyage par l'utilisateur
     */
    socket.on("confirm_trip", async (data) => {
      try {
        const { tripData } = data;
        const newTrip = await tripService.createTrip(user.id, tripData);

        // Notifier le client de la création du voyage
        socket.emit("trip_created", {
          message: "Votre itinéraire a été enregistré avec succès !",
          trip: newTrip,
        });
      } catch (err) {
        console.error("Erreur confirm_trip:", err.message);
        socket.emit("error", { message: "Impossible de créer le voyage : " + err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Voyageur déconnecté : ${user.fullName}`);
    });
  });
};

export default registerChatSocket;
