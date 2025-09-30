// Ubicación: app/_layout.tsx

import { Stack } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const RootLayout = () => {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />

        <Stack.Screen name="auth" />
        <Stack.Screen name="lobby" />
        <Stack.Screen name="player" />
        <Stack.Screen name="results" />
        {/* <Stack.Screen name="index" /> */}

        <Stack.Screen
          name="join"
          options={{
            presentation: "transparentModal",
            animation: "fade_from_bottom",
          }}
        />
        <Stack.Screen
          name="editor"
          // options={{
          //   presentation: "modal",
          //   animation: "slide_from_bottom",
          // }}
        />

        <Stack.Screen
          name="host"
          options={{
            presentation: "transparentModal",
            animation: "fade_from_bottom",
          }}
        />

        <Stack.Screen name="settings" options={{ presentation: "modal" }} />
      </Stack>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1A202C", // <-- CLAVE: Aplica el color de fondo oscuro para evitar el blanco
        // Aplica padding solo en Android (aprox. 30px) para el área de la barra de estado
        paddingTop: Platform.OS === 'android' ? 34 : 0, 
    },
});

export default RootLayout;
