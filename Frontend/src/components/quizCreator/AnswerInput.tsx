// Ubicación: src/components/quizCreator/answerInput.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const ANSWER_MAX_LENGTH = 75;

type AnswerInputProps = {
  placeholder: string;
  color: string;
  value: string;
  isCorrect: boolean;
  onChangeText: (text: string) => void;
  onToggleCorrect: () => void;
};

const AnswerInput = ({
  placeholder,
  color,
  value,
  isCorrect = false,
  onChangeText,
  onToggleCorrect,
}: AnswerInputProps) => {
  return (
    <View style={[styles.answerWrapper, { backgroundColor: color }]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        value={value}
        onChangeText={onChangeText}
        multiline={true}
        maxLength={ANSWER_MAX_LENGTH}
      />
      <View style={styles.footer}>
        <Text style={styles.charCounter}>
          {(value ?? "").length}/{ANSWER_MAX_LENGTH}
        </Text>
        <Pressable onPress={onToggleCorrect}>
          <Ionicons
            name={isCorrect ? "checkmark" : "ellipse-outline"}
            size={28}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  answerWrapper: {
    width: "48.5%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
    justifyContent: "space-between",
  },
  input: {
    color: "white",
    fontWeight: "bold",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  charCounter: { color: "rgba(255, 255, 255, 0.7)", fontSize: 12 },
});
export default AnswerInput;
