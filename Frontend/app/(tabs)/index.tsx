// frontend/app/(tabs)/index.tsx

import { Link, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getMyTrivias } from "@/api/api";
import AdBanner from "@/components/dashboard/AdBanner";
import CallToActionCard from "@/components/dashboard/CallToActionCard";
import HomeHeader from "@/components/dashboard/HomeHeader";
import QuizCard from "@/components/quizCreator/QuizCard";
import { useAuthStore } from "@/store/authstore";

const HomeScreen = () => {
  // Usamos el hook de nuestro store para obtener el estado y las acciones
  const { isLoggedIn, login, logout } = useAuthStore();
  const router = useRouter();
  const [myTrivias, setMyTrivias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        const fetchTrivias = async () => {
          try {
            setIsLoading(true);
            const response = await getMyTrivias();
            // El backend puede devolver un mensaje en lugar de una lista si no hay trivias
            if (Array.isArray(response.data)) {
              setMyTrivias(response.data);
            } else {
              setMyTrivias([]);
            }
          } catch (error) {
            console.error("Error al cargar las trivias:", error);
            setMyTrivias([]); // Limpiamos por si hay error
          } finally {
            setIsLoading(false);
          }
        };
        fetchTrivias();
      } else {
        // Si el usuario no está logueado, limpiamos la lista y el loading.
        setMyTrivias([]);
        setIsLoading(false);
      }
    }, [isLoggedIn])
  );
  
  // --- VISTA PARA EL USUARIO REGISTRADO ---
  const renderLoggedInView = () => (
    <View>
      <Text style={styles.sectionTitle}>Mis Trivias</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="white" />
      ) : myTrivias.length > 0 ? (
        myTrivias.map((trivia) => (
          <QuizCard
            key={trivia.id}
            quizId={trivia.id} // <-- PASAMOS LA NUEVA PROP AQUÍ
            title={trivia.titulo}
            questionCount={trivia.preguntas.length}
            onPress={() => router.push({ 
              pathname: '/host', 
              params: { 
                quizData: JSON.stringify(trivia), 
                isHost: 'true' 
              }
            })}
          />
        ))
      ) : (
        <Text style={styles.noTriviasText}>Aún no has creado ninguna trivia.</Text>
      )}
    </View>
  );

  const renderLoggedOutView = () => (
    <View>
      <Link href="/auth" asChild>
        <CallToActionCard title="Crea tu cuenta gratis" backgroundColor="#339947" />
      </Link>
      <Link href="/auth" asChild>
        <CallToActionCard title="Crea tu primer Trivia" backgroundColor="#e53e3e" />
      </Link>
    </View>
  );

  // Altura estimada del Header para el padding superior.
  const HEADER_HEIGHT_PADDING = 68; 

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader /> {/* <-- HEADER FIJO */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT_PADDING }} 
      >
        <View style={styles.contentContainer}> {/* <-- CONTENEDOR CON EL PADDING HORIZONTAL */}
          {isLoggedIn ? renderLoggedInView() : renderLoggedOutView()}
          <AdBanner />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1A202C",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: { 
    paddingHorizontal: 16, 
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  noTriviasText: {
    color: "gray",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default HomeScreen;