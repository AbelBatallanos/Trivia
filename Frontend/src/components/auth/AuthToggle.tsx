// Ubicación: src/components/auth/AuthToggle.tsx

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const FORM_CONTAINER_WIDTH = width - 48;

type AuthToggleProps = {
  activeMode: 'login' | 'register';
  onToggle: (mode: 'login' | 'register') => void;
};

const AuthToggle = ({ activeMode, onToggle }: AuthToggleProps) => {
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: activeMode === 'login' ? 0 : 1,
      duration: 300, 
      useNativeDriver: false,
    }).start();
  }, [activeMode]);

  const slideStyle = {
    left: slideAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '50%'],
    }),
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slider, slideStyle]} />
      <Pressable style={styles.toggleButton} onPress={() => onToggle('login')}>
        <Text style={[styles.toggleText, activeMode === 'login' && styles.activeText]}>
          Iniciar Sesión
        </Text>
      </Pressable>
      <Pressable style={styles.toggleButton} onPress={() => onToggle('register')}>
        <Text style={[styles.toggleText, activeMode === 'register' && styles.activeText]}>
          Registrarse
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: '#2D3748',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 32,
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: '#3182CE',
    borderRadius: 25,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    color: '#A0AEC0', 
    fontWeight: 'bold',
  },
  activeText: {
    color: 'white', 
  },
});

export default AuthToggle;