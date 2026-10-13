import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/constants/colors";
import { theme } from "../../src/constants/theme";
import { useAuthStore } from "../../src/stores/authStore";

const marrakechAsset = require("../../assets/marrakech.jpg");

const popularDestinations = [
  {
    id: "marrakech",
    name: "Marrakech",
    subtitle: "Ville Ocre & Palais",
    image: marrakechAsset,
    days: "3-5 jours",
  },
  {
    id: "agadir",
    name: "Agadir",
    subtitle: "Plages & Détente",
    image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=700&q=80",
    days: "4-7 jours",
  },
  {
    id: "fes",
    name: "Fès",
    subtitle: "Histoire & Artisanat",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=700&q=80",
    days: "2-4 jours",
  },
  {
    id: "chefchaouen",
    name: "Chefchaouen",
    subtitle: "La Perle Bleue",
    image: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=700&q=80",
    days: "2-3 jours",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");

  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "Voyageur";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête : Salutations & Avatar */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Bonjour {firstName} 👋</Text>
            <Text style={styles.subGreeting}>Où voulez-vous aller ?</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            style={styles.avatarWrapper}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une destination..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => router.push("/(tabs)/explore")}
          />
        </View>

        {/* Carte promotionnelle IA - "Créez votre voyage avec l'IA" */}
        <View style={styles.aiHeroCard}>
          <View style={styles.aiHeroLeft}>
            <Text style={styles.aiHeroTitle}>Créez votre voyage avec l'IA</Text>
            <Text style={styles.aiHeroSubtitle}>
              Décrivez votre voyage idéal et laissez notre IA s'occuper du reste !
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.aiHeroBtn}
              onPress={() => router.push("/plan")}
            >
              <Text style={styles.aiHeroBtnText}>Commencer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.aiRobotWrapper}>
            <View style={styles.aiRobotCircle}>
              <Ionicons name="hardware-chip" size={38} color={colors.primary} />
            </View>
          </View>
        </View>


        {/* Section Destinations Populaires */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Destinations populaires</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {/* Liste horizontale des destinations */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destinationsScroll}
        >
          {popularDestinations.map((dest) => (
            <TouchableOpacity
              key={dest.id}
              activeOpacity={0.9}
              style={styles.destinationCard}
              onPress={() => router.push(`/plan?city=${dest.name}`)}
            >
              <Image
                source={typeof dest.image === "string" ? { uri: dest.image } : dest.image}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <View style={styles.destinationBadge}>
                <Text style={styles.destinationBadgeText}>{dest.days}</Text>
              </View>
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationName}>{dest.name}</Text>
                <Text style={styles.destinationSubtitle}>{dest.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Raccourci rapide vers le Chat Intelligent */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.quickChatBanner}
          onPress={() => router.push("/(tabs)/chat")}
        >
          <View style={styles.quickChatIcon}>
            <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.quickChatContent}>
            <Text style={styles.quickChatTitle}>Besoin d'un conseil instantané ?</Text>
            <Text style={styles.quickChatSubtitle}>
              Discutez en direct avec votre assistant en WebSockets
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  subGreeting: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 2,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.primaryBorder,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 22,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: colors.text,
  },
  aiHeroCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    marginBottom: 28,
    ...theme.shadows.md,
  },
  aiHeroLeft: {
    flex: 1,
    paddingRight: 12,
  },
  aiHeroTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  aiHeroSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  aiHeroBtn: {
    backgroundColor: colors.primary,
    alignSelf: "flex-start",
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  aiHeroBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  aiRobotWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  aiRobotCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  destinationsScroll: {
    paddingBottom: 8,
  },
  destinationCard: {
    width: 160,
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 14,
    position: "relative",
    backgroundColor: "#FFFFFF",
    ...theme.shadows.sm,
  },
  destinationImage: {
    width: "100%",
    height: "100%",
  },
  destinationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  destinationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  destinationInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(13, 92, 77, 0.88)",
    padding: 10,
  },
  destinationName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  destinationSubtitle: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 11,
    marginTop: 2,
  },
  quickChatBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  quickChatIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  quickChatContent: {
    flex: 1,
  },
  quickChatTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  quickChatSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
