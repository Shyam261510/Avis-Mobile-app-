import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../App";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type WelcomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function Welcome() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);

  const getStartedHandler = () => {
    if (!userInfo || Object.entries(userInfo).length === 0) {
      navigation.push("Login");
      return;
    }

    navigation.push("Home");
  };
  return (
    <View style={styles.fullScreen}>
      <View style={styles.container}>
        <View style={styles.textSection}>
          <Text style={styles.header}>AVIS</Text>
          <Text style={styles.subText}>
            Streamline Your Visa Consultation Process
          </Text>
          <Text style={styles.description}>
            Manage applicants, track applications, and provide seamless
            consultation with our integrated Stuvis bot.
          </Text>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={getStartedHandler}>
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#FFF7ED",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
  textSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 100,
    fontWeight: "bold",
    color: "#FF6600",
    marginBottom: 20,
    textAlign: "center",
  },
  subText: {
    fontSize: 20,
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  ctaButton: {
    backgroundColor: "#FF6600",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 40,
  },
  ctaText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
