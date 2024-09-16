import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [autoplayCounter, setAutoplayCounter] = useState(0);
  const rotate = useSharedValue(0);
  const isAnimating = useSharedValue(true);

  const [FlashCards, setFlashCards] = useState([
    { front: "Who created this program?", back: "John and Ditto" },
    { front: "What courses did the creators of this take?", back: "Computer Science" },
    { front: "How long did this take to make?", back: "Around 2-3 Hours", },
    { front: "What class is this for?", back: "App Development" },
  ]);

  // ANIMATIONS
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
  }, []);

  // NAVIGATION FUNCTIONS
  const nextCard = () => {
    isAnimating.value = false;
    rotate.value = 0;
    setIndex((prevIndex) => (prevIndex + 1) % FlashCards.length);
  };

  const prevCard = () => {
    isAnimating.value = false;
    rotate.value = 0;
    setIndex(
      (prevIndex) => (prevIndex - 1 + FlashCards.length) % FlashCards.length
    );
  };

  const flipCard = () => {
    isAnimating.value = true;
    rotate.value = rotate.value ? 0 : 1;
  };

  const shuffleCards = () => {
    setFlashCards((prevFlashCards) =>
      [...prevFlashCards].sort(() => Math.random() - 0.5)
    );
    setIndex(0);
  };

  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay);
    if (!isAutoplay) {
      setAutoplayCounter(5);
    }
  };

  // AUTOPLAY FUNCTIONS
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

  // AUTOPLAY COUNTER
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
      {/* CARD AND NAVIGATION */}
      <View style={styles.cardContainer}>
        <Pressable style={styles.shuffleButton} onPress={shuffleCards}>
          <Image
            source={require("../../assets/images/shuffleIcon.png")}
            style={styles.shuffleIcon}
          />
        </Pressable>

        <View style={styles.autoplayCounterContainer}>
          {isAutoplay && (
            <Text style={styles.counterText}>{autoplayCounter}s</Text>
          )}
        </View>

        <View style={styles.cardWrapper}>
          <Animated.View style={[styles.card, frontAnimatedStyle]}>
            <Pressable onPress={flipCard}>
              <Text style={styles.content}>{FlashCards[index].front}</Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.card, backAnimatedStyle]}>
            <Pressable onPress={flipCard}>
              <Text style={styles.content}>{FlashCards[index].back}</Text>
            </Pressable>
          </Animated.View>
        </View>

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

          <Text style={styles.content}>{index + 1}</Text>

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
      </View>

      {/* AUTOPLAY BUTTON */}
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
    width: 750,
    height: 300,
  },
  card: {
    width: 750,
    height: 300,
    padding: 40,
    borderRadius: 20,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    position: "absolute",
  },
  navigate: {
    width: 750,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
  },
  navigateButton: {
    backgroundColor: "#007BFF",
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  navigateButtonText: {
    color: "#fff",
    fontSize: 32,
  },
  autoplayButton: {
    marginTop: 40,
    width: 750,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  autoplayButtonText: {
    color: "#fff",
    fontSize: 32,
    textAlign: "center",
  },
  shuffleButton: {
    position: "absolute",
    top: -80,
    left: -20,
    width: 750,
    alignItems: "flex-start",
    paddingLeft: 20,
    zIndex: 1,
  },
  shuffleIcon: {
    width: 60,
    height: 60,
  },
  autoplayCounterContainer: {
    position: "absolute",
    top: -80,
    right: -10,
    width: 750,
    alignItems: "flex-end",
    paddingRight: 20,
  },
  counterText: {
    color: "#fff",
    fontSize: 32,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
  },
  content: {
    textAlign: "center",
    padding: 40,
    fontSize: 32,
  },
});
