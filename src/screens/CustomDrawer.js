import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const dummyHistory = [
  { id: "1", title: "Hello → Bonjour" },
  { id: "2", title: "How are you?" },
];

export default function CustomDrawer() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>

      <FlatList
        data={dummyHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyText}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  historyText: {
    color: "#ddd",
  },
});