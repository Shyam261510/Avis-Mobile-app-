// MainNavigator.tsx
import React, { useEffect, useTransition } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setProfileInfo, setUserInfo } from "../store/dataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { View } from "react-native";
// Screens
import Welcome from "../(tabs)/Welcome";
import Login from "../(tabs)/Login";
import SignUp from "../(tabs)/SignUp";
import HomeScreen from "../(tabs)/Home";
import Chat from "../(tabs)/Chat";
import ProfileScreen from "../(tabs)/ProfileScreen";
import DocumentScreen from "../(tabs)/DocumentScreen";
import ProfileSetup from "../(tabs)/ProfleSetup";
import BotLoader from "./BotLoader";
const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const isFetch = useSelector((state: RootState) => state.dataSlice.isFetch);
  const user = useSelector((state: RootState) => state.dataSlice.userInfo);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          console.warn("No auth token found");
          return;
        }

        const API_URL = process.env.API_URL;

        startTransition(async () => {
          try {
            // Fetch User Info
            const userRes = await axios.get(`${API_URL}/api/getUserInfo`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            const {
              success: userSuccess,
              user,
              message: userMessage,
            } = userRes.data;

            if (!userSuccess) {
              Toast.show({
                type: "error",
                text1: userMessage || "Failed to fetch user info",
              });
              return;
            }

            // Fetch Profile Info
            const profileRes = await axios.get(
              `${API_URL}/api/get-profile-info?userId=${user.id}`
            );

            const {
              success: profileSuccess,
              profileInfo,
              message: profileMessage,
            } = profileRes.data;

            if (!profileSuccess) {
              Toast.show({
                type: "error",
                text1: profileMessage || "Failed to fetch profile info",
              });
              return;
            }

            // Dispatch to store
            dispatch(setUserInfo(user));
            dispatch(setProfileInfo(profileInfo));
          } catch (innerError: any) {
            console.error(
              "Error during user/profile fetch:",
              innerError.message
            );
            Toast.show({
              type: "error",
              text1: "Failed to load user or profile info",
              text2:
                innerError?.response?.data?.message || "Something went wrong",
            });
          }
        });
      } catch (error: any) {
        console.error("Failed to retrieve auth token:", error.message);
        Toast.show({
          type: "error",
          text1: "Authentication Error",
          text2: "Unable to retrieve login session",
        });
      }
    };

    fetchUser();
  }, [dispatch, isFetch]);

  if (isPending) {
    return (
      <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 16 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <BotLoader variant="dots" message="Loading" />
        </View>
      </View>
    );
  }
  const initialRouteName = !user ? "Welcome" : "Home";
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
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
        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetup}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
