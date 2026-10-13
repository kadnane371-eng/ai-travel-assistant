import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { theme } from "../constants/theme";

// Images de secours pour les activités
const defaultPlaceImages = [
  "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80",
  "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=500&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80",
];

export const DayTimeline = ({ day, items = [] }) => {
  const totalCost = items.reduce((acc, item) => acc + (Number(item.costDh) || 0), 0);

  return (
    <View style={styles.container}>
      {/* En-tête du jour */}
      <View style={styles.headerRow}>
        <Text style={styles.dayTitle}>{day?.title || "Jour 1 — Découverte"}</Text>
        <View style={styles.costBadge}>
          <Text style={styles.costBadgeText}>{totalCost > 0 ? `${totalCost} DH estimés` : "450 DH estimés"}</Text>
        </View>
      </View>

      {/* Liste d'étapes avec ligne connectrice */}
      <View style={styles.timelineList}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const imageUri =
            item.place?.imageUrl ||
            defaultPlaceImages[index % defaultPlaceImages.length];

          const categoryLabel =
            item.place?.category ||
            (item.timeSlot === "evening"
              ? "Restaurant"
              : item.timeSlot === "morning"
              ? "Lieu culturel"
              : "Visite");

          return (
            <View key={item.id || index} style={styles.timelineRow}>
              {/* Colonne de gauche : point et ligne connectrice */}
              <View style={styles.trackColumn}>
                <View style={styles.dot}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
                {!isLast && <View style={styles.line} />}
              </View>

              {/* Colonne de droite : Carte de l'activité */}
              <TouchableOpacity activeOpacity={0.88} style={styles.itemCard}>
                <Image source={{ uri: imageUri }} style={styles.thumbnail} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title || item.place?.name}
                  </Text>
                  <Text style={styles.itemCategory}>{categoryLabel}</Text>
                </View>
                {item.costDh > 0 && (
                  <View style={styles.priceTag}>
                    <Text style={styles.priceTagText}>{item.costDh} DH</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  costBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  costBadgeText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 12,
  },
  timelineList: {
    position: "relative",
  },
  timelineRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  trackColumn: {
    width: 28,
    alignItems: "center",
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.primaryBorder,
    marginTop: -2,
    marginBottom: -16,
  },
  itemCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...theme.shadows.sm,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: colors.textMuted,
  },
  priceTag: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primary,
  },
});

export default DayTimeline;
