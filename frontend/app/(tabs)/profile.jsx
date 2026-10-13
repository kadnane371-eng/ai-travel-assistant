import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/constants/colors";
import { theme } from "../../src/constants/theme";
import CustomButton from "../../src/components/CustomButton";
import { useAuthStore } from "../../src/stores/authStore";

const menuItems = [
  { id: "trips", title: "Mes voyages", icon: "book-outline", route: "/(tabs)/trips" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous certain de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const displayName = user?.fullName || (isAuthenticated ? "Voyageur" : "Invité");
  const displayEmail = user?.email || (isAuthenticated ? "" : "Non connecté");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon profil</Text>
        </View>

        {/* Bloc utilisateur : Avatar, Nom, Email */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{displayEmail}</Text>
        </View>

        {/* Liste des options du menu */}
        <View style={styles.menuList}>
          {menuItems.map((item, index) => {
            const isLast = index === menuItems.length - 1;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                style={[styles.menuItem, isLast && styles.menuItemLast]}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route);
                  } else {
                    Alert.alert(item.title, `Section ${item.title} accessible prochainement.`);
                  }
                }}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon} size={20} color={colors.text} style={styles.menuIcon} />
                  <Text style={styles.menuText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bouton Se déconnecter */}
        <CustomButton
          title={isAuthenticated ? "Se déconnecter" : "Connexion"}
          onPress={isAuthenticated ? handleLogout : () => router.push("/(auth)/login")}
          variant={isAuthenticated ? "danger" : "primary"}
          size="md"
          style={styles.logoutBtn}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  userCard: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.primaryBorder,
    overflow: "hidden",
    marginBottom: 12,
    ...theme.shadows.md,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textMuted,
  },
  menuList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 16,
    marginBottom: 28,
    ...theme.shadows.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 14,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
  },
  logoutBtn: {
    width: "100%",
  },
});
