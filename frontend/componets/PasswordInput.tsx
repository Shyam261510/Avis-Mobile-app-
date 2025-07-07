import { View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react-native";

export default function PasswordInput(props: any) {
  const [isPasswordShow, setIsPasswordShow] = useState(true);
  return (
    <View>
      <TextInput
        placeholder="Password"
        placeholderTextColor="#6B7280"
        secureTextEntry={isPasswordShow}
        style={styles.input}
        {...props}
      />
      {isPasswordShow ? (
        <EyeClosed
          style={styles.eyeStyle}
          onPress={() => setIsPasswordShow(!isPasswordShow)}
        />
      ) : (
        <Eye
          style={styles.eyeStyle}
          onPress={() => setIsPasswordShow(!isPasswordShow)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    marginBottom: 16,
    position: "relative",
  },
  eyeStyle: {
    position: "absolute",
    top: 10,
    right: 15,
    color: "#FF6600",
  },
});
