import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./HomeScreen";
import TranslatorScreen from "./TranslatorScreen";
import AnalyticsScreen from "./AnalyticsScreen";
import { HistoryProvider } from "./HistoryContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <HistoryProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">

          {/* 🟢 Entry Screen */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />

          {/* 🟢 Main App */}
          <Stack.Screen 
            name="Translator" 
            component={TranslatorScreen}
            options={{ title: "Multimodal Language Translator" }}
          />

          {/* 🟢 Research / Analysis */}
          <Stack.Screen 
            name="Analytics" 
            component={AnalyticsScreen}
            options={{ title: "Analysis & Insights" }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </HistoryProvider>
  );
}