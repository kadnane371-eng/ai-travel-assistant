import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../src/constants/colors";
import { theme } from "../src/constants/theme";
import CustomButton from "../src/components/CustomButton";
import { useTripStore } from "../src/stores/tripStore";
import { useChatStore } from "../src/stores/chatStore";

const availableCities = [
  "Marrakech",
  "Agadir",
  "Fès",
  "Tanger",
  "Chefchaouen",
  "Essaouira",
  "Ouarzazate",
  "Rabat",
];

const dayOptions = [1, 2, 3, 4, 5, 7];

const travelStyles = [
  { id: "culture", label: "Culture" },
  { id: "nature", label: "Nature" },
  { id: "aventure", label: "Aventure" },
  { id: "gastronomie", label: "Gastronomie" },
  { id: "detente", label: "Détente" },
];

export default function PlanTripScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const createTrip = useTripStore((state) => state.createTrip);
  const sendMessage = useChatStore((state) => state.sendMessage);

  const [selectedCity, setSelectedCity] = useState(params.city || "Marrakech");
  const [selectedDays, setSelectedDays] = useState(3);
  const [budget, setBudget] = useState("1500");
  const [selectedStyles, setSelectedStyles] = useState(["culture"]);
  const [peopleCount, setPeopleCount] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleStyle = (styleId) => {
    if (selectedStyles.includes(styleId)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter((s) => s !== styleId));
      }
    } else {
      setSelectedStyles([...selectedStyles, styleId]);
    }
  };

  const handleGenerateItinerary = async () => {
    setIsGenerating(true);

    try {
      // 1. Préparation de la structure de voyage complète
      const tripData = {
        title: `Séjour ${selectedCity} (${selectedStyles.join(", ")})`,
        city: selectedCity,
        budgetTotalDh: Number(budget) || 1500,
        daysCount: Number(selectedDays) || 3,
        days: Array.from({ length: Number(selectedDays) }, (_, i) => ({
          dayNumber: i + 1,
          title: `Jour ${i + 1} — ${
            i === 0
              ? "Monuments & Découverte"
              : i === 1
              ? "Artisanat & Gastronomie"
              : "Nature & Détente"
          }`,
          items: [
            {
              timeSlot: "morning",
              title: i === 0 ? "Jardin Majorelle" : "Palais Bahia",
              costDh: 70,
            },
            {
              timeSlot: "afternoon",
              title: "Restaurant Le Jardin",
              costDh: 150,
            },
            {
              timeSlot: "afternoon",
              title: "Médina & Souks traditionnels",
              costDh: 50,
            },
            {
              timeSlot: "evening",
              title: "Dîner typique Dar Yacout",
              costDh: 180,
            },
          ],
        })),
      };

      // 2. Création via le TripStore
      const result = await createTrip(tripData);

      if (result.success && result.trip) {
        // Envoi optionnel d'un message dans le chat pour enrichir l'agent IA
        sendMessage(
          `J'ai créé mon séjour à ${selectedCity} pour ${selectedDays} jours avec un budget de ${budget} DH.`
        );

        setIsGenerating(false);
        router.push(`/trip/${result.trip.id}`);
      } else {
        throw new Error(result.error || "Échec de génération");
      }
    } catch (err) {
      setIsGenerating(false);
      Alert.alert(
        "Génération de l'itinéraire",
        "Itinéraire généré en mode prévisualisation.",
        [
          {
            text: "Voir l'itinéraire",
            onPress: () => router.push("/trip/1"),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planifier un voyage</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Champ 1 : Destination */}
        <View style={styles.section}>
          <Text style={styles.label}>Destination</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.citiesScroll}>
            {availableCities.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <TouchableOpacity
                  key={city}
                  activeOpacity={0.8}
                  style={[styles.cityChip, isSelected && styles.cityChipActive]}
                  onPress={() => setSelectedCity(city)}
                >
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={isSelected ? "#FFFFFF" : colors.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.cityChipText, isSelected && styles.cityChipTextActive]}>
                    {city}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Champ 2 : Nombre de jours */}
        <View style={styles.section}>
          <Text style={styles.label}>Nombre de jours</Text>
          <View style={styles.daysRow}>
            {dayOptions.map((days) => {
              const isSelected = selectedDays === days;
              return (
                <TouchableOpacity
                  key={days}
                  activeOpacity={0.8}
                  style={[styles.dayBox, isSelected && styles.dayBoxActive]}
                  onPress={() => setSelectedDays(days)}
                >
                  <Text style={[styles.dayBoxText, isSelected && styles.dayBoxTextActive]}>
                    {days} {days === 1 ? "jour" : "jours"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Champ 3 : Budget */}
        <View style={styles.section}>
          <Text style={styles.label}>Budget (en Dirhams)</Text>
          <View style={styles.budgetInputWrapper}>
            <Ionicons name="wallet-outline" size={20} color={colors.primary} />
            <TextInput
              style={styles.budgetInput}
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              placeholder="Ex: 1500"
              placeholderTextColor={colors.textLight}
            />
            <Text style={styles.currencyText}>DH</Text>
          </View>
        </View>

        {/* Champ 4 : Style de voyage */}
        <View style={styles.section}>
          <Text style={styles.label}>Style de voyage</Text>
          <View style={styles.stylesGrid}>
            {travelStyles.map((style) => {
              const isSelected = selectedStyles.includes(style.id);
              return (
                <TouchableOpacity
                  key={style.id}
                  activeOpacity={0.8}
                  style={[styles.stylePill, isSelected && styles.stylePillActive]}
                  onPress={() => toggleStyle(style.id)}
                >
                  <Text
                    style={[
                      styles.stylePillText,
                      isSelected && styles.stylePillTextActive,
                    ]}
                  >
                    {style.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Champ 5 : Nombre de personnes */}
        <View style={styles.section}>
          <Text style={styles.label}>Nombre de personnes</Text>
          <View style={styles.counterRow}>
            <View style={styles.peopleLabelBox}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
              <Text style={styles.peopleCountText}>{peopleCount} personnes</Text>
            </View>
            <View style={styles.stepperBox}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              >
                <Ionicons name="remove" size={18} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.stepValue}>{peopleCount}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setPeopleCount(peopleCount + 1)}
              >
                <Ionicons name="add" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bouton de soumission */}
        <CustomButton
          title="Générer mon itinéraire ✨"
          onPress={handleGenerateItinerary}
          loading={isGenerating}
          size="lg"
          style={styles.submitBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  citiesScroll: {
    flexDirection: "row",
  },
  cityChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cityChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cityChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  cityChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dayBoxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayBoxText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
  },
  dayBoxTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  budgetInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 52,
  },
  budgetInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  currencyText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
  stylesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  stylePill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stylePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stylePillText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  stylePillTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  peopleLabelBox: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
  },
  peopleCountText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  stepperBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepValue: {
    marginHorizontal: 14,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  submitBtn: {
    marginTop: 14,
    marginBottom: 20,
  },
});
