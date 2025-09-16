// Ubicación: src/components/quizCreator/QuestionEditor.tsx

import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import AnswerInput from "./AnswerInput";

type Answer = { id: number; text: string; isCorrect: boolean };
type Question = { id: number; text: string; answers: Answer[] };

const QUESTION_MAX_LENGTH = 120;

type EditorProps = {
  question: Question | undefined;
  onQuestionChange: (text: string) => void;
  onAnswerChange: (answerIndex: number, text: string) => void;
  onToggleCorrect: (answerIndex: number) => void;
};

const QuestionEditor = ({
  question,
  onQuestionChange,
  onAnswerChange,
  onToggleCorrect,
}: EditorProps) => {
  if (!question) {
    return <View style={styles.container}></View>;
  }

  const answersColors = ["#e53e3e", "#3182CE", "#D69E2E", "#38A169"];

  return (
    <View style={styles.container}>
      <View style={styles.questionWrapper}>
        <TextInput
          style={styles.questionInput}
          placeholder="Toca para agregar una pregunta"
          placeholderTextColor="#A0AEC0"
          value={question.text}
          onChangeText={onQuestionChange}
          multiline={true}
          maxLength={QUESTION_MAX_LENGTH}
        />
        <Text style={styles.charCounter}>
          {question.text.length}/{QUESTION_MAX_LENGTH}
        </Text>
      </View>

      {/* Contenedor para la cuadricula de respuestas */}
      <View style={styles.answersContainer}>
        {question.answers.map((answer, index) => (
          <AnswerInput
            key={answer.id}
            color={answersColors[index]}
            placeholder={`Agregar respuesta ${index + 1}${
              index > 1 ? ` (opcional)` : ""
            }`}
            value={answer.text}
            isCorrect={answer.isCorrect}
            onChangeText={(text) => onAnswerChange(index, text)}
            onToggleCorrect={() => onToggleCorrect(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    paddingVertical: 22,
  },
  placeholderText: { color: "gray", fontSize: 18 },
  questionInput: {
    backgroundColor: "#2D3748",
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 24,
    borderRadius: 8,
    minHeight: 140,
  },
  answersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  questionWrapper: {
    marginBottom: 24,
  },
  charCounter: {
    color: "#A0AEC0",
    fontSize: 12,
  },
});

export default QuestionEditor;
