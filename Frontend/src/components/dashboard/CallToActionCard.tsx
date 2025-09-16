// Ubicación: src/components/dashboard/CallToActionCard.tsx

import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

type CardProps = {
  title: string;
  backgroundColor: string;
  onPress?: () => void;
};

const CallToActionCard = ({ title, backgroundColor, onPress }: CardProps) => {
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CallToActionCard;