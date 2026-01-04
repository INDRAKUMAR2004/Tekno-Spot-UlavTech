import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// 🔹 Constants
const WHATSAPP_NUMBER = "919943347651"; // FIXME: Update with the merchant's WhatsApp number

export default function PaymentScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { cartItems, setCartItems } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  // ✅ Handle WhatsApp Order
  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please login before proceeding.");
      return;
    }

    if (total === 0) {
      Alert.alert("Empty Cart", "Please add some items to your cart first.");
      return;
    }

    // 1️⃣ Construct the Message
    let message = `*New Order Request* 🛒\n\n`;
    message += `*Customer:* ${user.displayName || "Guest"}\n`;
    message += `*Contact:* ${user.phoneNumber || user.email || "N/A"}\n\n`;
    message += `*Items:*\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x ${item.quantity} - ₹${item.price * item.quantity}\n`;
    });

    message += `\n*Total Amount: ₹${total.toLocaleString()}*\n\n`;
    message += `Please confirm this order and share payment details.`;

    // 2️⃣ Open WhatsApp
    const url = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

    try {
        const supported = await Linking.canOpenURL(url);
        // Note: canOpenURL often returns false on Android 11+ without queries config, but just trying to open works usually if app is installed.
        // We will just try to open it.
        await Linking.openURL(url);
        
        // Optional: Clear cart after successful 'intent' to link? 
        // Or keep it until they confirm? Let's clear it to "simulate" placed order.
        Alert.alert(
            "Order Request Sent", 
            "You have been redirected to WhatsApp to send your order. We will process it shortly.",
            [
                { text: "OK", onPress: () => {
                    setCartItems([]);
                    router.push("/(tabs)/Home");
                }}
            ]
        );

    } catch (err) {
      Alert.alert("Error", "Could not open WhatsApp. Please ensure it is installed.");
    }
  };

  // ⏳ Show loader while Auth is initializing
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#416944" />
        <Text style={{ marginTop: 10 }}>Loading user info...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
          <Text style={styles.title}>Order Summary</Text>
          
          <ScrollView style={styles.itemList} showsVerticalScrollIndicator={false}>
            {cartItems.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name} <Text style={styles.itemQty}>x{item.quantity}</Text></Text>
                    <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                </View>
            ))}
          </ScrollView>

          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.amount}>₹{total.toLocaleString()}</Text>
          </View>
      </View>

      <TouchableOpacity
        style={[
          styles.payBtn,
          { backgroundColor: total === 0 ? "#ccc" : "#25D366" }, // WhatsApp Color
        ]}
        disabled={total === 0}
        onPress={handlePlaceOrder}
      >
        <Ionicons name="logo-whatsapp" size={24} color="#fff" style={{marginRight: 10}} />
        <Text style={styles.payText}>Place Order on WhatsApp</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()} style={{marginTop: 20}}>
          <Text style={{color: '#666'}}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FDF8",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7F5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
      backgroundColor: '#fff',
      width: '100%',
      padding: 20,
      borderRadius: 15,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      marginBottom: 30,
      maxHeight: '60%'
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: 'center'
  },
  itemList: {
      marginBottom: 15
  },
  itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10
  },
  itemName: {
      fontSize: 16,
      color: '#333'
  },
  itemQty: {
      fontWeight: 'bold',
      color: '#416944'
  },
  itemPrice: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333'
  },
  divider: {
      height: 1,
      backgroundColor: '#eee',
      marginVertical: 10
  },
  totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 5
  },
  totalLabel: {
      fontSize: 18,
      fontWeight: '700',
      color: '#333'
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#416944",
  },
  payBtn: {
    padding: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 5
  },
  payText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
