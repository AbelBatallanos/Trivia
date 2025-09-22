import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";

type ChecklistItemProps = {
  text: string;
  isComplete: boolean;
  isOptional?: boolean;
  onFix?: () => void;
};

// Sub-componente para cada línea del checklist
const ChecklistItem = ({ text, isComplete, isOptional, onFix }: ChecklistItemProps) => (
  <View style={styles.itemContainer}>
    {/* --- Grupo Izquierdo: Icono y Texto --- */}
    <View style={styles.itemTextContainer}>
      <Ionicons
        name={isComplete ? "checkmark-circle" : (isOptional ? 'add-circle-outline' : 'alert-circle')}
        size={24}
        color={isComplete ? "#38A169" : (isOptional ? '#A0AEC0' : '#e53e3e')}
      />
      <Text style={styles.itemText}>{text}</Text>
    </View>
    
    {/* --- Grupo Derecho: Botón "Arreglar" --- */}
    {!isComplete && onFix && (
      <Pressable onPress={onFix} style={styles.fixButton}>
        <Text style={styles.fixButtonText}>Arreglar</Text>
      </Pressable>
    )}
  </View>
);


const ChecklistModal = ({ visible, items, onCancel }: { visible: boolean; items: ChecklistItemProps[]; onCancel: () => void; }) => {
    const requiredItems = items.filter(item => !item.isOptional);
    const completedCount = requiredItems.filter(item => item.isComplete).length;
    const progress = requiredItems.length > 0 ? (completedCount / requiredItems.length) * 100 : 100;
    const progressBarColor = progress < 50 ? '#e53e3e' : progress < 100 ? '#D69E2E' : '#38A169';
  
    return (
      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Checklist de la Trivia</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: progressBarColor }]} />
            </View>
            {items.map((item, index) => (
              <ChecklistItem key={index} {...item} />
            ))}
            <View style={styles.buttonRow}>
              <Pressable style={styles.cancelButton} onPress={onCancel}>
                  <Text style={styles.cancelText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.6)" },
    modalContent: { backgroundColor: "#2D3748", borderRadius: 16, padding: 24, width: "90%", alignItems: "center" },
    title: { color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    progressContainer: { height: 6, width: '100%', backgroundColor: '#4A5568', borderRadius: 3, marginBottom: 24 },
    progressBar: { height: '100%', borderRadius: 3 },
    
    // --- ESTILOS CORREGIDOS Y MEJORADOS ---
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'space-between', // Separa el grupo izquierdo del derecho
      width: "100%",
      marginBottom: 20,
    },
    itemTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1, // Ocupa el espacio sobrante
      marginRight: 8, // Pequeño espacio para que no se pegue al botón
    },
    itemText: {
      color: "white",
      fontSize: 16,
      marginLeft: 12,
      flexShrink: 1, // Permite que el texto se acorte si es muy largo
    },
    fixButton: {
      backgroundColor: "#3182CE",
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 16,
    },
    // ------------------------------------

    fixButtonText: { color: "white", fontWeight: "bold" },
    buttonRow: { flexDirection: 'row', marginTop: 16, width: '100%' },
    cancelButton: { flex: 1, backgroundColor: '#4A5568', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
    cancelText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
  
export default ChecklistModal;