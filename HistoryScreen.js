// HistoryScreen.js
import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { HistoryContext } from './HistoryContext';

export default function HistoryScreen({ navigation }) {
  const { history } = useContext(HistoryContext);
  const [activeTab, setActiveTab] = useState('translated');

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>History & Favorites</Text>

        <TouchableOpacity>
          <MaterialIcons name="delete-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'translated' && styles.activeTab]}
          onPress={() => setActiveTab('translated')}
        >
          <Text style={styles.tabText}>Translated</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={styles.tabText}>Favorites</Text>
        </TouchableOpacity>
      </View>

      {/* History List */}
      <ScrollView style={{ padding: 15 }}>
        {history.length === 0 && (
          <Text style={styles.noHistory}>No history yet</Text>
        )}

        {history.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.rowBetween}>
             <Text style={styles.langText}>
             {(item.sourceLang || '').toUpperCase()} {'→'} {(item.targetLang || '').toUpperCase()}
              </Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>

            <Text style={styles.sourceText}>{item.source}</Text>
            <Text style={styles.translatedText}>{item.translated}</Text>

            <View style={styles.iconRow}>
              <TouchableOpacity>
                <Ionicons name="star-outline" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 15 }}>
                <MaterialIcons name="delete-outline" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#1f1f1f',
    marginHorizontal: 15,
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#333',
  },
  tabText: {
    color: 'white',
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  langText: {
    color: '#aaa',
    fontSize: 12,
  },
  time: {
    color: '#aaa',
    fontSize: 12,
  },
  sourceText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  translatedText: {
    color: '#4da6ff',
    fontSize: 16,
    marginTop: 5,
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 15,
  },
  noHistory: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
});