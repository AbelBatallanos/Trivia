import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import CustomButton from "@/components/common/Button";
import QuizCard from "@/components/quizCreator/QuizCard";

const HostGameModal = () => {
  const router = useRouter();
  const { quizData: quizDataString } = useLocalSearchParams();
  const quizData = JSON.parse(quizDataString as string);

  const handleHostLive = () => {
    router.push({ pathname: "/lobby", params: { quizData: quizDataString, ishost: 'true' } });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.modalContainer}
    >
      <View style={styles.contentSheet}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="#A0AEC0" />
        </Pressable>

        <Text style={styles.title} numberOfLines={2}>{quizData.titulo}</Text>
        
        <View style={styles.optionButton}>
            <Ionicons name="people" size={40} color="white" style={styles.icon}/>
            <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>Iniciar en Vivo</Text>
                <Text style={styles.buttonDescription}>Juega en tiempo real con otros.</Text>
            </View>
        </View>

        <View style={{marginTop: 'auto'}}>
            <CustomButton title="Empezar" onPress={handleHostLive} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contentSheet: {
    height: "50%",
    backgroundColor: "#1A202C",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 40,
  },
  optionButton: {
    backgroundColor: '#38A169', // Un color verde similar a Kahoot
    borderRadius: 8,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
      marginRight: 16,
  },
  buttonTextContainer: {
      flex: 1,
  },
  buttonTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
  },
  buttonDescription: {
      color: 'white',
      fontSize: 14,
      opacity: 0.8,
  }
});

export default HostGameModal;