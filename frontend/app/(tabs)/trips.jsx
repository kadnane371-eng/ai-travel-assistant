import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/constants/colors";
import { theme } from "../../src/constants/theme";
import TripCard from "../../src/components/TripCard";
import CustomButton from "../../src/components/CustomButton";
import { useTripStore } from "../../src/stores/tripStore";

const initialMockTrips = [
  {
    id: "1",
    title: "Week-end à Marrakech",
    city: "Marrakech",
    daysCount: 3,
    budgetTotalDh: 1500,
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Escapade Océane à Agadir",
    city: "Agadir",
    daysCount: 4,
    budgetTotalDh: 2000,
    imageUrl: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&q=80",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Histoire & Patrimoine à Fès",
    city: "Fès",
    daysCount: 2,
    budgetTotalDh: 1000,
    imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
    status: "past",
  },
];

export default function TripsScreen() {
  const router = useRouter();
  const { trips, isLoading, fetchTrips, deleteTrip, filterTab, setFilterTab } =
    useTripStore();

  const [localTrips, setLocalTrips] = useState(initialMockTrips);

  useEffect(() => {
    const load = async () => {
      const fetched = await fetchTrips();
      if (fetched && fetched.length > 0) {
        setLocalTrips(fetched);
      }
    };
    load();
  }, []);

  const displayedTrips = (trips && trips.length > 0 ? trips : localTrips).filter(
    (t) => {
      if (filterTab === "past") return t.status === "past" || t.status === "completed";
      return t.status !== "past" && t.status !== "completed";
    }
  );

  const handleDelete = (tripId) => {
    Alert.alert(
      "Supprimer le voyage",
      "Êtes-vous sûr de vouloir supprimer cet itinéraire ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteTrip(tripId);
            setLocalTrips((prev) => prev.filter((t) => t.id !== tripId));
          },
        },
      ]
    );
  };

  const handleShare = (trip) => {
    Alert.alert("Partage", `Partage du voyage à ${trip.city || "Maroc"} généré avec succès !`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>Mes voyages</Text>
          <TouchableOpacity
            onPress={() => router.push("/plan")}
            style={styles.addBtn}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Onglets : À venir / Passés */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, filterTab === "upcoming" && styles.tabActive]}
            onPress={() => setFilterTab("upcoming")}
          >
            <Text
              style={[
                styles.tabText,
                filterTab === "upcoming" && styles.tabTextActive,
              ]}
            >
              À venir
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, filterTab === "past" && styles.tabActive]}
            onPress={() => setFilterTab("past")}
          >
            <Text
              style={[
                styles.tabText,
                filterTab === "past" && styles.tabTextActive,
              ]}
            >
              Passés
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenu : Liste des voyages */}
        <ScrollView
          contentContainerStyle={styles.scrollList}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && trips.length === 0 ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : displayedTrips.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="map-outline" size={40} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Aucun voyage dans cet onglet</Text>
              <Text style={styles.emptySubtitle}>
                Laissez notre agent IA concevoir un itinéraire sur mesure en quelques secondes !
              </Text>
              <CustomButton
                title="Planifier avec l'IA"
                onPress={() => router.push("/plan")}
                size="md"
                style={{ marginTop: 20 }}
              />
            </View>
          ) : (
            displayedTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onView={() => router.push(`/trip/${trip.id}`)}
                onEdit={() => router.push(`/plan?city=${trip.city}`)}
                onShare={() => handleShare(trip)}
                onDelete={() => handleDelete(trip.id)}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.sm,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  scrollList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
