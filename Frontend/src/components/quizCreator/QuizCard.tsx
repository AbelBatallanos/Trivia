// Ubicación: src/components/quizCreator/QuizCard.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type QuizCardProps = {
  title: string;
  questionCount: number;
  isPrivate?: boolean;
};

const QuizCard = ({
  title,
  questionCount,
  isPrivate = true,
}: QuizCardProps) => {
  return (
    <Pressable style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>{questionCount} Qs</Text>
          {isPrivate && (
            <Ionicons name="lock-closed" size={12} color="#A0AEC0" />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2D3748",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  imagePlaceholder: {
    backgroundColor: "#4A5568",
    height: 100,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  detailText: {
    color: "#A0AEC0",
    fontSize: 12,
  },
});

export default QuizCard;
