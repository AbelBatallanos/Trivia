// diegofmdev/trivia-prueba-4/trivia-prueba-4-91bcf1b0dfd47a65c9fbd2abce9e5003b070ba58/frontend/app/player.tsx
import {
  closeSalaSocket,
  connectSalaSocket,
  sendSocketMessage,
} from "@/api/websocket";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// K - Variables de configuración visual (formas y colores)
const answerOptions = [
  { color: "#e53e3e", shape: "play" as const, name: "play" as const }, // Rojo
  { color: "#3182CE", shape: "square" as const, name: "square" as const }, // Azul
  { color: "#D69E2E", shape: "ellipse" as const, name: "ellipse" as const }, // Dorado
  { color: "#38A169", shape: "heart" as const, name: "heart" as const }, // Verde
];

type GameState =
  | "loading"
  | "answering"
  | "answered"
  | "feedback"
  | "interstitial"
  | "error";

const PlayerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    quizData: quizDataString,
    nickname,
    isHost,
    salaId: externalSalaId,
  } = params;
  const quizData = JSON.parse(quizDataString as string);
  const salaId = externalSalaId?.toString() || quizData.id.toString();

  const [gameState, setGameState] = useState<GameState>("loading");
  const [currentQuestionData, setCurrentQuestionData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );
  const [correctAnswerId, setCorrectAnswerId] = useState<number | null>(null);

  // K - NUEVO: Estado para el feedback temporal en la UI
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  // 1. Conexión del Socket (WS V3 Flow)
  useEffect(() => {
    if (!salaId) {
      setGameState("error");
      Alert.alert("Error", "ID de Sala no encontrado.");
      return;
    }

    connectSalaSocket(
      quizData.codigoUnico,
      handleSocketMessage,
      (status: boolean) => {
        console.log("Socket connection status:", status);
      }
    );

    return () => {
      closeSalaSocket();
    };
  }, [salaId]);

  // 2. Manejador de eventos del Servidor
  const handleSocketMessage = (data: any) => {
    switch (data.action) {
      case "game_started":
        setGameState("loading");
        setTotalScore(0);
        setFeedbackMessage("");
        break;

      case "question_start":
        // K - Carga la pregunta del servidor.
        setCurrentQuestionIndex(data.question_index);
        setCurrentQuestionData(data.question);
        setTimeLeft(data.question.tiempo_limite);

        // K - Reinicio de estados
        setCorrectAnswerId(null);
        setHasAnswered(false);
        setSelectedAnswerIndex(null);
        setFeedbackMessage(""); // K - Limpiar mensaje
        setGameState("answering"); // Permite responder
        break;

      case "answer_feedback":
        // K - RECIBIDO EL FEEDBACK INDIVIDUAL (PUNTOS Y CORRECTO/INCORRECTO)
        const isCorrect = data.is_correct;
        const pointsAwarded = data.points_awarded;

        // K - ESTO CORRIGE EL MENSAJE: Usa la información real del servidor
        setFeedbackMessage(
          `${isCorrect ? "¡Correcto!" : "Incorrecto"} +${pointsAwarded} Puntos`
        );

        // K - Actualiza el score TOTAL de forma segura con el valor del servidor
        if (data.total_score !== undefined) {
          setTotalScore(data.total_score);
        }

        break;

      case "question_end":
        // K - El servidor finaliza el tiempo y envía resultados (REVELACIÓN GLOBAL).
        setCorrectAnswerId(data.correct_option_id);
        setGameState("feedback"); // Bloquea el juego y muestra la revelación

      // K - CORRECCIÓN: Si el jugador NUNCA respondió (hasAnswered es false),
      // establece el mensaje "Sin respuesta". Si ya tenemos un mensaje, lo mantiene.
      // if (!hasAnswered) {
      //      setFeedbackMessage("Sin respuesta. 0 Puntos");
      // }
      // break;

      case "game_finish":
        // K - DEBUG: Confirma que se recibe el evento
        console.log("GAME_FINISH RECEIVED. Redirecting...");
        // K - Navega a resultados con el ID de la Sala
        router.replace({
          pathname: "/results",
          params: { salaId: salaId.toString(), nickname },
        });
        break;

      case "error":
        Alert.alert("Error del Juego", data.message);
        router.replace("/(tabs)");
        break;
    }
  };

  // 3. El timer es SÓLO VISUAL (Corrección de Sincronización)
  useEffect(() => {
    // K - El timer corre si el estado es 'answering' O 'answered'
    if (gameState !== "answering" && gameState !== "answered") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  // 4. Lógica de Respuesta
  const handleAnswer = (answerIndex: number) => {
    if (hasAnswered || gameState !== "answering" || !currentQuestionData)
      return;

    setHasAnswered(true);
    setSelectedAnswerIndex(answerIndex);

    // **Envía el ID de la opción al SERVIDOR, SIN PUNTOS**
    sendSocketMessage("submit_answer", {
      question_id: currentQuestionData.id,
      opcion_id: currentQuestionData.opciones[answerIndex].id,
    });

    // K - El juego se queda en "answered" para que el timer siga corriendo.
    setGameState("answered");
  };

  // K - Renderizado de carga (Corrige el loading infinito y el texto flotante)
  if (gameState === "loading" || !currentQuestionData) {
    return (
      <View style={styles.interstitialContainer}>
        {/* Ícono grande para darle identidad a la pantalla de espera */}
        <Ionicons
          name="game-controller-outline"
          size={80}
          color={COLORS.primary}
          style={styles.loadingIcon}
        />
        {/* Indicador de actividad */}
        <ActivityIndicator
          size="large"
          color="white"
          style={styles.loadingIndicator}
        />
        {/* Título más legible */}
        <Text style={styles.loadingTitle}>Esperando inicio de partida</Text>
        {/* Subtítulo para más contexto */}
        <Text style={styles.loadingSubtitle}>
          El anfitrión está preparando el juego...
        </Text>
      </View>
    );
  }

  if (gameState === "error") {
    return null;
  }

  const currentQuestion = currentQuestionData;
  const questionNumber = currentQuestionIndex + 1; // K - Para la corrección del NaN

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.questionCounter}>
          {/* K - CORRECIÓN UI: Pregunta #X */}
          <Text style={styles.counterText}>{`Pregunta ${questionNumber}`}</Text>
        </View>
        <Text style={styles.scoreDisplay}>Puntaje: {totalScore}</Text>
        <Pressable>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </Pressable>
      </View>

      <View style={styles.mainContent}>
        {/* K - Mostrar el mensaje de feedback temporal */}
        {gameState === "feedback" && feedbackMessage.length > 0 && (
          <View style={styles.feedbackMessageContainer}>
            <Text
              style={[
                styles.feedbackMessageText,
                {
                  color:
                    feedbackMessage.includes("Incorrecto") ||
                    feedbackMessage.includes("Sin respuesta")
                      ? "#e53e3e"
                      : "#38A169",
                },
              ]}
            >
              {feedbackMessage}
            </Text>
          </View>
        )}

        <Text style={styles.questionText}>{currentQuestion.pregunta}</Text>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}</Text>
        </View>

        <View style={styles.answersContainer}>
          {currentQuestion.opciones.map((opcion: any, index: number) => {
            const isSelected = index === selectedAnswerIndex;
            const isCorrectOption = opcion.id === correctAnswerId; // K - Determina si es la respuesta correcta revelada

            // K - 1. Determinar el estado de revelación
            const isRevealed = gameState === "feedback";

            // K - 2. Determinar el color de fondo (rojo/verde si revelado, color original si no)
            const backgroundColor = isRevealed
              ? isCorrectOption
                ? "#38A169"
                : "#E53E3E" // Verde si es correcta, Rojo si no
              : answerOptions[index % 4].color;

            // K - 3. Determinar la opacidad (atenuar incorrectas no seleccionadas)
            const opacityStyle =
              isRevealed && !isCorrectOption && !isSelected
                ? { opacity: 0.4 }
                : {};

            // K - 4. Determinar el borde (SOLO si fue seleccionado por el usuario y el juego NO está en estado 'answering')
            const borderStyle =
              isSelected && gameState !== "answering"
                ? styles.selectedButtonBorder
                : {};

            return (
              <Pressable
                key={opcion.id}
                style={[
                  styles.answerButton, // Base container/geometry
                  { backgroundColor },
                  opacityStyle,
                  borderStyle, // Aplicar el borde blanco si fue la seleccionada
                ]}
                onPress={() => handleAnswer(index)}
                disabled={hasAnswered || gameState !== "answering"}
              >
                <Ionicons
                  name={answerOptions[index % 4].name}
                  size={20}
                  color="white"
                />
                <Text style={styles.answerText}>{opcion.descripcion}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

// K - ESTILOS COMPLETOS CON scoreDisplay Y BOTONES DE FEEDBACK AÑADIDOS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#39425A" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  scoreDisplay: { color: "white", fontSize: 18, fontWeight: "bold" },
  questionCounter: {
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: "white",
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  questionText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "15%",
  },
  timerContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  answersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: 20,
  },
  answerButton: {
    width: "48.5%",
    minHeight: 100,
    borderRadius: 8,
    marginBottom: "3%",
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    // K - Estilo base sin borde ni opacidad
  },
  answerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },

  interstitialText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },

  interstitialContainer: {
    flex: 1,
    backgroundColor: "#1A202C", // Fondo oscuro para centrado
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingIcon: {
    marginBottom: 40,
  },
  loadingIndicator: {
    marginBottom: 20,
  },
  loadingTitle: {
    color: "white",
    fontSize: 28, // Título grande y claro
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  loadingSubtitle: {
    color: "#A0AEC0", // Subtítulo sutil
    fontSize: 16,
    textAlign: "center",
  },

  // K - NUEVOS ESTILOS PARA EL MENSAJE DE FEEDBACK TEMPORAL
  feedbackMessageContainer: {
    position: "absolute",
    top: "15%",
    zIndex: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  feedbackMessageText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  // K - ESTILO CLAVE: AHORA SÓLO APLICA EL BORDE.
  selectedButtonBorder: {
    borderWidth: 3,
    borderColor: "white",
  },

  // Estilos que se mantienen para el código que usa lógica de color/opacidad directamente en línea.
  correctButton: {
    width: "48.5%",
    minHeight: 100,
    borderRadius: 8,
    marginBottom: "3%",
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    opacity: 1,
  },
  wrongButton: {
    width: "48.5%",
    minHeight: 100,
    borderRadius: 8,
    marginBottom: "3%",
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    opacity: 0.8,
  },
  disabledButton: {
    width: "48.5%",
    minHeight: 100,
    borderRadius: 8,
    marginBottom: "3%",
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    opacity: 0.4,
  },
});

export default PlayerScreen;
