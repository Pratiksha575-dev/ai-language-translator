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
        <Stack.Navigator initialRouteName="Translator">

          {/* 🟢 Main App */}
          <Stack.Screen 
            name="Translator" 
            component={TranslatorScreen}
             options={{ headerShown: false }}
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