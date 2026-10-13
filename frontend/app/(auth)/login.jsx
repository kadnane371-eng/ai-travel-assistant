import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../src/constants/colors";
import CustomButton from "../../src/components/CustomButton";
import { useAuthStore } from "../../src/stores/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const storeError = useAuthStore((state) => state.error);

  const [email, setEmail] = useState("anas@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setLocalError("Veuillez renseigner tous les champs.");
      return;
    }

    setLocalError("");
    const res = await login(email.trim(), password);

    if (res.success) {
      router.replace("/(tabs)");
    } else {
      setLocalError(res.error || "Échec de connexion.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* En-tête Logo */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="airplane" size={28} color={colors.primary} />
              </View>
              <Text style={styles.logoTitle}>TravelAI</Text>
            </View>
            <Text style={styles.title}>Bon retour !</Text>
            <Text style={styles.subtitle}>
              Connectez-vous pour continuer votre voyage
            </Text>
          </View>

          {/* Message d'erreur s'il y a lieu */}
          {(localError || storeError) ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{localError || storeError}</Text>
            </View>
          ) : null}

          {/* Formulaire */}
          <View style={styles.form}>
            {/* Champ Email */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.textLight}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email ou numéro de téléphone"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Champ Mot de passe */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.textLight}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={colors.textLight}
                />
              </TouchableOpacity>
            </View>

            {/* Se souvenir de moi */}
            <View style={styles.rememberRow}>
              <TouchableOpacity
                style={styles.rememberCheckbox}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    rememberMe && styles.checkboxBoxChecked,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.rememberText}>Se souvenir de moi</Text>
              </TouchableOpacity>
            </View>

            {/* Bouton Se connecter */}
            <CustomButton
              title="Se connecter"
              onPress={handleLogin}
              loading={isLoading}
              size="lg"
              style={styles.submitButton}
            />
          </View>

          {/* Footer Inscription */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Vous n'avez pas de compte ?{" "}
              <Text
                style={styles.footerLink}
                onPress={() => router.push("/(auth)/register")}
              >
                S'inscrire
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconBox: {
    marginRight: 8,
  },
  logoTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dangerLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  form: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: colors.text,
  },
  eyeBtn: {
    padding: 8,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    marginTop: 4,
  },
  rememberCheckbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  checkboxBoxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  submitButton: {
    width: "100%",
    marginTop: 8,
  },
  footer: {
    alignItems: "center",
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "700",
  },
});
