// Ubicacion: src/components/navigation/CustomTabBar.tsx

import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

// --- CAMBIO 1: Importamos el tipo de props correcto ---
import { useAuthStore } from "@/store/authstore";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// --- CAMBIO 2: Le decimos al componenete que acepte estas props ---
const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  // --- CAMBIO 3: Usamos `state` en lugar de useNavigation para saber la ruta activa ---
  const currentRouteName = state.routes[state.index].name;

  const { isLoggedIn } = useAuthStore();

  const getIconColor = (routeName: string) => {
    return currentRouteName === routeName ? COLORS.primary : "gray";
  };

  const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    index: "home",
    join: "game-controller",
    create: "add",
  };

  const handleCreatePress = () => {
    // --- PASO 3: Lógica condicional ---
    if (isLoggedIn) {
      // Si el usuario está logeado, lo llevamos al editor
      navigation.navigate("editor");
    } else {
      // Si no, lo forzamos a registrarse
      navigation.navigate("auth");
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      <Pressable
        style={styles.tabButton}
        onPress={() => navigation.navigate("index")}
      >
        <Ionicons
          name={iconMap.index}
          size={28}
          color={getIconColor("index")}
        />
      </Pressable>

      <Pressable
        style={styles.centralTabButton}
        onPress={() => navigation.navigate("join")}
      >
        <Ionicons name={iconMap.join} size={32} color="white" />
      </Pressable>

      <Pressable style={styles.tabButton} onPress={handleCreatePress}>
        <Ionicons
          name={iconMap.create}
          size={28}
          color={getIconColor("create")}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1A202C",
    height: 60,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#2D3748",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centralTabButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    alignSelf: "center",
    top: -35,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 4,
    borderColor: "#1A202C",
  },
});

export default CustomTabBar;
