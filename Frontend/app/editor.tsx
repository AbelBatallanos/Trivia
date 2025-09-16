// Ubicación: app/(tabs)/create.tsx

import EditorHeader from "@/components/quizCreator/EditorHeader";
import QuestionEditor from "@/components/quizCreator/QuestionEditor";
import QuestionNavigator from "@/components/quizCreator/QuestionNavigator";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

type Answer = { id: number; text: string; isCorrect: boolean };
type Question = { id: number; text: string; answers: Answer[] };

const EditorScreen = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "¿Cuál es el planeta más grande del sistema solar?",
      answers: [
        { id: 1, text: "Júpiter", isCorrect: true },
        { id: 2, text: "Saturno", isCorrect: false },
        { id: 3, text: "Neptuno", isCorrect: false },
        { id: 4, text: "Tierra", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "¿Cuál es la capital de Francia?",
      answers: [
        { id: 1, text: "Madrid", isCorrect: false },
        { id: 2, text: "Londres", isCorrect: false },
        { id: 3, text: "Berlín", isCorrect: false },
        { id: 4, text: "París", isCorrect: true },
      ],
    },
  ]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const handleSelectQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: "Nueva Pregunta",
      answers: [
        { id: Date.now() + 1, text: "", isCorrect: false },
        { id: Date.now() + 2, text: "", isCorrect: false },
        { id: Date.now() + 3, text: "", isCorrect: false },
        { id: Date.now() + 4, text: "", isCorrect: false },
      ],
    };
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

  const handleDone = () => {
    const questionString = JSON.stringify(questions);

    router.push({
      pathname: "/settings",
      params: { questions: questionString },
    });
  };

  const currentQuestion = questions[selectedQuestionIndex];
  return (
    <SafeAreaView style={styles.container}>
      <EditorHeader onDone={handleDone} />

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
