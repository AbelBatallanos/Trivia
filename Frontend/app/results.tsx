import React, { useEffect, useState } from 'react'; // <-- Importar useEffect y useState
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native'; // <-- Importar ActivityIndicator
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getSalaRanking } from '@/api/api'; // <-- Importar la nueva función API
import Podium from '@/components/game/Podium';
import CustomButton from '@/components/common/Button';

// Definir el tipo esperado del ranking
type RankingEntry = {
    id: number;
    nombre_usuario: string;
    puntaje: number;
    aciertos: number;
    fallos: number;
};

const ResultsScreen = () => {
  const router = useRouter();
  // 1. Cambiar los parámetros: esperamos salaId y nickname (opcional)
  const { salaId, nickname = 'Jugador' } = useLocalSearchParams(); 

  const [ranking, setRanking] = useState<RankingEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lógica para cargar el ranking
  useEffect(() => {
    if (!salaId) {
        setIsLoading(false);
        return;
    }

    const fetchRanking = async () => {
      try {
        // Llamar a la API con el ID de la sala
        const response = await getSalaRanking(salaId as string);
        
        // 2. Ordenar los resultados para que el Top 1 esté primero (asumiendo que vienen desordenados)
        const sortedRanking = response.data.sort((a: RankingEntry, b: RankingEntry) => b.puntaje - a.puntaje);

        setRanking(sortedRanking);
      } catch (error) {
        console.error("Error al cargar el ranking:", error);
        // Manejo básico de error, podrías mostrar un mensaje en pantalla
        setRanking([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, [salaId]);
  
  // Si está cargando
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="white" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  // Si no hay ranking o si no hay jugadores
  if (!ranking || ranking.length === 0) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>¡Partida Terminada!</Text>
                <Text style={styles.emptyText}>No hay puntajes disponibles o nadie terminó la partida.</Text>
                <CustomButton
                    title="Volver al Inicio"
                    onPress={() => router.replace('/(tabs)')}
                />
            </View>
        </SafeAreaView>
    );
  }

  // El jugador en la cima (el ganador)
  const topPlayer = ranking[0];
  
  // *** NOTA: El componente Podium solo acepta un jugador. Deberás refactorizarlo
  // para que acepte una lista o adaptarlo. Por ahora, le pasaremos el Top 1. ***

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>¡Partida Terminada!</Text>
        
        {/* Usamos los datos reales del Top 1 */}
        <Podium 
          score={topPlayer.puntaje} 
          nickname={topPlayer.nombre_usuario} 
        />
        
        {/* Muestra el resto de los jugadores (opcional, como lista) */}
        <View style={styles.rankingList}>
            <Text style={styles.rankingHeader}>Clasificación Final</Text>
            {ranking.map((player, index) => (
                <View key={player.id} style={styles.rankingItem}>
                    <Text style={styles.rankingPosition}>{index + 1}.</Text>
                    <Text style={styles.rankingName}>{player.nombre_usuario}</Text>
                    <Text style={styles.rankingScore}>{player.puntaje} pts</Text>
                </View>
            ))}
        </View>

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
  emptyText: {
    color: 'gray',
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center'
  },
  // Nuevos estilos para la lista de ranking
  rankingList: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  rankingHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  rankingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  rankingPosition: {
    color: 'white',
    fontWeight: 'bold',
    width: 30,
  },
  rankingName: {
    color: 'white',
    flex: 1,
  },
  rankingScore: {
    color: '#48BB78',
    fontWeight: 'bold',
  }
});

export default ResultsScreen;