import { Conversation, Message } from "../models/index.js";
import { processChatMessage } from "../services/ai.service.js";
import * as tripService from "../services/trip.service.js";

/**
 * Envoi d'un message au chat IA (HTTP REST)
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Le contenu du message est obligatoire.",
      });
    }

    // Trouver ou créer la conversation
    let conversation = null;
    if (conversationId) {
      conversation = await Conversation.findOne({
        where: { id: conversationId, userId },
      });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        title: content.slice(0, 35) + "...",
      });
    }

    // Enregistrer le message utilisateur
    const userMessage = await Message.create({
      conversationId: conversation.id,
      sender: "user",
      content: content.trim(),
    });

    // Générer la réponse de l'agent IA
    const assistantReply = await processChatMessage(content.trim(), userId);

    // Enregistrer le message de l'assistant
    const assistantMessage = await Message.create({
      conversationId: conversation.id,
      sender: "assistant",
      content: assistantReply,
    });

    return res.status(200).json({
      success: true,
      data: {
        conversationId: conversation.id,
        userMessage,
        assistantMessage,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirmation et création d'un voyage suggéré par l'IA (HTTP REST)
 */
export const confirmTrip = async (req, res, next) => {
  try {
    const { tripData } = req.body;
    const userId = req.user.id;

    if (!tripData) {
      return res.status(400).json({
        success: false,
        message: "Les données du voyage (tripData) sont obligatoires.",
      });
    }

    const newTrip = await tripService.createTrip(userId, tripData);

    return res.status(201).json({
      success: true,
      message: "Votre itinéraire a été enregistré avec succès !",
      data: newTrip,
    });
  } catch (error) {
    next(error);
  }
};
