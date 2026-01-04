import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { storage } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";


export default function PersonalInfo() {
  const { userData, updateUserData, user } = useAuth();
  const [name, setName] = useState(userData?.name || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [image, setImage] = useState(userData?.photoURL || null);
  const [uploading, setUploading] = useState(false);

  

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!name.trim() || !phone.trim() || !email.trim()) {
        Alert.alert("Missing Fields", "Please fill out all fields.");
        return;
      }

      if (!user) throw new Error("No logged-in user found");

      // Handle reauth for email change
      if (email !== user.email) {
        if (!currentPassword) {
          Alert.alert(
            "Reauthentication Required",
            "Enter your current password to change email."
          );
          return;
        }
        const cred = EmailAuthProvider.credential(
          user.email!,
          currentPassword
        );
        await reauthenticateWithCredential(user, cred);
        await updateEmail(user, email);
      }

    let photoURL = userData?.photoURL || null;
if (image && image !== userData?.photoURL) {
  setUploading(true);
  const response = await fetch(image);
  const blob = await response.blob();
  const storageRef = ref(storage, `profileImages/${user.uid}.jpg`);
  await uploadBytes(storageRef, blob);
  photoURL = await getDownloadURL(storageRef);
  setUploading(false);
}

// ✅ Update Firestore directly
const userRef = doc(db, "users", user.uid);
await updateDoc(userRef, {
  name,
  phone,
  email,
  photoURL,
});

Alert.alert("Success", "Profile updated successfully!");
router.dismissTo("/Profile");
    } catch (err: any) {
      setUploading(false);
      if (err.code === "auth/wrong-password") {
        Alert.alert("Incorrect Password", "The current password is incorrect.");
      } else if (err.code === "auth/email-already-in-use") {
        Alert.alert("Email Exists", "That email address is already in use.");
      } else {
        Alert.alert("Error", err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Personal Info</Text>

      {/* Profile Photo */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePlaceholder}>Upload Photo</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
        placeholderTextColor={"#000"}
      />
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone Number"
        placeholderTextColor={"#000"}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
        placeholderTextColor={"#000"}
        keyboardType="email-address"
      />

      {email !== user?.email && (
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter Current Password"
          placeholderTextColor={"#000"}
          secureTextEntry
        />
      )}

      <TouchableOpacity
        style={[styles.button, uploading && { opacity: 0.6 }]}
        onPress={handleUpdate}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? "Uploading..." : "Save Changes"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.dismissTo("/Profile")}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f9f9f9" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 25, textAlign: "center", color: "#416944" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: "#fff", fontSize: 16, color: "#000" },
  button: { backgroundColor: "#416944", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelText: { textAlign: "center", marginTop: 15, color: "#416944", fontWeight: "600" },
  imageContainer: { alignSelf: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  imagePlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#d9e7db", textAlign: "center", textAlignVertical: "center", color: "#416944" },
});