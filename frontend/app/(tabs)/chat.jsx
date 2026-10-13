import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/constants/colors";
import { theme } from "../../src/constants/theme";
import ChatBubble from "../../src/components/ChatBubble";
import { useChatStore } from "../../src/stores/chatStore";

const quickPrompts = [
  "Peux-tu me proposer des activités pour le jour 2 à Marrakech ?",
  "J'ai 1 500 DH pour 3 jours à Marrakech",
  "Quels sont les meilleurs restos à Fès ?",
];

export default function ChatScreen() {
  const router = useRouter();
  const scrollViewRef = useRef(null);

  const {
    messages,
    isTyping,
    isStreaming,
    streamingText,
    socketConnected,
    initChatSocket,
    sendMessage,
    confirmTrip,
    resetChat,
  } = useChatStore();

  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    initChatSocket();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 80);
    }
  }, [messages, streamingText, isTyping]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    const text = inputMessage.trim();
    setInputMessage("");
    sendMessage(text);
  };

  const handleQuickPrompt = (prompt) => {
    sendMessage(prompt);
  };

  const handleConfirmTrip = (tripData) => {
    confirmTrip(tripData);
    Alert.alert(
      "Confirmation",
      "Voulez-vous ouvrir la page détaillée de ce voyage ?",
      [
        { text: "Voir le voyage", onPress: () => router.push("/trip/1") },
        { text: "Continuer le chat", style: "cancel" },
      ]
    );
  };

  const handleCardPress = (card) => {
    sendMessage(`Donne-moi plus d'informations sur : ${card.title}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* En-tête personnalisé identique au mockup */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.agentInfo}>
            <View style={styles.agentAvatarBox}>
              <Ionicons name="hardware-chip-outline" size={20} color={colors.primary} />
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.agentTextColumn}>
              <Text style={styles.agentName}>Assistant de voyage</Text>
              <Text style={styles.agentStatus}>
                {socketConnected ? "En ligne" : "Connecté (mode sécurisé)"}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={resetChat} style={styles.headerBtn}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Liste des messages */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              onConfirmTrip={handleConfirmTrip}
              onCardPress={handleCardPress}
            />
          ))}

          {/* Affichage progressif du texte streamé */}
          {isStreaming && streamingText ? (
            <ChatBubble
              message={{
                id: "streaming-chunk",
                sender: "assistant",
                content: streamingText,
              }}
              isStreaming={true}
            />
          ) : null}

          {/* Indicateur visuel d'attente / typing */}
          {isTyping && !streamingText && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <View style={styles.dot1} />
                <View style={styles.dot2} />
                <View style={styles.dot3} />
              </View>
              <Text style={styles.typingText}>L'assistant prépare sa réponse...</Text>
            </View>
          )}
        </ScrollView>

        {/* Pilules de suggestions rapides (si peu de messages) */}
        {messages.length <= 2 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPromptsRow}
          >
            {quickPrompts.map((prompt, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                style={styles.promptPill}
                onPress={() => handleQuickPrompt(prompt)}
              >
                <Ionicons name="sparkles-outline" size={12} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Zone de saisie */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.plusBtn}>
            <Ionicons name="add" size={22} color={colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Écrivez votre message..."
            placeholderTextColor={colors.textLight}
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
            maxLength={600}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.sendBtn, !inputMessage.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputMessage.trim()}
          >
            <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  agentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  agentAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.online,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  agentTextColumn: {
    marginLeft: 10,
  },
  agentName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  agentStatus: {
    fontSize: 12,
    color: colors.online,
    fontWeight: "500",
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginLeft: 46,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginRight: 10,
  },
  dot1: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginHorizontal: 2,
  },
  dot2: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginHorizontal: 2,
    opacity: 0.7,
  },
  dot3: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginHorizontal: 2,
    opacity: 0.4,
  },
  typingText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  quickPromptsRow: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  promptPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  promptText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  plusBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    ...theme.shadows.sm,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
