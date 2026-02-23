// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from 'react-native';
// import { MaterialIcons, Ionicons } from '@expo/vector-icons';
// import DropDownPicker from 'react-native-dropdown-picker';

// export default function TranslatorScreen({ navigation }) {
//   const [text, setText] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [sourceLang, setSourceLang] = useState('en');
//   const [targetLang, setTargetLang] = useState('es');

//   const [openSource, setOpenSource] = useState(false);
//   const [openTarget, setOpenTarget] = useState(false);

//   const languages = [
//     { label: 'English', value: 'en' },
//     { label: 'Spanish', value: 'es' },
//     { label: 'French', value: 'fr' },
//     { label: 'German', value: 'de' },
//     { label: 'Hindi', value: 'hi' },
//     { label: 'Chinese', value: 'zh' },
//   ];

//   const sendMessage = () => {
//     if (!text) return;
//     setMessages([...messages, { type: 'user', text }]);
//     setText('');
//     // Dummy translated message
//     setMessages(prev => [...prev, { type: 'user', text }, { type: 'translated', text: 'Translated text will appear here.' }]);
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//       <SafeAreaView style={styles.container}>
//         {/* Top Bar */}
//         <View style={styles.topBar}>
//           <TouchableOpacity onPress={() => alert('Menu clicked')}>
//             <MaterialIcons name="menu" size={28} color="white" />
//           </TouchableOpacity>
//           <Text style={styles.title}>Translator</Text>
//           <View style={{ flexDirection: 'row' }}>
//             <TouchableOpacity onPress={()  => navigation.navigate('History')} style={{ marginRight: 10 }}>
//               <Ionicons name="time-outline" size={28} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => alert('Settings clicked')} style={{ marginRight: 10 }}>
//               <Ionicons name="settings-outline" size={28} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => alert('Profile clicked')}>
//               <Ionicons name="person-circle-outline" size={28} color="white" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Language Pickers with Swap Button */}
//         <View style={[styles.dropdownContainer, { alignItems: 'center' }]}>
//           <DropDownPicker
//             open={openSource}
//             value={sourceLang}
//             items={languages}
//             setOpen={setOpenSource}
//             setValue={setSourceLang}
//             placeholder="From"
//             containerStyle={{ flex: 1, marginRight: 5 }}
//             style={styles.dropdown}
//             dropDownContainerStyle={styles.dropdownContainerStyle}
//             zIndex={5000}
//             labelStyle={{ color: 'white' }}
//             selectedItemLabelStyle={{ color: 'white', fontWeight: 'bold' }}
//             listItemLabelStyle={{ color: 'white' }} 
//             arrowIconStyle={{ tintColor: 'white' }}          // arrow color
//             tickIconStyle={{ tintColor: 'white' }}   
//           />

//           {/* Swap Button */}
//           <TouchableOpacity
//             onPress={() => {
//               const temp = sourceLang;
//               setSourceLang(targetLang);
//               setTargetLang(temp);
//             }}
//             style={styles.swapBtn}
//           >
//             <MaterialIcons name="swap-horiz" size={28} color="white" />
//           </TouchableOpacity>

//           <DropDownPicker
//             open={openTarget}
//             value={targetLang}
//             items={languages}
//             setOpen={setOpenTarget}
//             setValue={setTargetLang}
//             placeholder="To"
//             containerStyle={{ flex: 1, marginLeft: 5 }}
//             style={styles.dropdown}
//             dropDownContainerStyle={styles.dropdownContainerStyle}
//             zIndex={4000}
//             labelStyle={{ color: 'white' }}
//             selectedItemLabelStyle={{ color: 'white', fontWeight: 'bold' }}
//             listItemLabelStyle={{ color: 'white' }} 
//             arrowIconStyle={{ tintColor: 'white' }}          // arrow color
//             tickIconStyle={{ tintColor: 'white' }}   
//           />
//         </View>

//         {/* Chat Area */}
//         <ScrollView
//           style={styles.chatArea}
//           contentContainerStyle={{ padding: 10, flexGrow: 1 }}
//         >
//           {messages.map((msg, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.messageBubble,
//                 msg.type === 'user' ? styles.userBubble : styles.translatedBubble
//               ]}
//             >
//               <Text style={{ color: msg.type === 'user' ? 'white' : 'black' }}>{msg.text}</Text>
//             </View>
//           ))}
//         </ScrollView>

//         {/* Bottom Input Area */}
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={styles.inputWrapper}
//         >
//           <View style={styles.inputArea}>
//             <TouchableOpacity onPress={() => alert('Mic clicked')} style={styles.micBtn}>
//               <Ionicons name="mic-outline" size={24} color="white" />
//             </TouchableOpacity>
//             <TextInput
//               style={styles.input}
//               placeholder="Type a message"
//               placeholderTextColor="#888"
//               value={text}
//               onChangeText={setText}
//             />
//             <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
//               <MaterialIcons name="send" size={24} color="white" />
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#121212' },

//   topBar: {
//     height: 80,
//     backgroundColor: '#1f1f1f',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 25,
//     paddingTop: 20,
//   },
//   title: { fontSize: 18, fontWeight: 'bold', color: 'white' },

//   dropdownContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//     marginTop: 10,
//     zIndex: 1000,
//   },
//   dropdown: { backgroundColor: '#1f1f1f', borderColor: '#333' },
//   dropdownContainerStyle: { backgroundColor: '#1f1f1f' },

//   swapBtn: {
//     padding: 5,
//     marginHorizontal: 5,
//     backgroundColor: '#333',
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   chatArea: { flex: 1 },

//   messageBubble: {
//     maxWidth: '80%',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   userBubble: {
//     backgroundColor: '#007AFF',
//     alignSelf: 'flex-end',
//   },
//   translatedBubble: {
//     backgroundColor: '#e0e0e0',
//     alignSelf: 'flex-start',
//   },

//   inputWrapper: {
//     paddingBottom: 20,
//   },
//   inputArea: {
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//     backgroundColor: '#1f1f1f',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   micBtn: {
//     backgroundColor: '#007AFF',
//     borderRadius: 25,
//     padding: 10,
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#333',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     height: 45,
//     marginRight: 10,
//     color: 'white',
//   },
//   sendBtn: {
//     backgroundColor: '#007AFF',
//     borderRadius: 25,
//     padding: 10,
//   },
// });

// TranslatorScreen.js
import 'react-native-gesture-handler';
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { HistoryContext } from './HistoryContext'; // import context

export default function TranslatorScreen({ navigation }) {
  const { addHistory } = useContext(HistoryContext); // get function from context

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');

  const [openSource, setOpenSource] = useState(false);
  const [openTarget, setOpenTarget] = useState(false);

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Chinese', value: 'zh' },
  ];

  const sendMessage = () => {
    if (!text) return;

    const translatedText = 'Translated text will appear here.'; // replace with actual translation

    // Update chat messages
    setMessages(prev => [
      ...prev,
      { type: 'user', text },
      { type: 'translated', text: translatedText }
    ]);

    // Add to global history
    addHistory({
      source: text,
      translated: translatedText,
      sourceLang,
      targetLang,
      time: new Date().toLocaleString(),
    });

    setText(''); // clear input
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => alert('Menu clicked')}>
            <MaterialIcons name="menu" size={28} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>Translator</Text>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('History')} 
              style={{ marginRight: 10 }}
            >
              <Ionicons name="time-outline" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={()  => navigation.navigate('Settings')} style={{ marginRight: 10 }}>
              <Ionicons name="settings-outline" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => alert('Profile clicked')}>
              <Ionicons name="person-circle-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Pickers with Swap Button */}
        <View style={[styles.dropdownContainer, { alignItems: 'center' }]}>
          <DropDownPicker
            open={openSource}
            value={sourceLang}
            items={languages}
            setOpen={setOpenSource}
            setValue={setSourceLang}
            placeholder="From"
            containerStyle={{ flex: 1, marginRight: 5 }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            zIndex={5000}
            labelStyle={{ color: 'white' }}
            selectedItemLabelStyle={{ color: 'white', fontWeight: 'bold' }}
            listItemLabelStyle={{ color: 'white' }}
            arrowIconStyle={{ tintColor: 'white' }}
            tickIconStyle={{ tintColor: 'white' }}
          />

          {/* Swap Button */}
          <TouchableOpacity
            onPress={() => {
              const temp = sourceLang;
              setSourceLang(targetLang);
              setTargetLang(temp);
            }}
            style={styles.swapBtn}
          >
            <MaterialIcons name="swap-horiz" size={28} color="white" />
          </TouchableOpacity>

          <DropDownPicker
            open={openTarget}
            value={targetLang}
            items={languages}
            setOpen={setOpenTarget}
            setValue={setTargetLang}
            placeholder="To"
            containerStyle={{ flex: 1, marginLeft: 5 }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            zIndex={4000}
            labelStyle={{ color: 'white' }}
            selectedItemLabelStyle={{ color: 'white', fontWeight: 'bold' }}
            listItemLabelStyle={{ color: 'white' }}
            arrowIconStyle={{ tintColor: 'white' }}
            tickIconStyle={{ tintColor: 'white' }}
          />
        </View>

        {/* Chat Area */}
        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={{ padding: 10, flexGrow: 1 }}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.type === 'user' ? styles.userBubble : styles.translatedBubble
              ]}
            >
              <Text style={{ color: msg.type === 'user' ? 'white' : 'black' }}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputWrapper}
        >
          <View style={styles.inputArea}>
            <TouchableOpacity onPress={() => alert('Mic clicked')} style={styles.micBtn}>
              <Ionicons name="mic-outline" size={24} color="white" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Type a message"
              placeholderTextColor="#888"
              value={text}
              onChangeText={setText}
            />

            <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
              <MaterialIcons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },

  topBar: {
    height: 80,
    backgroundColor: '#1f1f1f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: 20,
  },

  title: { fontSize: 18, fontWeight: 'bold', color: 'white' },

  dropdownContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 10,
    zIndex: 1000,
  },

  dropdown: { backgroundColor: '#1f1f1f', borderColor: '#333' },
  dropdownContainerStyle: { backgroundColor: '#1f1f1f' },

  swapBtn: {
    padding: 5,
    marginHorizontal: 5,
    backgroundColor: '#333',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chatArea: { flex: 1 },

  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },

  translatedBubble: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },

  inputWrapper: { paddingBottom: 20 },

  inputArea: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    marginBottom: 10,
  },

  micBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginRight: 10,
    color: 'white',
  },

  sendBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 10,
  },
});