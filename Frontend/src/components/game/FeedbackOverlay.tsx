import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = { isCorrect: boolean; points: number };

const FeedbackOverlay = ({ isCorrect, points }: Props) => {
  // El contenedor principal ahora tiene los estilos de la "hoja"
  return (
    <View
      style={[
        styles.sheetContainer,
        { backgroundColor: isCorrect ? "#tranparent" : "transparent" },
      ]}
    >
      <Ionicons
        name={isCorrect ? "checkmark-circle" : "close-circle"}
        size={50}
        color="white"
      />
      <View>
        <Text style={styles.feedbackText}>
          {isCorrect ? "¡Correcto!" : "Incorrecto"}
        </Text>
        <Text style={styles.pointsText}>+{points} Puntos</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "45%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
  },
  feedbackText: { color: "white", fontSize: 28, fontWeight: "bold" },
  pointsText: { color: "white", fontSize: 20 },
});

export default FeedbackOverlay;
