import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { theme } from "../constants/theme";

// Activités suggérées enrichies pour l'affichage visuel
const mockSuggestedCards = [
  {
    title: "Excursion dans la vallée de l'Ourika",
    category: "Nature",
    price: "150 DH",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
  },
  {
    title: "Visite du Jardin Secret",
    category: "Culture",
    price: "100 DH",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80",
  },
  {
    title: "Quad dans le désert d'Agafay",
    category: "Aventure",
    price: "400 DH",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&q=80",
  },
];

export const ChatBubble = ({ message, isStreaming = false, onConfirmTrip, onCardPress }) => {
  const isUser = message.sender === "user";

  // Détecte si le message suggère des activités pour afficher les jolies cartes du mockup
  const hasActivityCards =
    !isUser &&
    (message.content.toLowerCase().includes("activités") ||
      message.content.toLowerCase().includes("jour 2") ||
      message.content.toLowerCase().includes("recommand") ||
      message.hasCards);

  if (isUser) {
    return (
      <View style={styles.userContainer}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.aiContainer}>
      <View style={styles.aiAvatarWrapper}>
        <View style={styles.aiAvatar}>
          <Ionicons name="hardware-chip-outline" size={20} color={colors.primary} />
        </View>
      </View>

      <View style={styles.aiContent}>
        <View style={styles.aiBubble}>
          <Text style={styles.aiText}>{message.content}</Text>
          {isStreaming && (
            <View style={styles.cursorWrapper}>
              <View style={styles.blinkingCursor} />
            </View>
          )}
        </View>

        {/* Cartes interactives d'activités (identiques au design) */}
        {hasActivityCards && (
          <View style={styles.cardsContainer}>
            {mockSuggestedCards.map((card, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.88}
                onPress={() => onCardPress && onCardPress(card)}
                style={styles.cardItem}
              >
                <Image source={{ uri: card.image }} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {card.title}
                  </Text>
                  <Text style={styles.cardMeta}>
                    {card.category} • <Text style={styles.cardPrice}>{card.price}</Text>
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bouton de confirmation si l'IA propose un voyage */}
        {message.tripData && onConfirmTrip && (
          <TouchableOpacity
            style={styles.confirmTripBtn}
            onPress={() => onConfirmTrip(message.tripData)}
          >
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.confirmTripText}>Voir mon itinéraire enregistré</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
    paddingLeft: 48,
  },
  userBubble: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    maxWidth: "85%",
  },
  userText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
  },
  aiContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingRight: 24,
  },
  aiAvatarWrapper: {
    marginRight: 10,
    paddingTop: 2,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  aiContent: {
    flex: 1,
  },
  aiBubble: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...theme.shadows.sm,
  },
  aiText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  cursorWrapper: {
    marginTop: 4,
  },
  blinkingCursor: {
    width: 8,
    height: 14,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  cardsContainer: {
    marginTop: 12,
    gap: 8,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...theme.shadows.sm,
  },
  cardImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  cardPrice: {
    color: colors.primary,
    fontWeight: "600",
  },
  confirmTripBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  confirmTripText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
});

export default ChatBubble;
