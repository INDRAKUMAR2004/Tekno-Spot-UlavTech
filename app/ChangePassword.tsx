import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";

const UpdatePassword = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Reauthenticate before changing password
  const reauthenticateUser = async (currentPassword: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("No authenticated user found.");

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  };

  // 🔹 Handle Password Update
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await reauthenticateUser(currentPassword);
      const user = auth.currentUser;

      if (user) {
        await updatePassword(user, newPassword);
        Alert.alert(
          "Success",
          "Your password has been updated successfully.",
          [
            {
              text: "OK",
              onPress: async () => {
                // Optional: Log out for security reasons
                await auth.signOut();
                router.replace("/LoginScreen"); // Redirect to login
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "The current password is incorrect.");
      } else {
        Alert.alert("Error", error.message || "Failed to update password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Update Password</Text>

      <TextInput
        placeholder="Current Password"
        placeholderTextColor={"#000"}
        secureTextEntry
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        placeholder="New Password"
        placeholderTextColor={"#000"}
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        placeholder="Confirm New Password"
        placeholderTextColor={"#000"}
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleUpdatePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Password</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#416944",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#000"
  },
  button: {
    backgroundColor: "#416944",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UpdatePassword;
