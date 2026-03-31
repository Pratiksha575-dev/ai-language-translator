import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import { supabase } from "./supabase";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const ProfilePage = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔥 Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData?.user) {
        throw new Error("User not logged in");
      }

      const userId = authData.user.id;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      setUser(data);
      setName(data?.name || "");
      setAvatar(data?.avatar_url || null);

    } catch (err) {
      console.log("PROFILE ERROR:", err.message);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 📸 Pick image
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // 💾 Update profile
  const updateProfile = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user.id;

      const { error } = await supabase
        .from("users")
        .update({
          name,
          avatar_url: avatar,
        })
        .eq("id", userId);

      if (error) throw error;

      Alert.alert("Profile updated");
      setEditMode(false);
      fetchProfile();

    } catch (err) {
      console.log(err.message);
    }
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace("Login");
  };

  // 🔄 Loading UI
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading Profile...</Text>
      </View>
    );
  }

  // ❌ No data
  if (!user) {
    return (
      <View style={styles.loader}>
        <Text>No profile data found</Text>
      </View>
    );
  }

  // ✅ UI
  return (
    <View style={styles.container}>

      {/* 👤 Profile Card */}
      <View style={styles.card}>

        {/* Profile Image / Icon */}
        <TouchableOpacity onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.image} />
          ) : (
            <Ionicons
              name="person-circle"
              size={100}
              color="#007AFF"
              style={{ marginBottom: 15 }}
            />
          )}
        </TouchableOpacity>

        {/* Name */}
        {editMode ? (
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor="#888"
          />
        ) : (
          <Text style={styles.name}>{user?.name || "User"}</Text>
        )}

        {/* Email */}
        <Text style={styles.email}>{user?.email}</Text>

        {/* Edit / Save */}
        {editMode ? (
          <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
            <Text style={{ color: "white" }}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setEditMode(true)}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
};

export default ProfilePage;

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  topBar: {
    paddingTop: Platform.OS === "android" ? 35 : 50,
    paddingBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: "#1f1f1f",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  card: {
    marginTop: 60,
    marginHorizontal: 20,
    padding: 25,
    backgroundColor: "#1f1f1f",
    borderRadius: 15,
    alignItems: "center",
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#007AFF",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  email: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },

  editText: {
    color: "#007AFF",
    marginTop: 10,
  },

  input: {
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    color: "white",
    marginTop: 10,
  },

  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },

  logoutBtn: {
    marginTop: 50,
    marginHorizontal: 40,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },

  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});