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

// Opciones de respuesta (formas y colores)
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

  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  // 1. Conexión del Socket
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

  // 2. Manejador de eventos del servidor
  const handleSocketMessage = (data: any) => {
    switch (data.action) {
      case "game_started":
        setGameState("loading");
        setTotalScore(0);
        setFeedbackMessage("");
        break;

      case "question_start":
        setCurrentQuestionIndex(data.question_index);
        setCurrentQuestionData(data.question);
        setTimeLeft(data.question.tiempo_limite);

        setCorrectAnswerId(null);
        setHasAnswered(false);
        setSelectedAnswerIndex(null);
        setFeedbackMessage("");
        setGameState("answering");
        break;

      case "answer_feedback":
        const isCorrect = data.is_correct;
        const pointsAwarded = data.points_awarded;

        setFeedbackMessage(
          `${isCorrect ? "¡Correcto!" : "Incorrecto"} +${pointsAwarded} Puntos`
        );

        if (data.total_score !== undefined) {
          setTotalScore(data.total_score);
        }
        break;

      case "question_end":
        setCorrectAnswerId(data.correct_option_id);
        setGameState("feedback");

        if (!hasAnswered) {
          // setFeedbackMessage("Sin respuesta. 0 Puntos");
        }
        break;

      case "game_finish":
        console.log("GAME_FINISH RECEIVED. Redirecting...");
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

  // 3. Timer visual
  useEffect(() => {
    if (gameState !== "answering" && gameState !== "answered") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  // 4. Lógica de respuesta
  const handleAnswer = (answerIndex: number) => {
    if (hasAnswered || gameState !== "answering" || !currentQuestionData)
      return;

    setHasAnswered(true);
    setSelectedAnswerIndex(answerIndex);

    sendSocketMessage("submit_answer", {
      question_id: currentQuestionData.id,
      opcion_id: currentQuestionData.opciones[answerIndex].id,
    });

    setGameState("answered");
  };

  // Pantalla de espera (loading)
  if (gameState === "loading" || !currentQuestionData) {
    return (
      <View style={styles.interstitialContainer}>
        <Ionicons
          name="game-controller-outline"
          size={80}
          color={COLORS.primary}
          style={styles.loadingIcon}
        />
        <ActivityIndicator
          size="large"
          color="white"
          style={styles.loadingIndicator}
        />
        <Text style={styles.loadingTitle}>Esperando inicio de partida</Text>
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
  const questionNumber = currentQuestionIndex + 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.questionCounter}>
          <Text style={styles.counterText}>{`Pregunta ${questionNumber}`}</Text>
        </View>
        <Text style={styles.scoreDisplay}>Puntaje: {totalScore}</Text>
        <Pressable>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </Pressable>
      </View>

      <View style={styles.mainContent}>
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
            const isCorrectOption = opcion.id === correctAnswerId;
            const isRevealed = gameState === "feedback";

            const backgroundColor = isRevealed
              ? isCorrectOption
                ? "#38A169"
                : "#E53E3E"
              : answerOptions[index % 4].color;

            const opacityStyle =
              isRevealed && !isCorrectOption && !isSelected
                ? { opacity: 0.4 }
                : {};

            const borderStyle =
              isSelected && gameState !== "answering"
                ? styles.selectedButtonBorder
                : {};

            return (
              <Pressable
                key={opcion.id}
                style={[
                  styles.answerButton,
                  { backgroundColor },
                  opacityStyle,
                  borderStyle,
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

// Estilos finales
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
  },
  answerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  interstitialContainer: {
    flex: 1,
    backgroundColor: "#1A202C",
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  loadingSubtitle: {
    color: "#A0AEC0",
    fontSize: 16,
    textAlign: "center",
  },
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
  selectedButtonBorder: {
    borderWidth: 3,
    borderColor: "white",
  },
});

export default PlayerScreen;

