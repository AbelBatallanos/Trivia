import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface CustomTextInputProps extends TextInputProps {
  placeholder: string;
}

const CustomTextInput = ({style, ...props}: CustomTextInputProps) => {
  return (
    <TextInput style={[styles.input, style]} placeholderTextColor="#A0AEC0" {...props} />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#2D3748",
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
});

export default CustomTextInput;
