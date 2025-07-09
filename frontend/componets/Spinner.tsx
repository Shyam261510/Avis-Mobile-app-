import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const Spinner = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000, // 1 second
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    spinAnimation.start();

    return () => spinAnimation.stop(); // Clean up
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return <Animated.View style={[styles.loader, { transform: [{ rotate }] }]} />;
};

const styles = StyleSheet.create({
  loader: {
    width: 25,
    height: 25,
    borderWidth: 4,
    borderColor: "#ffff",
    borderLeftColor: "transparent",
    borderRadius: 9999, // full circle
  },
});

export default Spinner;
