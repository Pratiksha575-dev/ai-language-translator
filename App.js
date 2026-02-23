import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TranslatorScreen from './TranslatorScreen';
import HistoryScreen from './HistoryScreen';
import SettingsScreen from './SettingsScreen';
import { HistoryProvider } from './HistoryContext'; // your provider

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <HistoryProvider> {/* Wrap all app screens in provider */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Translator" component={TranslatorScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </HistoryProvider>
  );
}