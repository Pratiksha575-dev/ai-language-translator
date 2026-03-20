import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./HomeScreen";
import ResearchHome from "./ResearchHome";
import TranslatorScreen from "./TranslatorScreen";
import AnalyticsScreen from "./AnalyticsScreen"; 
import { HistoryProvider } from "./HistoryContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <HistoryProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">

          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ResearchHome" component={ResearchHome} />
          <Stack.Screen name="Translator" component={TranslatorScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </HistoryProvider>
  );
}