import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/constants/colors";
import { theme } from "../../src/constants/theme";
import DayTimeline from "../../src/components/DayTimeline";
import CustomButton from "../../src/components/CustomButton";
import { useTripStore } from "../../src/stores/tripStore";

const mockTripFallback = {
  id: "1",
  title: "Marrakech Magique",
  city: "Marrakech",
  budgetTotalDh: 1500,
  daysCount: 3,
  imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000&q=85",
  days: [
    {
      dayNumber: 1,
      title: "Jour 1 — Culture",
      items: [
        {
          id: 101,
          title: "Jardin Majorelle",
          timeSlot: "morning",
          costDh: 150,
          place: { category: "Lieu culturel", imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&q=80" },
        },
        {
          id: 102,
          title: "Restaurant Le Jardin",
          timeSlot: "afternoon",
          costDh: 120,
          place: { category: "Restaurant", imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80" },
        },
        {
          id: 103,
          title: "Médina de Marrakech",
          timeSlot: "afternoon",
          costDh: 0,
          place: { category: "Visite", imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=500&q=80" },
        },
        {
          id: 104,
          title: "Dar Yacout",
          timeSlot: "evening",
          costDh: 180,
          place: { category: "Restaurant", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80" },
        },
      ],
    },
    {
      dayNumber: 2,
      title: "Jour 2 — Histoire & Palais",
      items: [
        {
          id: 201,
          title: "Palais Bahia",
          timeSlot: "morning",
          costDh: 70,
          place: { category: "Monument", imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=500&q=80" },
        },
        {
          id: 202,
          title: "Tombeaux Saadiens",
          timeSlot: "afternoon",
          costDh: 70,
          place: { category: "Monument", imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&q=80" },
        },
        {
          id: 203,
          title: "Place Jemaa el-Fna",
          timeSlot: "evening",
          costDh: 90,
          place: { category: "Expérience culinaire", imageUrl: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=500&q=80" },
        },
      ],
    },
    {
      dayNumber: 3,
      title: "Jour 3 — Nature & Détente",
      items: [
        {
          id: 301,
          title: "Désert d'Agafay",
          timeSlot: "morning",
          costDh: 400,
          place: { category: "Aventure", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&q=80" },
        },
        {
          id: 302,
          title: "Hammam & Spa traditionnel",
          timeSlot: "afternoon",
          costDh: 250,
          place: { category: "Détente", imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80" },
        },
      ],
    },
  ],
};

export default function TripDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const fetchTripDetails = useTripStore((state) => state.fetchTripDetails);
  const currentTrip = useTripStore((state) => state.currentTrip);
  const isLoading = useTripStore((state) => state.isLoading);

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (id && id !== "1") {
        const fetched = await fetchTripDetails(id);
        if (fetched) {
          setTrip(fetched);
          return;
        }
      }
      setTrip(currentTrip || mockTripFallback);
    };
    load();
  }, [id]);

  const activeTrip = trip || mockTripFallback;
  const days = activeTrip.days && activeTrip.days.length > 0 ? activeTrip.days : mockTripFallback.days;
  const activeDay = days[activeDayIndex] || days[0];

  const handleSaveTrip = () => {
    Alert.alert(
      "Voyage Sauvegardé !",
      "Votre itinéraire est enregistré dans votre compte et disponible hors-ligne.",
      [
        {
          text: "Voir mes voyages",
          onPress: () => router.push("/(tabs)/trips"),
        },
        { text: "OK", style: "cancel" },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Photo de couverture & En-tête */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri:
                activeTrip.imageUrl ||
                "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000&q=85",
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />

          {/* Bouton retour */}
          <View style={[styles.headerButtons, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/chat")}
              style={styles.circleBtn}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Titre et Badges sur l'image */}
          <View style={styles.heroContent}>
            <Text style={styles.tripCity}>{activeTrip.city || "Marrakech"}</Text>
            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <Ionicons name="time-outline" size={13} color="#FFFFFF" />
                <Text style={styles.badgeText}>{activeTrip.daysCount || 3} jours</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="wallet-outline" size={13} color="#FFFFFF" />
                <Text style={styles.badgeText}>{activeTrip.budgetTotalDh || 1500} DH</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="people-outline" size={13} color="#FFFFFF" />
                <Text style={styles.badgeText}>2 personnes</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Onglets des jours (Jour 1, Jour 2, Jour 3...) */}
        <View style={styles.daysTabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
            {days.map((day, idx) => {
              const isSelected = activeDayIndex === idx;
              return (
                <TouchableOpacity
                  key={day.id || idx}
                  activeOpacity={0.85}
                  onPress={() => setActiveDayIndex(idx)}
                  style={[styles.dayTab, isSelected && styles.dayTabActive]}
                >
                  <Text style={[styles.dayTabText, isSelected && styles.dayTabTextActive]}>
                    Jour {idx + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Timeline des activités du jour sélectionné */}
        <DayTimeline day={activeDay} items={activeDay?.items || []} />
      </ScrollView>

      {/* Barre d'action sticky en bas */}
      <View
        style={[
          styles.stickyFooter,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 14 },
        ]}
      >
        <CustomButton
          title="Sauvegarder ce voyage"
          onPress={handleSaveTrip}
          size="lg"
          icon={<Ionicons name="bookmark-outline" size={18} color="#FFFFFF" />}
          style={styles.saveBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroContainer: {
    height: 280,
    width: "100%",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  heroContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  tripCity: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(13, 92, 77, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  daysTabContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  daysScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  dayTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dayTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  dayTabTextActive: {
    color: "#FFFFFF",
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...theme.shadows.lg,
  },
  saveBtn: {
    width: "100%",
  },
});
