// Ubicación: app/lobby.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomButton from '@/components/common/Button';

const fakeQuizForTesting = {
  questions: [
    { text: '¿Cuál es la capital de Japón?', timeLimit: 20, answers: [{ text: 'Pekín' }, { text: 'Seúl' }, { text: 'Tokio', isCorrect: true }, { text: 'Bangkok' }] },
    { text: '¿Qué elemento tiene el símbolo "O"?', timeLimit: 15, answers: [{ text: 'Oxígeno', isCorrect: true }, { text: 'Oro' }, { text: 'Osmio' }, { text: 'Oganesón' }] },
  ]
};

const GameLobbyScreen = () => {
  const { nickname } = useLocalSearchParams();
  const router = useRouter();

  const handleStartGame = () => {
    const quizDataString = JSON.stringify(fakeQuizForTesting);
    router.replace({ 
      pathname: '/player', 
      params: { quizData: quizDataString, nickname } 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>¡Estás dentro!</Text>
      <Text style={styles.nickname}>{nickname}</Text>
      <Text style={styles.waitingText}>Esperando para empezar la partida...</Text>

      <View style={styles.buttonContainer}>
        <CustomButton 
          title="Empezar Juego" 
          onPress={handleStartGame}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A202C', justifyContent: 'center', alignItems: 'center', padding: 24, gap: 20 },
  welcomeText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  nickname: { fontSize: 24, color: '#3182CE' },
  waitingText: { fontSize: 16, color: 'gray', textAlign: 'center' },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    paddingHorizontal: 24,
  }
});

export default GameLobbyScreen;