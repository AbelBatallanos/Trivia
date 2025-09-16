// Ubicación: src/components/game/Podium.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PodiumProps = {
  score: number;
  nickname: string;
};

const Podium = ({ score, nickname }: PodiumProps) => {
  return (
    <View style={styles.container}>
      <View style={[styles.podiumStep, { height: 150, backgroundColor: '#A0AEC0' }]}>
        <Text style={styles.podiumRank}>2</Text>
        <Text style={styles.podiumName}>{nickname}</Text>
        <Text style={styles.podiumScore}>{score}</Text>
      </View>

      <View style={[styles.podiumStep, { height: 200, backgroundColor: '#D69E2E' }]}>
        <Text style={styles.podiumRank}>1</Text>
        <Text style={styles.podiumName}>{nickname}</Text>
        <Text style={styles.podiumScore}>{score}</Text>
      </View>

      <View style={[styles.podiumStep, { height: 100, backgroundColor: '#B7791F' }]}>
        <Text style={styles.podiumRank}>3</Text>
        <Text style={styles.podiumName}>{nickname}</Text>
        <Text style={styles.podiumScore}>{score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end', 
    justifyContent: 'center',
    height: 250,
    gap: 10,
  },
  podiumStep: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  podiumRank: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  podiumName: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
  },
  podiumScore: {
    fontSize: 16,
    color: 'white',
  },
});

export default Podium;