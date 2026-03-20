import 'react-native-gesture-handler';
import React, { useState, useContext } from 'react';
import { Audio } from "expo-av";
import axios from 'axios';
import * as Speech from "expo-speech";
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
import * as ImagePicker from "expo-image-picker";

export default function TranslatorScreen({  navigation,route}) {
  const { addHistory } = useContext(HistoryContext); // get function from context

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const mode=route?.params?.mode || "research";
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

const speechLangMap={
  en:"en-US",
  hi:"hi-IN",
  mr:"mr-IN",
  ta:"ta-IN",
  te:"te-IN"
}

/*-------TEXT TRANSLATION LOGIC   ------*/
const sendMessage = async (inputText = text) => {
  if (!inputText) return;

  const userMessage = { type: "user", text: inputText };
  setMessages(prev => [...prev, userMessage]);

  try {
    setLoading(true);

    let results = [];

    if (mode === "research") {
      results = await translateParallel(
        inputText,
        sourceLang,
        targetLang
      );
    } else {
      const start = Date.now();

      const res = await axios.post(
        "http://192.168.1.201:5000/translate/google",
        {
          text: inputText,
          sourceLang,
          targetLang
        }
      );

      const end = Date.now();

      results = [
        {
          name: "Google",
          text: res.data.translation,
          time: end - start,
          success: true
        }
      ];
    }

    console.log("RAW RESULTS:", results);

    // ✅ FIXED FILTER (NO success dependency)
    const cleanedResults = results
      .filter(r => r && r.text && r.name)
      .map(r => ({
        name: r.name,
        text: r.text,
        time: r.time || 0,
        success: true
      }));

    console.log("CLEANED RESULTS:", cleanedResults);

    if (cleanedResults.length > 0) {
      setMessages(prev => [
        ...prev,
        {
          type: "translated",
          results: cleanedResults,
          selectedIndex: 0
        }
      ]);

      // ✅ STORE ONLY RESEARCH MODE
      if (mode === "research") {
        addHistory({
          id: Date.now(),
          mode: "research", // 🔥 CRITICAL
          inputText,
          results: cleanedResults,
          sourceLang,
          targetLang,
          timestamp: Date.now()
        });

        console.log("Saved to history");
      }

    } else {
      setMessages(prev => [
        ...prev,
        {
          type: "translated",
          results: [],
          selectedIndex: 0
        }
      ]);
    }

  } catch (error) {
    console.log(
      "FULL ERROR:",
      error.response?.data || error.message
    );

    setMessages(prev => [
      ...prev,
      {
        type: "translated",
        results: [],
        selectedIndex: 0,
        error: true
      }
    ]);
  } finally {
    setLoading(false);
    setText("");
  }
};
/*-------Image Translation -----*/
const pickImageAndTranslate = async () => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) return;

    const image = result.assets[0];

    const formData = new FormData();
    formData.append("image", {
      uri: image.uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    setLoading(true);

    const response = await fetch("http://192.168.1.201:5000/ocr", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await response.json();

    console.log("OCR TEXT:", data.text);

    // 🔥 send extracted text to translation
    sendMessage(data.text);

  } catch (error) {
    console.log("OCR ERROR:", error);
  } finally {
    setLoading(false);
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

  const speakText = (text,lang) => {
  Speech.speak(text, {
    language: speechLangMap[lang],
    pitch: 1,
    rate: 0.9
  });
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

                      <View style={{ marginTop: 6 }}>
                          <Text style={{ flexWrap: "wrap" }}>
                            {msg.results[msg.selectedIndex].text}
                          </Text>

                          <TouchableOpacity
                            onPress={() =>
                              speakText(
                                msg.results[msg.selectedIndex].text,
                                targetLang
                              )
                            }
                            style={{ marginTop: 6 }}
                          >
                            <Ionicons name="volume-high-outline" size={20} color="#333" />
                          </TouchableOpacity>

                        </View>
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

              {/* MIC BUTTON */}
              <TouchableOpacity 
                onPress={recording ? stopRecording : startRecording} 
                style={styles.micBtn}
              >
                <Ionicons
                  name={recording ? "stop-circle" : "mic-outline"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>

              {/* 📸 IMAGE BUTTON (ONLY USER MODE) */}
              {mode === "user" && (
                <TouchableOpacity 
                  onPress={pickImageAndTranslate} 
                  style={styles.imageBtn}
                >
                  <Ionicons name="image-outline" size={24} color="white" />
                </TouchableOpacity>
              )}

              {/* TEXT INPUT */}
              <TextInput
                style={styles.input}
                placeholder="Type a message"
                placeholderTextColor="#888"
                value={text}
                onChangeText={setText}
              />

              {/* SEND BUTTON */}
              <TouchableOpacity 
                onPress={() => sendMessage(text)} 
                style={styles.sendBtn}
              >
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
    maxWidth: '85%',
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

  imageBtn: {
  backgroundColor: '#444',
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