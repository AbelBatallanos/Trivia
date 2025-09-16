import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

type Shape = "triangle" | "diamond" | "circle" | "square";

type PlayerButtonProps = {
  color: string;
  shape: Shape;
  onPress: () => void;
};

const shapeToIcon: Record<Shape, keyof typeof Ionicons.glyphMap> = {
  triangle: "triangle",
  diamond: "diamond",
  circle: "ellipse",
  square: "square",
};

const PlayerButton = ({ color, shape, onPress }: PlayerButtonProps) => {
  return (
    <Pressable
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Ionicons name={shapeToIcon[shape]} size={80} color="white" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "50%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#1A202C",
  },
});

export default PlayerButton;
