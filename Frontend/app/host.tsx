import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { act, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import CustomButton from "@/components/common/Button";
import { deleteTrivia } from "@/api/api";

const OptionsMenu = ({onClose, quizData }: {onClose: () => void; quizData: any}) => {
  const router = useRouter();

  const handleEdit = () => {
    onClose(); // Cerrar menú antes de navegar
    router.push({ 
      pathname: "/editor", 
      params: {questions: JSON.stringify(quizData.preguntas)}
    })
  }

  const handleDelete = () => {
    onClose();
    Alert.alert(
      "Eliminar Trivia",
      `¿Estás seguro de que quieres eliminar "${quizData.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: async () => 
         { try {
            await deleteTrivia(quizData.id);
            Alert.alert("Éxito", "Trivia eliminada correctamente.")
            router.replace("/(tabs)")
         }catch (error){
          console.error("Error al eliminar la trivia:", error);
          Alert.alert("Error", "No se pudo eliminar la trivia. Inténtalo de nuevo")
         }}
        },
      ]
    );
  }

  const menuItems = [
    {icon: "pencil-outline" as const, text: "Editar", action: handleEdit},
    { icon: "trash-outline" as const, text: "Eliminar", color:"#E53E3E", action: handleDelete },
  ]

  return (
    <Modal visible transparent animationType="fade">
      <Pressable style={styles.menuOverlay} onPress={onClose}>
        {/* Usamos Pressable para el contenedor del menú y aseguramos que el toque no se propague al overlay,
            permitiendo que los botones internos sean clickeables. */}
        <Pressable 
            style={styles.menuContainer} 
            onPress={(e) => e.stopPropagation()} // <-- CLAVE: Detiene la propagación del evento
        >
          {menuItems.map((item, index) => (
            <Pressable 
              key={index} 
              style={styles.menuItem} 
              onPress={item.action} // <-- Ejecuta la acción (handleEdit/handleDelete)
            >
              <Ionicons name={item.icon} size={22} color={item.color || "#A0AEC0"} />
              <Text style={[styles.menuItemText, { color: item.color || "white" }]}>{item.text}</Text>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );

};

const HostGameModal = () => {
  const router = useRouter();
  const { quizData: quizDataString } = useLocalSearchParams();
  const quizData = JSON.parse(quizDataString as string);

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleStart = () => {
    router.push({
      pathname: "/lobby",
      params: { quizData: quizDataString, isHost: "true" },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.scrim} onPress={() => router.back()} />

      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#A0AEC0" />
          </Pressable>
          <Text style={styles.title} numberOfLines={2}>
            {quizData.titulo}
          </Text>
          <Pressable style={styles.headerButton} onPress={() => setIsMenuVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color="#A0AEC0" />
          </Pressable>
        </View>

        <View style={styles.optionButton}>
          <Ionicons name="people" size={40} color="white" style={styles.icon} />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Iniciar en Vivo</Text>
            <Text style={styles.buttonDescription}>
              Juega en tiempo real con otros.
            </Text>
          </View>
        </View>
        <View 
        style={{ marginTop: "40%" }}
        >
          <CustomButton title="Empezar" onPress={handleStart} />
        </View>
      </View>
      {isMenuVisible && <OptionsMenu onClose={() => setIsMenuVisible(false)} quizData={quizData} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14, 12, 12, 0.6)",
  },
  modalContent: {
    backgroundColor: "#1A202C",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: "100%",
    gap: 20,
    height: "60%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginHorizontal: 40,
    flex: 1,
  },
  optionButton: {
    backgroundColor: "#38A169",
    borderRadius: 8,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDescription: {
    color: "white",
    fontSize: 14,
    opacity: 0.8,
  },

  // Menu styles
   menuOverlay: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: "49%",
    right: 34,
    backgroundColor: '#2D3748',
    borderRadius: 8,
    padding: 8,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
});

export default HostGameModal;
