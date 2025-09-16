// Ubicación: app/join.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomButton from "@/components/common/Button";
import CustomTextInput from "@/components/common/TextInput";

const JoinGameScreen = () => {
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const router = useRouter();
  const handleJoinGame = () => {
    if (!pin.trim() || !nickname.trim()) {
      alert("Por favor, introduce un PIN y un apodo");
      return;
    }
    console.log(
      `Uniendo al jugador "${nickname}" a la partida con el PIN: ${pin}`
    );
    router.push({ pathname: "/lobby", params: { nickname } });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.modalContainer} // Contenedor principal que oscurece el fondo
    >
      <View style={styles.contentSheet}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="#A0AEC0" />
        </Pressable>

        <Text style={styles.title}>Unirse a una Partida</Text>
        <CustomTextInput
          placeholder="PIN"
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          maxLength={6}
          style={styles.pinInput}
        />
        <CustomTextInput
          placeholder="Apodo"
          value={nickname}
          onChangeText={setNickname}
          maxLength={15}
        />
        <CustomButton title="Entrar" onPress={handleJoinGame} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  contentSheet: {
    height: "85%",
    backgroundColor: "#1A202C",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 62,
    marginTop: 20,
  },
  pinInput: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    letterSpacing: 8,
    marginBottom: 80,
  },
});

export default JoinGameScreen;