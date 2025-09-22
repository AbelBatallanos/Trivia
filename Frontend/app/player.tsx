import { getTriviaQuestions } from "@/api/api";
import FeedbackOverlay from "@/components/game/FeedbackOverlay";
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

const exampleTrivia = [
  {
    text: "¿Cuál es la capital de Japón?",
    timeLimit: 5,
    answers: [
      { text: "Pekín" },
      { text: "Seúl" },
      { text: "Tokio", isCorrect: true },
      { text: "Bangkok" },
    ],
  },
  {
    text: '¿Qué elemento tiene el símbolo "O"?',
    timeLimit: 5,
    answers: [
      { text: "Oxígeno", isCorrect: true },
      { text: "Oro" },
      { text: "Osmio" },
      { text: "Oganesón" },
    ],
  },
];

const answerOptions = [
  { color: "#e53e3e", shape: "triangle" as const },
  { color: "#3182CE", shape: "diamond" as const },
  { color: "#D69E2E", shape: "ellipse" as const },
  { color: "#38A169", shape: "square" as const },
];

type GameState = "loading" | "answering" | "feedback" | "interstitial";

const PlayerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { quizData: quizDataString, nickname, isHost } = params;
  const quizData = JSON.parse(quizDataString as string);

  const [gameState, setGameState] = useState<GameState>("loading");
  const [questions, setQuestions] = useState<any[]>([]); // Almacenará las preguntas del backend
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState({
    show: false,
    isCorrect: false,
    points: 0,
  });
  const [hasAnswered, setHasAnswered] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );

  // const currentQuestion = exampleTrivia[currentQuestionIndex];

  // 1. Cargar las preguntas del backend al iniciar la pantalla
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await getTriviaQuestions(quizData.id);
        if (response.data && response.data.length > 0) {
          setQuestions(response.data);
          setTimeLeft(response.data[0].tiempo_limite);
          setGameState("answering");
        } else {
          Alert.alert("Error", "Esta trivia no tiene preguntas.", [
            { text: "OK", onPress: () => router.replace("/(tabs)") },
          ]);
        }
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
      }
    };
    loadQuestions();
  }, []);

  useEffect(() => {
    if (gameState !== "answering") return;

    if (timeLeft === 0) {
      if (!hasAnswered) {
        setFeedback({ show: true, isCorrect: false, points: 0 });
      }
      showFeedbackAndAdvance();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState, hasAnswered]);

  const handleAnswer = (answerIndex: number) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    setSelectedAnswerIndex(answerIndex);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect =
      currentQuestion.opciones[answerIndex]?.es_correcta || false;
    const points = isCorrect
      ? Math.round(1000 * (timeLeft / currentQuestion.tiempo_limite))
      : 0;

    setTotalScore((prev) => prev + points);
    setFeedback({ show: true, isCorrect, points });
  };

  const showFeedbackAndAdvance = () => {
    setGameState("feedback");

    setTimeout(() => {
      setGameState("interstitial");
      setTimeout(() => {
        goToNextQuestion();
      }, 1500);
    }, 2000);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeLeft(questions[nextIndex].tiempo_limite);
      setHasAnswered(false);
      setSelectedAnswerIndex(null);
      setFeedback({ show: false, isCorrect: false, points: 0 });
      setGameState("answering");
    } else {
      router.replace({
        pathname: "/results",
        params: { finalScore: totalScore.toString(), nickname },
      });
    }
  };

  if (gameState === "loading" || questions.length === 0) {
    return <View style={styles.container}><ActivityIndicator size="large" color="white" /></View>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (gameState === "interstitial") {
    const isLastQuestion = currentQuestionIndex >= exampleTrivia.length - 1;
    return (
      <View style={styles.interstitialContainer}>
        <Text style={styles.interstitialText}>
          {isLastQuestion
            ? "¡Fin de la partida!"
            : `Pregunta ${currentQuestionIndex + 2}`}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.questionCounter}>
          <Text style={styles.counterText}>{`${currentQuestionIndex + 1} de ${questions.length}`}</Text>
        </View>
        <Pressable>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </Pressable>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.questionText}>{currentQuestion.pregunta}</Text>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}</Text>
        </View>
        <View style={styles.answersContainer}>
          {currentQuestion.opciones.map((opcion:any, index:number) => {
            const isSelected = index === selectedAnswerIndex;
            const buttonStyle = hasAnswered
              ? isSelected
                ? styles.selectedButton
                : styles.disabledButton
              : styles.answerButton;

            return (
              <Pressable
                key={opcion.id}
                style={[
                  buttonStyle,
                  { backgroundColor: answerOptions[index % 4].color },
                ]}
                onPress={() => handleAnswer(index)}
                disabled={hasAnswered}
              >
                <Ionicons
                  name={answerOptions[index].shape}
                  size={20}
                  color="white"
                />
                <Text style={styles.answerText}>{opcion.descripcion}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {gameState === "feedback" && feedback.show && (
        <FeedbackOverlay {...feedback} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#39425A" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
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
    backgroundColor: "#39425A",
    justifyContent: "center",
    alignItems: "center",
  },
  interstitialText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },

  selectedButton: {
    width: "48.5%",
    minHeight: 100,
    borderRadius: 8,
    marginBottom: "3%",
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 3,
    borderColor: "white",
    opacity: 1,
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
