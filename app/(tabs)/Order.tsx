// app/Orders.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";

// 🔹 Type for an Order
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

interface Order {
  id: string;
  uid: string;
  status?: string;
  totalAmount: number;
  createdAt?: any; // Firestore Timestamp
  items?: OrderItem[];
}

export default function Orders() {
  const { userData: authUserData, user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const userName =
    authUserData?.name ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  const initial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const snap = await getDocs(collection(db, "orders"));

        // Map with proper typing
        const data: Order[] = snap.docs
          .map((d: QueryDocumentSnapshot<DocumentData>) => ({
            ...(d.data() as Order), // first spread Firestore data
            id: d.id,               // then overwrite with Firestore doc ID
          }))
          .filter((d) => d.uid === user.uid)
          .sort((a, b) => {
            const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
            const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
            return bTime - aTime;
          });


        setOrders(data);
      } catch (err) {
        console.log("Error fetching orders (likely permission issue):", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <Header initial={initial} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#416944" />
          <Text style={{ marginTop: 10, color: "#555" }}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <Header initial={initial} />
        <View style={styles.centered}>
          <Text style={{ fontSize: 16, color: "#444" }}>
            Please login to view your orders.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header initial={initial} />

      {orders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={{ color: "#777", fontSize: 16 }}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(order) => order.id}
          contentContainerStyle={{ paddingBottom: 110 }}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Order ID: {item.id}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.status === "Delivered"
                          ? "#3B7C3C"
                          : item.status === "Pending"
                            ? "#F2A900"
                            : "#416944",
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.status || "Processing"}
                  </Text>
                </View>
              </View>

              {/* Total & Date */}
              <Text style={styles.total}>Total: ₹{item.totalAmount}</Text>
              {item.createdAt?.toDate && (
                <Text style={styles.date}>
                  Ordered on: {item.createdAt.toDate().toLocaleString()}
                </Text>
              )}

              {/* Items */}
              <View style={styles.itemsContainer}>
                <Text style={styles.itemsTitle}>Items:</Text>
                {item.items?.map((prod, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemName}>{prod.name}</Text>
                    <Text style={styles.itemQty}>x{prod.quantity}</Text>
                    <Text style={styles.itemPrice}>
                      ₹{(prod.price * prod.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const Header = ({ initial }: { initial: string }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={22} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>My Orders</Text>
    <TouchableOpacity onPress={() => router.push("/Profile")}>
      <View style={styles.profileCircle}>
        <Text style={styles.profileText}>{initial}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FDF8" },
  header: {
    paddingTop: 45,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#416944",
    boxShadow: "0px 2px 4px #00000020",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: { color: "#416944", fontWeight: "bold", fontSize: 16 },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    boxShadow: "0px 2px 3px #00000008",
    marginHorizontal: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#416944",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontWeight: "bold", color: "#333", fontSize: 15 },
  total: { fontSize: 16, fontWeight: "700", color: "#416944", marginTop: 5 },
  date: { fontSize: 12, color: "#666", marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  itemsContainer: { marginTop: 10, borderTopWidth: 1, borderTopColor: "#E0E0E0", paddingTop: 8 },
  itemsTitle: { fontWeight: "700", marginBottom: 6, color: "#333" },
  itemRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#F9FFF9", paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6, marginBottom: 4 },
  itemName: { flex: 1, color: "#333", fontWeight: "500" },
  itemQty: { width: 50, textAlign: "center", color: "#555" },
  itemPrice: { width: 80, textAlign: "right", color: "#416944", fontWeight: "600" },
});
