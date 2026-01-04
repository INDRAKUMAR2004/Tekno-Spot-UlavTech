import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";
import * as Location from "expo-location";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function SelectAddress() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleSelect = async (addressId: string) => {
    const selected = user?.addresses.find((a: { id: string; }) => a.id === addressId);
    if (selected) {
      const updatedUser = { ...user, selectedAddress: selected };
      setUser(updatedUser);


      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { selectedAddress: selected });
      }

      router.back();
    }
  };

  const handleAddNewAddress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied!", "Please allow location access.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const geo = await Location.reverseGeocodeAsync(loc.coords);

    const newAddress = {
      id: Date.now().toString(),
      label: "Current Location",
      details: `${geo[0]?.city || ""}, ${geo[0]?.district || ""}`,
    };

    const updatedUser = {
      ...user,
      addresses: [...(user?.addresses || []), newAddress],
      selectedAddress: newAddress,
    };

    setUser(updatedUser);


    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        addresses: updatedUser.addresses,
        selectedAddress: newAddress,
      });
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Addresses</Text>

      <FlatList
        data={user?.addresses || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => { handleSelect(item.id); }} style={styles.row}>
            <Text style={styles.name}>{item.label}</Text>
            <Text style={styles.details}>{item.details}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => router.push("/FindAddress")}
        style={styles.addBtn}
      >
        <Text style={styles.addText}>+ Add new address</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleAddNewAddress}
        style={[styles.addBtn, { marginTop: 10 }]}
      >
        <Text style={[styles.addText, { color: "blue" }]}>
          + Use Current Location
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: "#fff",
  },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  row: { marginBottom: 15 },
  name: { fontWeight: "bold", fontSize: 16 },
  details: { color: "gray", fontSize: 13 },
  addBtn: { marginTop: 20 },
  addText: { color: "green", fontWeight: "bold" },
});
