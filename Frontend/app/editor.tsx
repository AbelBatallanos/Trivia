// Ubicación: app/(tabs)/create.tsx

import EditorHeader from "@/components/quizCreator/EditorHeader";
import QuestionEditor from "@/components/quizCreator/QuestionEditor";
import QuestionNavigator from "@/components/quizCreator/QuestionNavigator";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

type Answer = { id: number; text: string; isCorrect: boolean };
type Question = { id: number; text: string; answers: Answer[] };

const createNewQuestion = (): Question => ({
  id: Date.now(),
  text: "",
  answers: [
    { id: Date.now() + 1, text: "", isCorrect: false },
    { id: Date.now() + 2, text: "", isCorrect: false },
    { id: Date.now() + 3, text: "", isCorrect: false },
    { id: Date.now() + 4, text: "", isCorrect: false },
  ],
});

const EditorScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [questions, setQuestions] = useState<Question[]>([
  ]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  useEffect(() => {
    // Si venimos de settings con preguntas, las cargamos
    if (params.questions && typeof params.questions === "string") {
      setQuestions(JSON.parse(params.questions));
    }else{
      // Si no hay preguntas, añadimos una por defecto
      setQuestions([createNewQuestion()]);
    }

    // Si nos pasaron un indice especifico, vamos a esa pregunta
    if (params.selectedIndex && typeof params.selectedIndex === "string") {
      setSelectedQuestionIndex(parseInt(params.selectedIndex, 10));
    } 
  }, []);

  const handleSelectQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const handleAddQuestion = () => {
    const newQuestion =  createNewQuestion();
    setQuestions([...questions, newQuestion]);
    setSelectedQuestionIndex(questions.length);
  };

  const updateQuestion = (updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[selectedQuestionIndex] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleQuestionTextChange = (newText: string) => {
    const currentQuestion = questions[selectedQuestionIndex];
    updateQuestion({ ...currentQuestion, text: newText });
  };

  const handleAnswerTextChange = (answerIndex: number, newText: string) => {
    const currentQuestion = questions[selectedQuestionIndex];
    const newAnswers = [...currentQuestion.answers];
    newAnswers[answerIndex].text = newText;
    updateQuestion({ ...currentQuestion, answers: newAnswers });
  };

  const handleToggleCorrect = (answerIndex: number) => {
    const currentQuestion = questions[selectedQuestionIndex];
    const newAnswers = currentQuestion.answers.map((answer, index) => ({
      ...answer,
      isCorrect: index === answerIndex,
    }));
    updateQuestion({ ...currentQuestion, answers: newAnswers });
  };

  const handleGoToSettings = () => {
    // for (const q of questions) {
    //   if(!q.text.trim()) {
    //     alert("Por favor, completa el texto de todas las preguntas.");
    //     return;
    //   }
    //   const filledAnswers = q.answers.filter(a => a.text.trim());
    //   if (filledAnswers.length < 2) {
    //     Alert.alert("Error", `La pregunta "${q.text.slice(0.20)}..." debe tener al menos dos respuestas.`);
    //     return;
    //   }
    // }

    // 1. Filtramos las preguntas para quedarnos solo con las que tienen contenido.
    const validQuestions = questions.filter(
      (q) =>
        q.text.trim().length > 0 ||
        q.answers.some((a) => a.text.trim().length > 0)
    );
    // 2. Para cada pregunta válida, filtramos sus respuestas.
  

    // 3. Actualizamos el estado con las preguntas válidas.
    const questionString = JSON.stringify(validQuestions);
    router.push({
      pathname: "/settings",
      params: { questions: questionString },
    });
  };

  const currentQuestion = questions[selectedQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <EditorHeader
        leftButtonText="Quiz ⮟"
        onLeftButtonPress={() =>
          alert("Selector de tipo de quiz - no implementado")
        }
        rightButtonText="Hecho"
        onRightButtonPress={handleGoToSettings}
        rightButtonColor="#48BB78"
        isRightButtonDisabled={questions.length === 0}
      />

      <View style={styles.topContainer}>
        <QuestionEditor
          question={currentQuestion}
          onQuestionChange={handleQuestionTextChange}
          onAnswerChange={handleAnswerTextChange}
          onToggleCorrect={handleToggleCorrect}
        />
      </View>

      <View style={styles.bottomContainer}>
        <QuestionNavigator
          questions={questions}
          selectedQuestionIndex={selectedQuestionIndex}
          onSelectQuestion={handleSelectQuestion}
          onAddQuestion={handleAddQuestion}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A5568",
  },
  topContainer: { flex: 1, justifyContent: "center" },
  bottomContainer: {},
});

export default EditorScreen;
