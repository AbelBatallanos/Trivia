// Ubicación: src/components/dashboard/HomeHeader.tsx

import { useAuthStore } from "@/store/authstore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const HomeHeader = () => {
  const { isLoggedIn, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TriviaApp!</Text>
      <View style={styles.actions}>
        <Pressable style={styles.upgradeButton}>
          <Text style={styles.upgradeText}>Upgrade</Text>
        </Pressable>
        <Ionicons name="notifications-outline" size={24} color="white" />
        {isLoggedIn && (
          <Pressable onPress={logout}>
            <Ionicons name="log-out-outline" size={28} color="white" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  upgradeButton: {
    backgroundColor: "#2D3748",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  upgradeText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HomeHeader;
