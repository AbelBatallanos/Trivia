import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdBanner = () => {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerTitle}>¡Potencia tu Aprendizaje!</Text>
      <Text style={styles.bannerText}>Descubre cómo crear trivias divertidas y efectivas en minutos.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#2D3748',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
});

export default AdBanner;