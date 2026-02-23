// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import LoginScreen from './LoginScreen';
// import RegisterScreen from './RegisterScreen';
// import TranslatorScreen from './TranslatorScreen';
// import HistoryScreen from './HistoryScreen';
// import SettingsScreen from './SettingsScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {/* Auth screens */}
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Register" component={RegisterScreen} />

//         {/* Main app screens */}
//         <Stack.Screen name="Translator" component={TranslatorScreen} />
//         <Stack.Screen name="History" component={HistoryScreen} />
//         <Stack.Screen name="Settings" component={SettingsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
//hgjgjhg
// import React, { useState } from 'react';
// import { View, Text, Button, Switch, StyleSheet, Alert } from 'react-native';

// export default function SettingsScreen() {
//   const [isDarkTheme, setIsDarkTheme] = useState(false);

//   const toggleTheme = () => setIsDarkTheme(prev => !prev);

//   const handleRateApp = () => {
//     // Replace with actual store URL if publishing
//     Alert.alert('Rate App', 'Thank you for rating the app!');
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: isDarkTheme ? '#222' : '#fff' }]}>
//       <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>Settings</Text>

//       {/* Theme Toggle */}
//       <View style={styles.row}>
//         <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Dark Theme</Text>
//         <Switch value={isDarkTheme} onValueChange={toggleTheme} />
//       </View>

//       {/* Rate App */}
//       <View style={styles.row}>
//         <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Rate App</Text>
//         <Button title="Rate" onPress={handleRateApp} />
//       </View>

//       {/* Version Info */}
//       <View style={styles.row}>
//         <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>App Version</Text>
//         <Text style={{ color: isDarkTheme ? '#fff' : '#000' }}>1.0.0</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 30,
//     alignSelf: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 15,
//   },
//   label: {
//     fontSize: 18,
//   },
// });

import React, { useState } from 'react';
import { View, Text, Button, Switch, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [isDarkTheme, setIsDarkTheme] = useState(true); // dark theme by default

  const toggleTheme = () => setIsDarkTheme(prev => !prev);

  const handleRateApp = () => {
    // Replace with actual store URL if publishing
    Alert.alert('Rate App', 'Thank you for rating the app!');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#222' : '#fff' }]}>
      
      {/* Custom Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={[styles.backText, { color: isDarkTheme ? '#fff' : '#007AFF' }]}>← </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>Settings</Text>

      {/* Theme Toggle */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Theme</Text>
        <Switch value={isDarkTheme} onValueChange={toggleTheme} />
      </View>

      {/* Rate App */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Rate App</Text>
        <Button title="Rate" onPress={handleRateApp} />
      </View>

      {/* Version Info */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>App Version</Text>
        <Text style={{ color: isDarkTheme ? '#fff' : '#000' }}>1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
   
  },
  backButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  backText: {
    fontSize: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  label: {
    fontSize: 18,
  },
});