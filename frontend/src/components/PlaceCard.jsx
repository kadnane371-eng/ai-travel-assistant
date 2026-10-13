import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { theme } from "../constants/theme";

const defaultImages = [
  "https://images.unsplash.com/photo-1548013146-72479768bada?w=700&q=80",
  "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=700&q=80",
  "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=700&q=80",
];

export const PlaceCard = ({ place, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const imageUri =
    place.imageUrl || defaultImages[(place.id || 0) % defaultImages.length];

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? colors.danger : colors.danger}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {place.name}
        </Text>

        <Text style={styles.categoryPrice}>
          {place.category || "Monument"} •{" "}
          <Text style={styles.price}>{place.estimatedPriceDh || 50} DH</Text>
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={colors.star} />
          <Text style={styles.ratingText}>
            {" "}
            {place.rating || "4.8"}{" "}
            <Text style={styles.reviewsText}>
              ({place.reviewCount || "2.1k"} avis)
            </Text>
          </Text>
        </View>
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
  imageContainer: {
    height: 160,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.sm,
  },
  info: {
    padding: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  categoryPrice: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
  },
  price: {
    color: colors.primary,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    marginLeft: 2,
  },
  reviewsText: {
    fontWeight: "400",
    color: colors.textMuted,
  },
});

export default PlaceCard;
