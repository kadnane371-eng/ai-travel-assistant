import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../src/constants/colors";
import { theme } from "../src/constants/theme";
import CustomButton from "../src/components/CustomButton";
import { useAuthStore } from "../src/stores/authStore";

const { height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleStart = () => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    } else {
      router.push("/(auth)/login");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dégradé d'assombrissement pour lisibilité optimale */}
        <View style={styles.overlay} />

        <View style={styles.content}>
          {/* Logo et Slogan */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIconCircle}>
              <Ionicons name="airplane" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.logoText}>TravelAI</Text>
            <Text style={styles.tagline}>Your smart travel companion</Text>
          </View>

          {/* Boutons d'action */}
          <View style={styles.bottomSection}>
            <CustomButton
              title="Commencer"
              onPress={handleStart}
              size="lg"
              style={styles.startButton}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(auth)/login")}
              style={styles.loginLink}
            >
              <Text style={styles.loginLinkText}>
                Déjà un compte ?{" "}
                <Text style={styles.loginLinkHighlight}>Se connecter</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.replace("/(tabs)")}
              style={styles.guestLink}
            >
              <Text style={styles.guestText}>Explorer sans compte →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 60, 50, 0.45)",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: height * 0.12,
    paddingBottom: 48,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    ...theme.shadows.lg,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 8,
    fontWeight: "400",
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
  },
  startButton: {
    width: "100%",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  loginLink: {
    marginTop: 20,
    paddingVertical: 8,
  },
  loginLinkText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  loginLinkHighlight: {
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  guestLink: {
    marginTop: 12,
    paddingVertical: 4,
  },
  guestText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
  },
});
