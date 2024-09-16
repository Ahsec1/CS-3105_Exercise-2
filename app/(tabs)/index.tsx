import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { Dimensions } from "react-native";
import ProgressBarComponent from '../ProgressBar';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [autoplayCounter, setAutoplayCounter] = useState(0);
  const rotate = useSharedValue(0);
  const isAnimating = useSharedValue(true);
  const [shuffledCards, setShuffledCards] = useState<{ id: number; front: string; back: string }[]>([]);

  const [FlashCards, setFlashCards] = useState([
    { id: 1, front: "Who created this program?", back: "John and Ditto" },
    { id: 2, front: "What courses did the creators of this take?", back: "Computer Science" },
    { id: 3, front: "How long did this take to make?", back: "Around 2-3 Hours" },
    { id: 4, front: "What class is this for?", back: "App Development" },
    { id: 5, front: "What is the name of our country", back: "Philippines" },
  ]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(rotate.value, [0, 1], [0, 180]);
    return {
      transform: [
        {
          rotateX: isAnimating.value
            ? withTiming(`${spinVal}deg`, { duration: 500 })
            : `${spinVal}deg`,
        },
      ],
      position: "absolute",
      backfaceVisibility: "hidden",
    };
    return {
      transform: [
        {
          rotateX: isAnimating.value
            ? withTiming(`${spinVal}deg`, { duration: 500 })
            : `${spinVal}deg`,
        },
      ],
      position: "absolute",
      backfaceVisibility: "hidden",
    };
  }, []);

  const backAnimatedStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(rotate.value, [0, 1], [180, 360]);
    return {
      transform: [
        {
          rotateX: isAnimating.value
            ? withTiming(`${spinVal}deg`, { duration: 500 })
            : `${spinVal}deg`,
        },
      ],
      backfaceVisibility: "hidden",
    };
    return {
      transform: [
        {
          rotateX: isAnimating.value
            ? withTiming(`${spinVal}deg`, { duration: 500 })
            : `${spinVal}deg`,
        },
      ],
      backfaceVisibility: "hidden",
    };
  }, []);


  useEffect(() => {
    setShuffledCards([...FlashCards]);
  }, [FlashCards]);

  const shuffleCards = () => {
    setFlashCards((prevFlashCards) =>
      [...prevFlashCards].sort(() => Math.random() - 0.5)
    );
    setIndex(0);
  };

  const nextCard = () => {
    if (shuffledCards.length > 0) {
      isAnimating.value = false;
      rotate.value = 0;
      setIndex((prevIndex) => (prevIndex + 1) % shuffledCards.length);
    }
  };

  const prevCard = () => {
    if (shuffledCards.length > 0) {
      isAnimating.value = false;
      rotate.value = 0;
      setIndex(
        (prevIndex) => (prevIndex - 1 + shuffledCards.length) % shuffledCards.length
      );
    }
  };

  const flipCard = () => {
    isAnimating.value = true;
    rotate.value = rotate.value ? 0 : 1;
    isAnimating.value = true;
    rotate.value = rotate.value ? 0 : 1;
  };

  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay);
    if (!isAutoplay) {
      setAutoplayCounter(5);
    }
  };

  useEffect(() => {
    let flipTimeout: NodeJS.Timeout | undefined;
    let nextCardTimeout: NodeJS.Timeout | undefined;

    const startAutoplay = () => {
      flipTimeout = setTimeout(() => {
        flipCard();
        setAutoplayCounter(3);

        nextCardTimeout = setTimeout(() => {
          nextCard();
          setAutoplayCounter(5);
          startAutoplay();
        }, 3000);
      }, 5000);
    };

    if (isAutoplay) {
      startAutoplay();
    }

    return () => {
      if (flipTimeout) clearTimeout(flipTimeout);
      if (nextCardTimeout) clearTimeout(nextCardTimeout);
    };
  }, [isAutoplay]);

  useEffect(() => {
    let counterInterval: NodeJS.Timeout | undefined;

    if (isAutoplay && autoplayCounter > 0) {
      counterInterval = setInterval(() => {
        setAutoplayCounter((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (counterInterval) clearInterval(counterInterval);
    };
  }, [autoplayCounter]);

  return (
    <View style={styles.container}>

      <View style={styles.topRow}>
        <Pressable style={styles.shuffleButton} onPress={shuffleCards}>
          <Image
            source={require("../../assets/images/shuffleIcon.png")}
            style={styles.shuffleIcon}
          />
        </Pressable>

        <Text style={styles.cardCounter}>
          {shuffledCards[index]?.id} / {shuffledCards.length}
        </Text>

        <View>
          {isAutoplay && (
            <Text style={styles.counterText}>{autoplayCounter}s</Text>
          )}
        </View>
      </View>
      
      <View style={styles.cardWrapper}>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <Pressable onPress={flipCard}>
            <Text style={styles.content}>{shuffledCards[index]?.front}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.card, backAnimatedStyle]}>
          <Pressable onPress={flipCard}>
            <Text style={styles.content}>{shuffledCards[index]?.back}</Text>
          </Pressable>
        </Animated.View>
      </View>

      <ProgressBarComponent
        totalCards={shuffledCards.length}
        currentCardId={shuffledCards[index]?.id || 1}
        shuffledCards={shuffledCards}
      />

      <View style={styles.navigate}>
        <Pressable
          style={({ pressed }) => [
            styles.navigateButton,
            { backgroundColor: pressed ? "#0056b3" : "#007BFF" },
          ]}
          onPress={prevCard}
        >
          <Text style={styles.navigateButtonText}>Back</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.navigateButton,
            { backgroundColor: pressed ? "#0056b3" : "#007BFF" },
          ]}
          onPress={nextCard}
        >
          <Text style={styles.navigateButtonText}>Next</Text>
        </Pressable>
      </View>

      <Pressable
        style={[
          styles.autoplayButton,
          { backgroundColor: isAutoplay ? "#C22222" : "#28a745" },
        ]}
        onPress={toggleAutoplay}
      >
        <Text style={styles.autoplayButtonText}>
          {isAutoplay ? "STOP" : "START AUTOPLAY"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    position: "relative",
    alignItems: "center",
  },
  cardWrapper: {
    alignItems: "center",
    width: screenWidth * 0.9, 
    height: screenHeight * 0.4, 
  },
  card: {
    width: "100%",
    height: "100%",
    padding: screenWidth * 0.05, 
    borderRadius: 20,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    position: "absolute",
  },
  navigate: {
    width: screenWidth * 0.9, 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navigateButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    width: screenWidth * 0.4, 
    alignItems: "center",
    justifyContent: "center",
  },
  navigateButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  autoplayButton: {
    marginTop: 20,
    width: screenWidth * 0.9, 
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  autoplayButtonText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
  shuffleButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  shuffleIcon: {
    width: 40,
    height: 40,
  },
  
  counterText: {
    color: "#fff",
    fontSize: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 10,
    textAlign: "center",
  },
  content: {
    textAlign: "center",
    padding: screenWidth * 0.05, 
    fontSize: 18,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: screenWidth * 0.9, 
    marginBottom: 20, 
  },
  cardCounter: {
    position: "absolute",
    right: 150,
    fontSize: 18,
    color: "#000",
    textAlign: "center",
  },
});
