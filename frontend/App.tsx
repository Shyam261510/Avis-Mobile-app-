// App.tsx
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Toast from "react-native-toast-message";
import Navgation from "./componets/Navigation";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Chat: undefined;
  ProfileScreen: undefined;
  documentScreen: undefined;
  ProfileSetup: undefined;
};

export default function App() {
  return (
    <Provider store={store}>
      <Navgation />
      <Toast />
    </Provider>
  );
}
