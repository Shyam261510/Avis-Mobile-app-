// MainNavigator.tsx
import React, { useEffect, useTransition } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";

import { setUserInfo } from "../store/dataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

// Screens
import Welcome from "../(tabs)/Welcome";
import Login from "../(tabs)/Login";
import SignUp from "../(tabs)/SignUp";
import HomeScreen from "../(tabs)/Home";
import Chat from "../(tabs)/Chat";
import ProfileScreen from "../(tabs)/ProfileScreen";
import DocumentScreen from "../(tabs)/DocumentScreen";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      const fetchUser = async () => {
        try {
          const token = await AsyncStorage.getItem("authToken");

          const response = await axios.get(
            "http://192.168.1.13:8000/api/getUserInfo",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const { success, user, message } = response.data;
          if (!success) {
            Toast.show({
              type: "error",
              text1: message,
            });
            return;
          }

          dispatch(setUserInfo(user));
        } catch (error: any) {
          console.error("Failed to load auth token:", error.message);
          Toast.show({
            type: "error",
            text1: "Failed to load auth token",
          });
        }
      };

      fetchUser();
    });
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="documentScreen"
          component={DocumentScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
