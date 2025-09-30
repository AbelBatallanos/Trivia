import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { createTrivia } from "@/api/api";
import ChecklistModal from "@/components/common/CheckListModal";
import CustomTextInput from "@/components/common/TextInput";
import EditorHeader from "@/components/quizCreator/EditorHeader";
import { Ionicons } from "@expo/vector-icons";

type Answer = { id: number; text: string; isCorrect: boolean };
type Question = { id: number; text: string; answers: Answer[] };

const createNewQuestion = (): Question => ({
  id: Date.now(),
  text: "",
  answers: [
    { id: Date.now() + 1, text: "", isCorrect: false },
    { id: Date.now() + 2, text: "", isCorrect: true },
    { id: Date.now() + 3, text: "", isCorrect: false },
    { id: Date.now() + 4, text: "", isCorrect: false },
  ],
});

const isQuestionComplete = (q: Question) => {
  return (
    q.text.trim().length > 0 &&
    q.answers.filter((a) => a.text.trim().length > 0).length >= 2 &&
    q.answers.some((a) => a.isCorrect)
  );
};

const QuizSettingsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [title, setTitle] = React.useState("");
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isChecklistVisible, setIsChecklistVisible] = useState(false);

  useEffect(() => {
    if (params.questions && typeof params.questions === "string") {
      const parsedQuestions = JSON.parse(params.questions);
      setQuestions(parsedQuestions);
    }
  }, [params.questions]);

  const isTitleComplete = title.trim().length > 0;
  const areQuestionsComplete =
    questions.length > 0 && questions.every(isQuestionComplete);

  const fixQuestion = (index: number) => {
    const questionsWithNew =
      index >= questions.length
        ? [...questions, createNewQuestion()]
        : questions;

    router.replace({
      pathname: "/editor",
      params: {
        questions: JSON.stringify(questionsWithNew),
        selectedIndex: index.toString(),
      },
    });
  };

  const checklistItems = [
    {
      text: "Añadir un título",
      isComplete: isTitleComplete,
      onFix: () => setIsChecklistVisible(false),
    },
    {
      text: "Completar todas las preguntas",
      isComplete: areQuestionsComplete,
      onFix: () => {
        setIsChecklistVisible(false);
        const firstIncompleteIndex = questions.findIndex(
          (q) => !isQuestionComplete(q)
        );
        fixQuestion(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
      },
    },
    // items futuros
    {
      text: "Añadir imagen de portada",
      isComplete: false,
      isOptional: true,
    },
    {
      text: "Añadir al menos 5 preguntas",
      isComplete: questions.length >= 5,
      isOptional: true,
    },
  ];

  const handleAttemptSave = () => {
    if (isTitleComplete && areQuestionsComplete) {
      handleSaveQuiz();
    } else {
      setIsChecklistVisible(true);
    }
  };

  const handleSaveQuiz = async () => {
    setIsSaving(true);

    const quizData = {
      titulo: title,
      categoria: "General", // cambiar por un input
      capacidad: 10, // cambiar por un input
      estado: "publica", // cambiar por un input
      preguntas: questions.map((q, index) => ({
        pregunta: q.text,
        orden: index + 1,
        tiempo_limite: 10, // cambiar por un input
        opciones: q.answers
          .filter((a) => a.text.trim() !== "")
          .map((a) => ({
            descripcion: a.text,
            es_correcta: a.isCorrect,
            puntaje: a.isCorrect ? 1000 : 0,
          })),
      })),
    };
    try {
      await createTrivia(quizData);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Error al guardar la trivia:", error.response?.data);
      Alert.alert("Error", "No se pudo guardar la trivia. Revisa los datos.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Corregimos las props del header */}
      <EditorHeader
        leftButtonText="Cancelar"
        onLeftButtonPress={() => router.back()}
        rightButtonText={isSaving ? "Guardando..." : "Guardar"}
        onRightButtonPress={handleAttemptSave}
        rightButtonColor="#38A169"
        isRightButtonDisabled={isSaving}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Pressable
            style={styles.coverImageContainer}
            onPress={() => alert("Función no implementada")}
          >
            <Ionicons name="image-outline" size={48} color="#A0AEC0" />
            <Text style={styles.coverImageText}>
              Toca para añadir una imagen de portada
            </Text>
          </Pressable>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Título</Text>
            <CustomTextInput
              placeholder="Introduce el título de la trivia..."
              value={title}
              onChangeText={setTitle}
              style={styles.titleInput}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Preguntas ({questions.length})
            </Text>

            {questions.map((question, index) => {
              const isComplete = isQuestionComplete(question);
              return (
                <Pressable
                  key={question.id}
                  style={styles.questionPreview}
                  onPress={() => fixQuestion(index)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <View style={styles.questionNumberContainer}>
                      <Text style={styles.questionNumber}>{index + 1}</Text>
                    </View>
                    <Text style={styles.questionPreviewText} numberOfLines={1}>
                      {question.text || "Pregunta vacía"}
                    </Text>
                  </View>
                  {!isComplete && (
                    <Ionicons name="alert-circle" size={24} color="#e53e3e" />
                  )}
                </Pressable>
              );
            })}
          </View>
          <Pressable
            style={styles.addQuestionButton}
            onPress={() => fixQuestion(questions.length)}
          >
            <Text style={styles.addQuestionText}>Añadir pregunta</Text>
          </Pressable>
        </View>
      </ScrollView>

      <ChecklistModal
        visible={isChecklistVisible}
        items={checklistItems}
        onCancel={() => setIsChecklistVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A202C" },
  scrollView: { flex: 1 },
  content: { flex: 1, padding: 16 },
  coverImageContainer: {
    backgroundColor: "#2D3748",
    height: 180,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  coverImageText: { color: "#A0AEC0", marginTop: 8 },
  section: {
    backgroundColor: "#2D3748",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 16,
  },
  titleInput: {
    backgroundColor: "#1A202C",
    color: "white",
    paddingVertical: 12, 
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 0,
    paddingLeft: 12, 
  },
  questionPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A202C",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  questionNumberContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
  },
  questionNumber: { color: "white", fontWeight: "bold" },
  questionPreviewText: { color: "white", flex: 1 },
  addQuestionButton: {
    backgroundColor: "#3182CE",
    borderRadius: 8,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addQuestionText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default QuizSettingsScreen;
