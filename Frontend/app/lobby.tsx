import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import CustomButton from "@/components/common/Button";

const GameLobbyScreen = () => {
  const router = useRouter();
  const { quizData: quizDataString, nickname, isHost } = useLocalSearchParams();
  
  const quizData = JSON.parse(quizDataString as string);

  const handleStartGame = () => {
    router.replace({ 
      pathname: '/player', 
      params: { quizData: quizDataString, nickname, isHost } 
    });
  };

 return (
    <SafeAreaView style={styles.container}>
      {/* --- LÓGICA CLAVE AQUÍ --- */}
      {/* Revisa si 'isHost' es 'true' para decidir qué mostrar */}
      {isHost === 'true' ? (
        // --- VISTA DEL HOST ---
        <>
          <Text style={styles.title}>¡Todo listo!</Text>
          <Text style={styles.subtitle}>Usa este PIN para que se unan los jugadores:</Text>
          <View style={styles.pinContainer}>
            <Text style={styles.pinText}>{quizData.codigoUnico}</Text>
          </View>
          <Text style={styles.playersText}>Jugadores Conectados: 1</Text>
          <CustomButton title="Empezar Juego" onPress={handleStartGame} />
        </>
      ) : (
        // --- VISTA DEL JUGADOR ---
        <>
          <Text style={styles.title}>¡Estás dentro!</Text>
          <Text style={styles.subtitle}>Tu apodo es:</Text>
          <Text style={styles.nickname}>{nickname}</Text>
          <Text style={styles.waitingText}>Esperando a que el anfitrión inicie la partida...</Text>
          <CustomButton title="Empezar Juego" onPress={handleStartGame} />
          </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1A202C", justifyContent: "space-around", alignItems: "center", padding: 24 },
    title: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    subtitle: { fontSize: 18, color: 'gray', textAlign: 'center', marginTop: 8 },
    pinContainer: { backgroundColor: 'white', paddingHorizontal: 48, paddingVertical: 24, borderRadius: 8, marginVertical: 20 },
    pinText: { fontSize: 48, fontWeight: 'bold', color: 'black', letterSpacing: 8 },
    playersText: { fontSize: 16, color: 'white', marginBottom: 40 },
    nickname: { fontSize: 28, color: '#3182CE', fontWeight: 'bold', marginVertical: 20 },
    waitingText: { fontSize: 16, color: 'gray', textAlign: 'center' },
});

export default GameLobbyScreen;