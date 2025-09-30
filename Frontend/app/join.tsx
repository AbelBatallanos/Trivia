import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { findTriviaByCode } from "@/api/api"; 
import CustomButton from "@/components/common/Button";
import CustomTextInput from "@/components/common/TextInput";
import { useAuthStore } from "@/store/authstore";

const JoinGameScreen = () => {
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
   const token = useAuthStore((state) => state.token);
  const router = useRouter();
   
  if (!token) {
    router.replace("/auth");
    return null;
  }

  const handleJoinGame = async () => {
    if (!pin.trim() || !nickname.trim()) {
      Alert.alert("Campos incompletos", "Por favor, introduce un PIN y un apodo.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Llamamos a la API para buscar la sala por el PIN
      const response = await findTriviaByCode(pin);
      const quizData = response.data;
      
      // 2. Si la encontramos, navegamos al lobby con los datos de la trivia
      router.push({ 
        pathname: "/lobby", 
        params: { 
          quizData: JSON.stringify(quizData), 
          nickname,
          isHost: 'false' 
        } 
      });

    } catch (error) {
      // 3. Si la API devuelve un error (ej: 404), mostramos una alerta
      console.error("Error al unirse a la sala:", error);
      Alert.alert("PIN no válido", "No se encontró ninguna partida con ese código. Inténtalo de nuevo.");
    } finally {
      // 4. Reactivamos el botón
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.modalContainer}
    >
      <View style={styles.contentSheet}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="#A0AEC0" />
        </Pressable>

        <Text style={styles.title}>Unirse a una Partida</Text>
        <CustomTextInput
          placeholder="PIN"
          value={pin}
          onChangeText={(text) => setPin(text.toUpperCase())}
          autoCapitalize="characters"
          maxLength={8}
          style={styles.pinInput}
        />
        <CustomTextInput
          placeholder="Apodo"
          value={nickname}
          onChangeText={setNickname}
          maxLength={15}
        />
        <CustomButton 
          title={isLoading ? "Buscando..." : "Entrar"} 
          onPress={handleJoinGame}
          disabled={isLoading}
        />
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