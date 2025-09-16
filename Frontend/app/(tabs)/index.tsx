import { Link } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import AdBanner from "@/components/dashboard/AdBanner";
import CallToActionCard from "@/components/dashboard/CallToActionCard";
import HomeHeader from "@/components/dashboard/HomeHeader";
import QuizCard from "@/components/quizCreator/QuizCard";
import { useAuthStore } from "@/store/authstore";

const HomeScreen = () => {
  // Usamos el hook de nuestro store para obtener el estado y las acciones
  const { isLoggedIn, login, logout } = useAuthStore();

  const renderLoggedInView = () => (
    <View>
      <Text style={styles.sectionTitle}>Mis Trivias</Text>
      {/* Aqui iria un .map() de las trivias reales, por ahora son de ejemplo */}
      <QuizCard title="Capitales del Mundo" questionCount={15} />
      <QuizCard title="Cultura General" questionCount={10} />
    </View>
  );

  // --- VISTA PARA EL USUARIO NO REGISTRADO ---
  const renderLoggedOutView = () => (
    <View>
      <Link href="/auth" asChild>
        <CallToActionCard
          title="Create your free account"
          backgroundColor="#339947"
        />
      </Link>
      <Link href="/auth" asChild>
        <CallToActionCard
          title="Create your first kahoot"
          backgroundColor="#e53e3e"
        />
      </Link>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <HomeHeader />

        {isLoggedIn ? renderLoggedInView() : renderLoggedOutView()}

        <AdBanner />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1A202C",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  debugContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  debugButton: {
    backgroundColor: "#4A5568",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  debugText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default HomeScreen;
