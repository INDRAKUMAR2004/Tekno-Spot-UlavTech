import { useUser } from "@/context/UserContext";
import { auth } from "@/firebaseConfig";
import { AntDesign, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import PaymentIcon from "./Components/SvgIcons/paymentIcon";

export default function Profile() {
  const router = useRouter();
  const { user } = useUser();
  const { userData } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged out", "You have been signed out successfully.");
      router.replace("/LoginScreen");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Profile",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={24} color="#416944" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.profileHeader}>
        <View style={styles.profileCircle}>
          {userData?.photoURL ? (
            <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
          ) : (
            <FontAwesome name="user" size={40} color="#416944" />
          )}
        </View>

        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => router.push("/PersonalInfo")}
        >
          <AntDesign name="edit" size={18} color="#416944" />
        </TouchableOpacity>

        <Text style={styles.profileName}>{userData?.name || "No Name"}</Text>
        <Text style={styles.profileEmail}>{userData?.email || user?.email}</Text>
        <Text style={styles.profilePhone}>{userData?.phone || "No Phone Added"}</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/PersonalInfo")}
          >
            <FontAwesome name="user" size={20} color="#416944" />
            <Text style={styles.menu}>Personal Information</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => router.push("./ChangePassword")}>
            <MaterialIcons name="password" size={20} color="#416944" />
            <Text style={styles.menu}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <Ionicons name="location-outline" size={20} color="#416944" />
            <Text style={styles.menu}>Delivery Address</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => router.push("/PaymentScreen")}>
            <PaymentIcon />
            <Text style={styles.menu}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Logout</Text>
        <View style={[styles.card, { marginBottom: 30 }]}>
          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#d9534f" />
            <Text style={[styles.menu, { color: "#d9534f" }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ✅ Styles must stay at the bottom, but above any extra code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f5",
    marginTop: 20,
  },
  profileHeader: {
    margin: 20,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    position: "relative",
  },
  profileCircle: {
    backgroundColor: "#ecf2ee",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIcon: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#eaf3ec",
    padding: 6,
    borderRadius: 8,
  },
  profileName: {
    fontWeight: "700",
    fontSize: 20,
    color: "#333",
    marginTop: 5,
  },
  profileEmail: {
    color: "#555",
    fontSize: 14,
    marginTop: 2,
  },
  profilePhone: {
    color: "#777",
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menu: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    paddingLeft: 15,
  },
});
