import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

const MyHeader = () => {
  const { user: userData } = useUser();
  const { userData: authUserData, firebaseUser, loading } = useAuth();
  const router = useRouter();

  const userName =
    authUserData?.name ||
    firebaseUser?.displayName ||
    firebaseUser?.email?.split("@")[0] ||
    "User";

  const initial = userName.charAt(0).toUpperCase();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.topBar}>
        {/* LEFT SIDE */}
        <View style={styles.leftContainer}>
          <MaterialIcons
            name="location-pin"
            size={24}
            color="#416944"
            style={styles.locationIcon}
          />

          <View style={styles.textContainer}>
            <View style={styles.locationTopRow}>
              <Text
                style={styles.username}
                numberOfLines={1}
                onPress={() => router.push("/SelectAddress")}
              >
                {loading ? "Loading..." : userName}
              </Text>

              <FontAwesome
                name="angle-down"
                size={16}
                style={styles.dropdownIcon}
              />
            </View>

            <Text style={styles.locationAddress} numberOfLines={1}>
              {userData?.selectedAddress?.details ||
                userData?.addresses?.[0]?.details ||
                "No address selected"}
            </Text>
          </View>
        </View>

        {/* RIGHT SIDE */}
        <TouchableOpacity onPress={() => router.push("/Profile")}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>{initial}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    zIndex: 100,
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  locationIcon: {
    marginRight: 8,
  },

  textContainer: {
    flex: 1,
  },

  locationTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  username: {
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: "90%",
  },

  dropdownIcon: {
    marginLeft: 4,
  },

  locationAddress: {
    fontSize: 11,
    color: "gray",
    marginTop: 2,
  },

  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#416944",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  profileText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default MyHeader;
