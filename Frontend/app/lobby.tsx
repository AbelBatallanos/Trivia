// frontend/app/lobby.tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Alert, Dimensions, ScrollView } from "react-native"; // Importar ScrollView y Dimensions
import { Ionicons } from "@expo/vector-icons"; 

import CustomButton from "@/components/common/Button";
import { closeSalaSocket, connectSalaSocket, sendSocketMessage } from "@/api/websocket";
import { COLORS } from "@/constants/colors"; 

type Player = { nickname: string, id: number };
const { width } = Dimensions.get('window');

const GameLobbyScreen = () => {
  const router = useRouter();
  const { quizData: quizDataString, nickname, isHost } = useLocalSearchParams();
  const quizData = JSON.parse(quizDataString as string);

  const [players, setPlayers] = useState<Player[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lobbyMessage, setLobbyMessage] = useState(""); 
  
  // Usar el nickname del usuario actual para resaltarlo en la lista
  const currentNickname = nickname ? nickname.toString() : 'Anfitrión'; 

  // ... (handleSocketMessage, handleConnectionStatus, useEffect, handleStartGame - Lógica sin cambios)

  const handleSocketMessage = (data: any) => {
    // console.log("Mensaje de WS recibido: ", data.action)
    
    // K - Muestra el mensaje de notificación del servidor
    if (data.message) setLobbyMessage(data.message); 

    if (data.action === 'lobby_update' && data.players){
      // K - ACTIVA: Actualiza la lista completa (Soluciona el contador y reconexión)
      setPlayers(data.players);
      return; 
    }

    if (data.action === 'game_started') {
      // K - ACCIÓN FINAL: El servidor da la señal, navegamos a la partida
      router.replace({ 
          pathname: '/player', 
          params: { quizData: quizDataString, nickname, isHost, salaId: quizData.id } 
      });
      return;
    }

    if (data.action === 'error') {
        // Muestra el error del servidor (ej. "Solo el host puede iniciar")
        Alert.alert("Error del Juego", data.message);
    }
  }

  const handleConnectionStatus = (status: boolean) => {
    setIsConnected(status);
  }

  // 2. Conexión y Desconexión del Socket (Ciclo de Vida)
  useEffect(() => {
    // K - Código para unirse a la sala vía WebSocket
    connectSalaSocket(quizData.codigoUnico, handleSocketMessage, handleConnectionStatus);

    // K - Limpia el socket al salir del lobby
    return () => {
        closeSalaSocket();
    };
  }, []); // Se ejecuta solo una vez al montar

  // K - Lógica para el botón "Empezar Juego" (Solo para Host)
  const handleStartGame = () => {
    if (isHost === 'true' && isConnected) {
      // El backend verifica que players.length > 0
      sendSocketMessage('start_game', {});
    } 
    // No necesitamos el 'else' de console.log aquí, el botón lo maneja con disabled
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {isHost === "true" ? (
          <>
            <Text style={styles.headerSubtitle}>PIN de la Partida</Text>
            <Text style={styles.headerPinText}>{quizData.codigoUnico}</Text>
          </>
        ) : (
          <>
            <Text style={styles.headerSubtitle}>¡Estás en la Sala!</Text>
            <Text style={styles.headerNickname}>{currentNickname}</Text>
          </>
        )}
        <Text style={[styles.statusText, { color: isConnected ? '#48BB78' : '#e53e3e' }]}>
            {isConnected ? 'Conectado' : 'Desconectado'}
        </Text>
      </View>

      <View style={styles.body}>
          {/* Contador de jugadores en grande y centrado */}
          <View style={styles.playersCounterContainer}>
             <Text style={styles.playersCounterNumber}>{players.length}</Text>
             <Text style={styles.playersCounterLabel}>
                {players.length === 1 ? 'Jugador Conectado' : 'Jugadores Conectados'}
            </Text>
          </View>
          
          {/* Cuadrícula de jugadores con scroll */}
          <ScrollView style={styles.playersListScroll} contentContainerStyle={styles.playersGridContainer}>
            {players.map((player) => {
                const isCurrentPlayer = player.nickname === currentNickname;
                return (
                    <View 
                        key={player.id} 
                        style={[
                            styles.playerItem,
                            isCurrentPlayer && styles.currentPlayerItem // Resaltar el propio jugador
                        ]}
                    >
                        <View style={styles.playerIcon}>
                            <Ionicons 
                                name={isCurrentPlayer ? "flash" : "person"} // Icono diferente para el jugador actual
                                size={20} 
                                color="white" 
                            />
                        </View>
                        <Text style={styles.playerNickname} numberOfLines={1}>{player.nickname}</Text>
                    </View>
                )})}
          </ScrollView>

          <View style={styles.footer}>
            {isHost === 'true' ? (
                <CustomButton 
                    title={isConnected ? (players.length === 0 ? "Esperando jugadores..." : "Empezar Juego") : "Conectando..."} 
                    onPress={handleStartGame} 
                    disabled={!isConnected || players.length === 0} 
                />
            ) : (
                <Text style={styles.waitingText}>
                    {isConnected ? "Esperando a que el anfitrión inicie la partida..." : "Reconectando..."}
                </Text>
            )}
            </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A202C",
  },
  
  // --- HEADER MEJORADO ---
  header: {
    padding: 20,
    backgroundColor: '#2D3748', // Un poco más claro que el fondo
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  headerSubtitle: { 
    fontSize: 16, 
    color: '#A0AEC0', 
    marginBottom: 4 
  },
  headerPinText: {
    fontSize: 40,
    fontWeight: "bold",
    color: 'white',
    letterSpacing: 4,
  },
  headerNickname: {
    fontSize: 28,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  statusText: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 14,
  },
  
  // --- BODY (Contenido Principal) ---
  body: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  
  // --- CONTADOR GRANDE ---
  playersCounterContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  playersCounterNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  playersCounterLabel: {
    fontSize: 18,
    color: '#A0AEC0',
    marginTop: -10,
  },

  // --- LISTA DE JUGADORES ---
  playersListScroll: {
    flex: 1, // Permite que el ScrollView tome el espacio restante
    width: '100%',
    marginVertical: 20,
  },
  playersGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  playerItem: {
    alignItems: 'center',
    margin: 10,
    width: width / 4 - 20, // 4 jugadores por fila en ancho estándar
  },
  currentPlayerItem: {
    // Estilo para el jugador actual (un poco más de distinción)
    backgroundColor: '#38A169', 
    borderRadius: 8,
    padding: 5,
  },
  playerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  playerNickname: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // --- FOOTER/BOTÓN ---
  footer: {
    width: '100%',
    paddingTop: 10,
    marginBottom: 20,
  },
  waitingText: { 
    fontSize: 16, 
    color: "gray", 
    textAlign: "center",
    padding: 16,
  },
});

export default GameLobbyScreen;