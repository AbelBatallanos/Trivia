import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HeaderProps = {
  // Props para el botón izquierdo (opcional)
  leftButtonText?: string;
  onLeftButtonPress?: () => void;

  // Props para el botón derecho (obligatorio)
  rightButtonText: string;
  onRightButtonPress: () => void;
  rightButtonColor?: string;
  isRightButtonDisabled?: boolean;
};

const EditorHeader = ({
  leftButtonText,
  onLeftButtonPress,
  rightButtonText,
  onRightButtonPress,
  rightButtonColor = "white", // Color por defecto
  isRightButtonDisabled = false,
}: HeaderProps) => {
  return (
    <View style={styles.container}>
      {/* El botón izquierdo solo aparece si se le pasa texto */}
      <Pressable onPress={onLeftButtonPress} style={styles.leftButton}>
        <Text style={styles.leftButtonText}>{leftButtonText}</Text>
      </Pressable>

      {/* Botón derecho */}
      <Pressable 
        style={[styles.doneButton, { backgroundColor: rightButtonColor, opacity: isRightButtonDisabled ? 0.5 : 1 }]} 
        onPress={onRightButtonPress}
        disabled={isRightButtonDisabled}
      >
        <Text style={[styles.doneText, rightButtonColor !== 'white' && {color: 'white'}]}>{rightButtonText}</Text>
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
  leftButton: {
    minWidth: 80, // Espacio para el botón izquierdo
  },
  leftButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  doneText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default EditorHeader;