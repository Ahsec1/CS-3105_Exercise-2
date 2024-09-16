import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Progress from 'react-native-progress';

interface ProgressBarComponentProps {
  totalCards: number;
  currentCardId: number;
  shuffledCards: { id: number; front: string; back: string }[];
}

const ProgressBarComponent: React.FC<ProgressBarComponentProps> = ({ totalCards, currentCardId, shuffledCards }) => {
  
  const currentIndex = shuffledCards.findIndex(card => card.id === currentCardId);
  const progress = totalCards > 0 && currentIndex >= 0 ? (currentIndex + 1) / totalCards : 0;

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={300}
        height={10}
        color="#4caf50"
        borderRadius={5}
        unfilledColor="#e0e0e0"
        borderWidth={0}
      />
      <Text style={styles.text}>
        {currentIndex >= 0 ? currentIndex + 1 : 0} / {totalCards}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
});

export default ProgressBarComponent;
