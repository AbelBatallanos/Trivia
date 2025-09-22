// Ubicación: app/_layout.tsx

import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
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
  );
};

export default RootLayout;
