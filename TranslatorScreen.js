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
import { Audio } from "expo-av";
import axios from 'axios';
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
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { HistoryContext } from './HistoryContext'; // import context
import {translateParallel } from './services/translationOrchestrator';

export default function TranslatorScreen({ navigation }) {
  const { addHistory } = useContext(HistoryContext); // get function from context

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');

  const [openSource, setOpenSource] = useState(false);
  const [openTarget, setOpenTarget] = useState(false);
 //need to change this to indian langauges.
  const languages = [
  { label: 'English', value: 'en' },  
  { label: 'Hindi', value: 'hi' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Urdu', value: 'ur' },
];

/*-------TEXT TRANSLATION LOGIC   ------*/
 const sendMessage = async (inputText = text) => {
  if (!inputText) return;

  const userMessage = { type: 'user', text: inputText };
  setMessages(prev => [...prev, userMessage]);

  try {
    setLoading(true);

    const results = await translateParallel(inputText, sourceLang, targetLang);
    const successful = results.filter(r => r.success);

    if (successful.length > 0) {
      setMessages(prev => [
        ...prev,
        {
          type: "translated",
          results: successful,
          selectedIndex: 0
        }
      ]);

      addHistory(inputText, successful[0].text, sourceLang, targetLang);
    } else {
      setMessages(prev => [
        ...prev,
        { type: 'translated', results: [], selectedIndex: 0 }
      ]);
    }

  } catch (error) {
    console.log("FULL ERROR:", error.response?.data || error.message);
    setMessages(prev => [
      ...prev,
      { type: 'translated', results: [], selectedIndex: 0 }
    ]);
  } finally {
    setLoading(false);
    setText('');
  }
};

/*----------TAB SWITCH--------*/
  const changeTab = (msgIndex, tabIndex) => {
    setMessages(prev => {
      const updated = [...prev];
      updated[msgIndex].selectedIndex = tabIndex;
      return updated;
    });
  };

/*----------AUDIO RECORDING-------*/
const [recording, setRecording] = useState(null);
const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      setRecording(recording);

    } catch (err) {
      console.log("Recording error:", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      await sendAudioToBackend(uri);

    } catch (err) {
      console.log("Stop recording error:", err);
    }
  };

  const sendAudioToBackend = async (uri) => {
    try {
      const formData = new FormData();

      formData.append("audio", {
        uri,
        name: "recording.wav",
        type: "audio/wav",
      });

      const response = await axios.post(
        "http://192.168.1.201:5000/transcribe",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const transcribedText = response.data.text;

      await sendMessage(transcribedText);

    } catch (error) {
      console.log("AUDIO ERROR:", error.response?.data || error.message);
    }
  };

  /*-------- UI LOGIC --------*/
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
          {messages.map((msg, index) => {

            if (msg.type === "user") {
              return (
                <View key={index} style={[styles.messageBubble, styles.userBubble]}>
                  <Text style={{ color: "white" }}>{msg.text}</Text>
                </View>
              );
            }

            if (msg.type === "translated") {
              return (
                <View key={index} style={[styles.messageBubble, styles.translatedBubble]}>

                  {msg.results.length > 0 ? (
                    <>
                      <View style={styles.tabRow}>
                        {msg.results.map((res, i) => (
                          <TouchableOpacity
                            key={i}
                            onPress={() => changeTab(index, i)}
                            style={[
                              styles.tabButton,
                              msg.selectedIndex === i && styles.activeTab
                            ]}
                          >
                            <Text style={{ fontSize: 12 }}>
                              {res.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <Text style={{ marginTop: 6 }}>
                        {msg.results[msg.selectedIndex].text}
                      </Text>

                      <Text style={{ fontSize: 10, marginTop: 4 }}>
                        {msg.results[msg.selectedIndex].time} ms
                      </Text>
                    </>
                  ) : (
                    <Text>No API responded successfully.</Text>
                  )}

                </View>
              );
            }

            return null;
          })}

          {loading && (
            <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 10}} />
          )}
        </ScrollView>

        {/* Bottom Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputWrapper}
        >
          <View style={styles.inputArea}>
            <TouchableOpacity 
            onPress={recording ? stopRecording : startRecording} style={styles.micBtn}>
              <Ionicons
                name={recording ? "stop-circle" : "mic-outline"}
                size={24}
                color="white"
              />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Type a message"
              placeholderTextColor="#888"
              value={text}
              onChangeText={setText}
            />

            <TouchableOpacity onPress={() => sendMessage(text)} style={styles.sendBtn}>
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

  tabRow: {
  flexDirection: "row",
  marginBottom: 5,
},

tabButton: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  backgroundColor: "#ccc",
  borderRadius: 10,
  marginRight: 5,
},

  inputWrapper: { paddingBottom: 20 },

   activeTab: {
    backgroundColor: "#007AFF",
  },
  
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