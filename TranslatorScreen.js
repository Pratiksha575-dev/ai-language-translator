// 🔥 ONLY IMPORTANT CHANGES DONE — CLEAN VERSION

import 'react-native-gesture-handler';
import React, { useState, useContext, useRef } from 'react';
import { Audio } from "expo-av";
import axios from 'axios';
import * as Speech from "expo-speech";
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard,
  ActivityIndicator, Image
} from 'react-native';

import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { HistoryContext } from './HistoryContext';
import { translateParallel } from './services/translationOrchestrator';
import * as ImagePicker from "expo-image-picker";

export default function TranslatorScreen({ navigation }) {

  const { addHistory } = useContext(HistoryContext);

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');

  const [pendingImage, setPendingImage] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const flatListRef = useRef();

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Marathi', value: 'mr' },
    { label: 'Tamil', value: 'ta' },
    { label: 'Telugu', value: 'te' },
  ];

  const speechLangMap = {
    en: "en-US", hi: "hi-IN", mr: "mr-IN", ta: "ta-IN", te: "te-IN"
  };

  /* 🔥 TEXT TRANSLATION */
  const sendMessage = async (inputText = text) => {
    if (!inputText || loading) return;

    setMessages(prev => [...prev, { type: "user", text: inputText }]);

    try {
      setLoading(true);

      let results = [];

      if (compareMode) {
        results = await translateParallel(inputText, sourceLang, targetLang);
      } else {
        const res = await axios.post(
          "https://multi-modal-langauge-translator.onrender.com/translate/google",
          { text: inputText, sourceLang, targetLang }
        );

        results = [{
          name: "Result",
          text: res.data.translation,
          time: 0,
          success: true
        }];
      }

      setMessages(prev => [
        ...prev,
        { type: "translated", results, selectedIndex: 0 }
      ]);

      addHistory({
        id: Date.now(),
        inputText,
        results,
        sourceLang,
        targetLang,
        compareMode
      });

    } catch (err) {
      console.log("ERROR:", err.message);
    } finally {
      setLoading(false);
      setText("");
    }
  };

  /* 🔥 IMAGE PICK */
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images
    });

    if (res.canceled) return;

    const img = res.assets[0];

    setMessages(prev => [...prev, { type: "image", uri: img.uri }]);
    setPendingImage(img);
    setShowImageOptions(true);
  };

  /* 🔥 IMAGE ACTION */
  const handleImageAction = async (mode) => {
    setShowImageOptions(false);

    const formData = new FormData();
    formData.append("image", {
      uri: pendingImage.uri,
      type: "image/jpeg",
      name: "image.jpg"
    });

    formData.append("targetLang", targetLang);
    formData.append("mode", mode);

    try {
      setLoading(true);

      const res = await fetch(
        "https://multi-modal-langauge-translator.onrender.com/image-process",
        { method: "POST", body: formData }
      );

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          type: "translated",
          results: [{ name: mode, text: data.result }],
          selectedIndex: 0
        }
      ]);

    } catch (err) {
      console.log("IMAGE ERROR:", err);
    } finally {
      setLoading(false);
      setPendingImage(null);
    }
  };

  const speakText = (text, lang) => {
    Speech.speak(text, { language: speechLangMap[lang] });
  };

  /* 🔥 RENDER ITEM (for smooth scroll) */
  const renderItem = ({ item, index }) => {

    if (item.type === "image") {
      return <Image source={{ uri: item.uri }} style={{ width: 200, height: 200, alignSelf: "flex-end", margin: 10 }} />;
    }

    if (item.type === "user") {
      return <View style={[styles.userBubble]}><Text style={{ color: "white" }}>{item.text}</Text></View>;
    }

    if (item.type === "translated") {
      return (
        <View style={styles.translatedBubble}>
          <Text>{item.results[0].text}</Text>
          <TouchableOpacity onPress={() => speakText(item.results[0].text, targetLang)}>
            <Ionicons name="volume-high-outline" size={20} />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* 🔥 TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Multimodal Translator</Text>

        <TouchableOpacity onPress={() => setCompareMode(!compareMode)}>
          <Text style={{ color: "white" }}>
            {compareMode ? "Compare ON" : "Compare OFF"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Analytics")}>
        <Ionicons name="analytics-outline" size={26} color="white" />
      </TouchableOpacity>
      </View>

      {/* 🔥 CHAT (FIXED SMOOTH SCROLL) */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      {/* 🔥 IMAGE OPTIONS */}
      {showImageOptions && (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity onPress={() => handleImageAction("translate")}>
            <Text style={{ color: "white" }}>Translate</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImageAction("explain")}>
            <Text style={{ color: "white" }}>Explain</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 🔥 INPUT */}
      <View style={styles.inputArea}>
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="white" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity onPress={() => sendMessage()}>
          <MaterialIcons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

/* 🔥 STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1f1f1f'
  },

  title: { color: "white", fontWeight: "bold" },

  userBubble: {
    backgroundColor: '#007AFF',
    padding: 10,
    margin: 10,
    alignSelf: 'flex-end',
    borderRadius: 10
  },

  translatedBubble: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    margin: 10,
    borderRadius: 10
  },

  inputArea: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1f1f1f'
  },

  input: {
    flex: 1,
    color: 'white',
    marginHorizontal: 10
  }
});