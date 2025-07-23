import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const TypingIndicator: React.FC = () => {
  const bounce1 = useRef(new Animated.Value(0)).current;
  const bounce2 = useRef(new Animated.Value(0)).current;
  const bounce3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = (value: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: -4,
            duration: 300,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    bounce(bounce1, 0);
    bounce(bounce2, 150);
    bounce(bounce3, 300);
  }, [bounce1, bounce2, bounce3]);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: bounce1 }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: bounce2 }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: bounce3 }] }]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    maxWidth: 200,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  bubble: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
  },
  dotsContainer: {
    flexDirection: "row",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9ca3af", // Tailwind gray-400
    marginHorizontal: 2,
  },
});

export default TypingIndicator;
