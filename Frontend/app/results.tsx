import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Podium from '@/components/game/Podium';
import CustomButton from '@/components/common/Button';

const ResultsScreen = () => {
  const router = useRouter();
  const { finalScore = '0', nickname = 'Jugador' } = useLocalSearchParams();

  const score = parseInt(finalScore as string, 10);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>¡Partida Terminada!</Text>
        <Podium score={score} nickname={nickname as string} />
        <CustomButton
          title="Volver al Inicio"
          onPress={() => router.replace('/(tabs)')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#39425A',
  },
  content: {
    flex: 1,
    justifyContent: 'space-around', 
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ResultsScreen;