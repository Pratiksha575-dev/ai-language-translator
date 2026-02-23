// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
//   TouchableWithoutFeedback
// } from 'react-native';

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const loginHandler = () => {
//     // For now, just navigate to Translator screen
//     navigation.replace('Translator');
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <SafeAreaView style={styles.container}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.inner}
//         >
//           <Text style={styles.title}>Login</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             placeholderTextColor="#888"
//             value={email}
//             onChangeText={setEmail}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             placeholderTextColor="#888"
//             secureTextEntry
//             value={password}
//             onChangeText={setPassword}
//           />

//           <TouchableOpacity style={styles.button} onPress={loginHandler}>
//             <Text style={styles.buttonText}>Login</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => navigation.navigate('Register')}
//           >
//             <Text style={styles.linkText}>
//               Don't have an account? Register
//             </Text>
//           </TouchableOpacity>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#121212' },
//   inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   title: { fontSize: 28, color: 'white', marginBottom: 40, fontWeight: 'bold' },
//   input: {
//     width: '100%',
//     height: 50,
//     borderColor: '#333',
//     borderWidth: 1,
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//     color: 'white',
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#007AFF',
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
//   linkText: { color: '#4da6ff', marginTop: 10 }
// });

// LoginScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigation.replace('Translator');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons 
            name={showPassword ? 'eye-off' : 'eye'} 
            size={22} 
            color="gray" 
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Bottom Text */}
      <View style={styles.bottomText}>
        <Text style={{ color: 'white' }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: '#4da6ff' }}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212', 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 20
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: 'white', 
    marginBottom: 40 
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1f1f1f',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: 'white',
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1f1f1f',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    color: 'white',
    paddingVertical: 0, // fixes vertical alignment
  },
  loginBtn: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  bottomText: {
    flexDirection: 'row',
    marginTop: 20
  }
});