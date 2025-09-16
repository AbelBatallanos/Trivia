// Ubicación: app/auth.tsx

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import AuthToggle from "@/components/auth/AuthToggle";
import CustomButton from "@/components/common/Button";
import CustomTextInput from "@/components/common/TextInput";
import { useAuthStore } from "@/store/authstore";

const AuthScreen = () => {
  const router = useRouter();
  const { login } = useAuthStore();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = () => {
    if (authMode === "login") {
      console.log("Intentando iniciar sesión con:", email, password);
      const fakeUserData = { id: "123", name: "Usuario de Prueba" };
      login(fakeUserData);
      router.replace("/(tabs)");
    } else {
      // Lógica de Registro
      console.log("Intentando registrar con:", name, email, password);
      // Aquí llamarías a tu API de registro.
      const fakeUserData = { id: "124", name: name };
      login(fakeUserData);
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <AuthToggle activeMode={authMode} onToggle={setAuthMode} />

        <Text style={styles.title}>
          {authMode === "login" ? "Bienvenido de Nuevo" : "Crea tu Cuenta"}
        </Text>

        {authMode === "register" && (
          <CustomTextInput
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />
        )}

        <CustomTextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomTextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton
          title={authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          onPress={handleAuth}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A202C",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 32,
  },
});

export default AuthScreen;
