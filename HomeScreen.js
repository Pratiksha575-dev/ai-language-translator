import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.heading}>Language Translator</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ResearchHome")}
      >
        <Text style={styles.buttonText}>🧪 Research Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Translator", { mode: "user" })
        }
      >
        <Text style={styles.buttonText}>🌍 User Mode</Text>
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

  heading: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40
  },

  button: {
    width: "70%",
    height: 60,
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10
  },

  buttonText: {
    color: "white",
    fontSize: 16
  }
});