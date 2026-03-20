import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ResearchHome({ navigation }) {
  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("Translator", { mode: "research" })
        }
      >
        <Text style={styles.title}>🧪 Test APIs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Analytics")}
      >
        <Text style={styles.title}>📊 See Analytics</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: "80%",
    height: 120,
    backgroundColor: "#1f1f1f",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  }
});