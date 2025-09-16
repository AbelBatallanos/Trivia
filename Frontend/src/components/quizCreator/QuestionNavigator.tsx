// Ubicación: src/components/quizCreator/QuestionNavigator.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// tipos de datos que recibirá el componente
type Question = { id: number; text: string };
type NavigatorProps = {
  questions: Question[];
  selectedQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onAddQuestion: () => void;
};

const QuestionNavigator = ({
  questions,
  selectedQuestionIndex,
  onSelectQuestion,
  onAddQuestion,
}: NavigatorProps) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {questions.map((question, index) => (
          <Pressable
            key={question.id}
            style={[
              styles.questionCard,
              selectedQuestionIndex === index && styles.selectedCard,
            ]}
            onPress={() => onSelectQuestion(index)}
          >
            <Text style={styles.questionIndex}>{index + 1}</Text>
            <Text numberOfLines={2} style={styles.questionText}>
              {question.text}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable style={styles.addButton} onPress={onAddQuestion}>
        <Ionicons name="add" size={32} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A202C",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2D3748",
  },
  questionCard: {
    width: 120,
    height: 80,
    backgroundColor: "#2D3748",
    borderRadius: 8,
    marginRight: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: { borderColor: "#3182CE" },
  questionIndex: { color: "white", fontWeight: "bold" },
  questionText: { color: "#A0AEC0", fontSize: 12, marginTop: 4 },
  addButton: {
    width: 60,
    height: 80,
    backgroundColor: "#4A5568",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QuestionNavigator;
