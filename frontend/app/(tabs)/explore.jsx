import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/constants/colors";
import { theme } from "../../src/constants/theme";
import PlaceCard from "../../src/components/PlaceCard";
import placeApi from "../../src/services/place.api";

const mockExplorePlaces = [
  {
    id: 1,
    name: "Palais Bahia",
    city: "Marrakech",
    category: "Culture",
    estimatedPriceDh: 50,
    rating: "4.8",
    reviewCount: "2.3k",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    description: "Chef-d'œuvre de l'architecture marocaine du XIXe siècle avec ses cours en marbre.",
  },
  {
    id: 2,
    name: "Jardin Majorelle",
    city: "Marrakech",
    category: "Nature",
    estimatedPriceDh: 70,
    rating: "4.7",
    reviewCount: "1.8k",
    imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
    description: "Jardin botanique emblématique créé par Jacques Majorelle et restauré par Yves Saint Laurent.",
  },
  {
    id: 3,
    name: "Koutoubia",
    city: "Marrakech",
    category: "Culture",
    estimatedPriceDh: 40,
    rating: "4.6",
    reviewCount: "1.4k",
    imageUrl: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800&q=80",
    description: "La plus grande mosquée de Marrakech avec son minaret mythique dominant la ville.",
  },
  {
    id: 4,
    name: "Restaurant Le Jardin",
    city: "Marrakech",
    category: "Restaurants",
    estimatedPriceDh: 140,
    rating: "4.9",
    reviewCount: "3.1k",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    description: "Oasis de verdure au cœur de la médina avec cuisine marocaine raffinée.",
  },
  {
    id: 5,
    name: "Quad & Dromadaire à Agafay",
    city: "Marrakech",
    category: "Activités",
    estimatedPriceDh: 350,
    rating: "4.9",
    reviewCount: "950",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80",
    description: "Aventure inoubliable sur les pistes désertiques au coucher du soleil.",
  },
];

const categoryTabs = ["Lieux", "Restaurants", "Activités"];
const cities = ["Marrakech", "Fès", "Tanger", "Agadir", "Chefchaouen"];

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("Marrakech");
  const [activeCategory, setActiveCategory] = useState("Lieux");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [places, setPlaces] = useState(mockExplorePlaces);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlaces();
  }, [selectedCity, activeCategory]);

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const categoryParam =
        activeCategory === "Lieux"
          ? "Monument"
          : activeCategory === "Restaurants"
          ? "Restaurant"
          : "";

      const res = await placeApi.getPlaces({
        city: selectedCity,
        category: categoryParam,
      });

      if (res?.data && res.data.length > 0) {
        setPlaces(res.data);
      } else {
        // Fallback filtré localement
        const filtered = mockExplorePlaces.filter((p) => {
          if (activeCategory === "Restaurants") return p.category === "Restaurants";
          if (activeCategory === "Activités") return p.category === "Activités";
          return p.category !== "Restaurants" && p.category !== "Activités";
        });
        setPlaces(filtered.length > 0 ? filtered : mockExplorePlaces);
      }
    } catch {
      setPlaces(mockExplorePlaces);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlaces = places.filter((p) =>
    searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* En-tête */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{selectedCity}</Text>

          <TouchableOpacity
            onPress={() => setShowSearch(!showSearch)}
            style={styles.headerBtn}
          >
            <Ionicons name="search-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Barre de recherche optionnelle */}
        {showSearch && (
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un monument, spot..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color={colors.textLight} />
              </TouchableOpacity>
            ) : null}
          </View>
        )}

        {/* Filtres de catégorie : Lieux, Restaurants, Activités */}
        <View style={styles.tabsRow}>
          {categoryTabs.map((tab) => {
            const isActive = activeCategory === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.85}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveCategory(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Liste des lieux */}
        <ScrollView
          contentContainerStyle={styles.scrollList}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionHeading}>Lieux incontournables</Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : filteredPlaces.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={48} color={colors.textLight} />
              <Text style={styles.emptyTitle}>Aucun lieu trouvé</Text>
              <Text style={styles.emptySubtitle}>Essayez une autre recherche ou catégorie.</Text>
            </View>
          ) : (
            filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onPress={() =>
                  router.push(`/plan?city=${selectedCity}`)
                }
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  headerBtn: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSubtle,
    marginHorizontal: 20,
    marginVertical: 8,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.surfaceSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  scrollList: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
});
