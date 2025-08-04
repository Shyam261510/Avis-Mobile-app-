import React, { useEffect, useState } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Bot } from "lucide-react-native";

interface BotLoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "dots" | "pulse" | "typing";
  message?: string;
}

export default function BotLoader({
  size = "md",
  variant = "dots",
  message = "Bot is thinking...",
}: BotLoaderProps) {
  const [dotCount, setDotCount] = useState(1);
  const [bounces] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  useEffect(() => {
    if (variant === "dots") {
      const interval = setInterval(() => {
        setDotCount((prev) => (prev % 3) + 1);
      }, 500);
      return () => clearInterval(interval);
    }

    if (variant === "typing") {
      bounces.forEach((bounce, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 200),
            Animated.timing(bounce, {
              toValue: -5,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(bounce, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }
  }, [variant]);

  const iconSize = size === "sm" ? 24 : size === "lg" ? 40 : 32;
  const dotSize = size === "sm" ? 6 : size === "lg" ? 10 : 8;

  if (variant === "pulse") {
    return (
      <View style={styles.row}>
        <Bot size={iconSize} color="#ff6600" />
        <Text style={styles.pulseText}>{message}</Text>
      </View>
    );
  }

  if (variant === "typing") {
    return (
      <View style={styles.row}>
        <Bot size={iconSize} color="#ff6600" />
        <View style={styles.bubble}>
          <View style={styles.row}>
            {bounces.map((bounce, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotSize,
                    height: dotSize,
                    transform: [{ translateY: bounce }],
                    backgroundColor: "#ff6600",
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }

  // dots variant
  return (
    <View style={styles.row}>
      <Bot size={iconSize} color="#6366f1" />
      <Text style={styles.messageText}>
        {message}
        {".".repeat(dotCount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bubble: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dot: {
    borderRadius: 50,
    marginHorizontal: 2,
  },
  pulseText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  messageText: {
    color: "#6b7280",
    fontSize: 14,
  },
});
