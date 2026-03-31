import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./HomeScreen";
import TranslatorScreen from "./TranslatorScreen";
import AnalyticsScreen from "./AnalyticsScreen";
import SettingsScreen from "./SettingsScreen";
import { HistoryProvider } from "./HistoryContext";
import ProfilePage from "./ProfilePage";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <HistoryProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login"
        screenOptions={{
    headerStyle: {
      backgroundColor: "#1f1f1f", // dark header
    },
    headerTintColor: "#fff", // back arrow + text color
    headerTitleStyle: {
      fontWeight: "bold",
    },
  }}>

          {/* 🔐 AUTH SCREENS */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ title: "Create Account" }}
          />

          {/* 🟢 MAIN APP */}
          <Stack.Screen 
            name="Translator" 
            component={TranslatorScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen 
            name="Profile" 
            component={ProfilePage}
            options={{ title: "My Profile" }}
          />

          <Stack.Screen 
            name="Analytics" 
            component={AnalyticsScreen}
            options={{ title: "Analysis & Insights" }}
          />

          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: "Settings" }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </HistoryProvider>
  );
}