// Ubicación: app/auth.tsx

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import api from "@/api/api";
import AuthToggle from "@/components/auth/AuthToggle";
import CustomButton from "@/components/common/Button";
import CustomTextInput from "@/components/common/TextInput";
import { useAuthStore } from "@/store/authstore";
import { Ionicons } from "@expo/vector-icons";

const AuthScreen = () => {
  const router = useRouter();
  const { login } = useAuthStore();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [name, setName] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");

  const handleAuth = async () => {
    if (authMode === "login") {
      if (!username || !password) {
        alert("Error, Por favor, Introduce tu usuario y contraseña");
        return;
      }
      try {
        const response = await api.post("/account/login/usuario", {
          username,
          password,
        });
        const { token } = response.data;
        // obtiene los datos del usuario después del login si la API no los devuelve
        login({ id: username, name: username }, token);
        router.replace("/(tabs)");
      } catch (error: any) {
        console.error("Error de login:", error.response?.data);
        alert("Error al iniciar sesión. Las credenciales son incorrectas.");
      }
    } else {
      // Logica de Registro
      if (!name || !apellidos || !username || !email || !password) {
        alert("Error, Por favor, completa todos los campos.");
        return;
      }
      try {
        const response = await api.post("/account/register/usuario", {
          nombre: name,
          apellidos,
          username,
          correo: email,
          password,
        });
        const { token, usuario } = response.data;
        login({ id: usuario, name: usuario }, token);
        router.replace("/(tabs)");
      } catch (error: any) {
        console.error("Error de autenticación:", error.response?.data);
        alert(
          "Error de registro, no se pudo crear la cuenta. Inténtalo de nuevo."
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <AuthToggle activeMode={authMode} onToggle={setAuthMode} />

        <Text style={styles.title}>
          {authMode === "login" ? "Bienvenido de Nuevo" : "Crea tu Cuenta"}
        </Text>

        {authMode === "register" && (
          <>
            <CustomTextInput
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
            />
            <CustomTextInput
              placeholder="Apellidos"
              value={apellidos}
              onChangeText={setApellidos}
            />
            <CustomTextInput
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </>
        )}

        <CustomTextInput
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.passwordContainer}>
          <CustomTextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{
              position: "absolute",
              right: 10,
              top: "35%",
            }}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="#A0AEC0"
              style={styles.eyeIcon}
            />
          </Pressable>
        </View>

        {/* <CustomTextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        /> */}

        <CustomButton
          title={authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          onPress={handleAuth}
        />
      </KeyboardAvoidingView>
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
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 9,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
});

export default AuthScreen;
