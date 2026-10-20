import api from "./api";

export const chatApi = {
  /**
   * Envoyer un message à l'assistant IA
   * @param {number|null} conversationId 
   * @param {string} content 
   */
  async sendMessage(conversationId, content) {
    const response = await api.post("/chat/message", { conversationId, content });
    return response.data;
  },

  /**
   * Confirmer et enregistrer un voyage proposé par l'IA
   * @param {object} tripData 
   */
  async confirmTrip(tripData) {
    const response = await api.post("/chat/confirm-trip", { tripData });
    return response.data;
  },
};

export default chatApi;
