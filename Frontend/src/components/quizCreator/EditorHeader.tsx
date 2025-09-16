import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HeaderProps = {
  onDone: () => void;
};

const EditorHeader = ({ onDone }: HeaderProps) => {
  return (
    <View style={styles.container}>
      {/* Placeholder para el selector de tipo de Quiz */}
      <View>
        <Text style={styles.quizType}>Quiz ▼ </Text>
      </View>
      {/* Boton para finalizar y cerrar el editor */}
      <Pressable style={styles.doneButton} onPress={onDone}>
        <Text style={styles.doneText}>Guardar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2D3748",
  },
  quizType: { color: "white", fontSize: 16, fontWeight: "bold" },
  doneButton: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  doneText: { color: "black", fontWeight: "bold" },
});

export default EditorHeader;
