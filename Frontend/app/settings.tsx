import CustomButton from "@/components/common/Button";
import CustomTextInput from "@/components/common/TextInput";
import EditorHeader from "@/components/quizCreator/EditorHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

type Answer = { id: number; text: string; isCorrect: boolean };
type Question = { id: number; text: string; answers: Answer[] };

const QuizSettingsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [title, setTitle] = React.useState("");
  const [questions, setQuestions] = React.useState<Question[]>([]);

  useEffect(() => {
    if (params.questions && typeof params.questions === "string") {
      const parsedQuestions = JSON.parse(params.questions);
      setQuestions(parsedQuestions);
    }
  }, [params.questions]);

  const handleSaveQuiz = () => {
    console.log("---TRIVIA FINAL LISTA PARA GUARDAR---");
    console.log("Título:", title);
    console.log("Número de Preguntas:", questions.length);
    console.log("Datos de las Preguntas:", questions);
    console.log("-------------------------------------");

    router.push("/(tabs)");
  };

  const handleLaunchGame = () => {
    if (!title.trim()) {
      alert("Por favor, añade un título a tu trivia.");
      return;
    }

    const quizData = {
      title,
      questions,
    };

    const quizDataString = JSON.stringify(quizData);

    console.log("Lanzando partida con los siguientes datos:", quizDataString);

    router.push({
      pathname: "/lobby",
      params: { quizData: quizDataString, isHost: "true" },
    });
  };

  const handleClose = () => router.back();

  return (
    <SafeAreaView style={styles.container}>
      <EditorHeader onDone={handleClose} />
      <View style={styles.content}>
        <Text style={styles.title}>Ajustes de la Trivia</Text>
        <CustomTextInput
          placeholder="Añade un titulo..."
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.infoText}>
          {" "}
          Has creado {questions.length} preguntas.
        </Text>
        <CustomButton title="Guardar Trivia" onPress={handleSaveQuiz} />
        <CustomButton title="Lanzar Partiva" onPress={handleLaunchGame} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#4A5568" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 32,
  },
  infoText: {
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
});

export default QuizSettingsScreen;
