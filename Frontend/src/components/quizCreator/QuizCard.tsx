// frontend/src/components/quizCreator/QuizCard.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type QuizCardProps = {
  title: string;
  questionCount: number;
  isPrivate?: boolean;
  onPress?: () => void;
  // Nueva prop para generar un color único
  quizId: number; 
};

// Paleta de colores para la imagen/fondo
const COLOR_PALETTE = ['#E53E3E', '#3182CE', '#38A169', '#A0AEC0','#D69E2E'];


const QuizCard = ({
  title,
  questionCount,
  isPrivate = true,
  onPress,
  quizId,
}: QuizCardProps) => {
    // Calcula un índice de color basado en el ID de la trivia
    const colorIndex = quizId % COLOR_PALETTE.length;
    const cardColor = COLOR_PALETTE[colorIndex];

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Aplicamos el color dinámico */}
      <View style={[styles.imagePlaceholder, { backgroundColor: cardColor }]} /> 
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.details}>
          <Ionicons name="documents-outline" size={14} color="#A0AEC0" /> 
          <Text style={styles.detailText}>{questionCount} Preguntas</Text>
          {isPrivate && (
            <>
              <Text style={styles.detailSeparator}>|</Text>
              <Ionicons name="lock-closed" size={12} color="#A0AEC0" />
            </>
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
    // El fondo gris es ahora dinámico
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    color: "white",
    fontSize: 18, 
    fontWeight: "bold",
    marginBottom: 8,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, 
  },
  detailText: {
    color: "#A0AEC0",
    fontSize: 14,
  },
  detailSeparator: {
    color: "#A0AEC0",
    fontSize: 14,
    marginHorizontal: 4,
  }
});

export default QuizCard;