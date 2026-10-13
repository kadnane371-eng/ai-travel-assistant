import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { theme } from "../constants/theme";

// Images par défaut pour les villes marocaines
const cityImages = {
  marrakech: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
  agadir: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&q=80",
  fès: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
  fes: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
  tanger: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800&q=80",
  chefchaouen: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800&q=80",
  essaouira: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
};

export const TripCard = ({
  trip,
  onPress,
  onView,
  onEdit,
  onShare,
  onDelete,
  compact = false,
}) => {
  const cityKey = (trip.city || "marrakech").toLowerCase();
  const imageUri = trip.imageUrl || cityImages[cityKey] || cityImages.marrakech;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress || onView}
      style={[styles.card, compact && styles.compactCard]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        <View style={styles.badgeDays}>
          <Text style={styles.badgeDaysText}>{trip.daysCount || 3} jours</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {trip.city || trip.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{trip.daysCount || 3} jours</Text>
          </View>
          <Text style={styles.metaDot}>•</Text>
          <View style={styles.metaItem}>
            <Ionicons name="wallet-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{trip.budgetTotalDh || 1500} DH</Text>
          </View>
          <Text style={styles.metaDot}>•</Text>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>2 personnes</Text>
          </View>
        </View>

        {!compact && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={onView || onPress}>
              <Ionicons name="eye-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.actionText}>Voir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
              <Ionicons name="create-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.actionText}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
              <Ionicons name="share-social-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.actionText}>Partager</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
              <Text style={[styles.actionText, { color: colors.danger }]}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...theme.shadows.md,
  },
  compactCard: {
    width: 220,
    marginRight: 14,
    marginBottom: 0,
  },
  imageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeDays: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(13, 92, 77, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeDaysText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 4,
  },
  metaDot: {
    marginHorizontal: 6,
    color: colors.textLight,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
    marginLeft: 4,
  },
});

export default TripCard;
