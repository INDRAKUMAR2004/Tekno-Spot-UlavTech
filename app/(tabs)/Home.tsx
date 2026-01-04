import { FontAwesome } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import Banner from "../Banner";
import CartSummary from "../CartSummary";
import FastMovingRow from "../FastMovingRow";
import MyHeader from "../MyHeader";
import ProductCard from "../ProductCard";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const PRODUCT_DATA = [
  { id: "1", name: "Ginger", source: require("../Components/Images/ginger.png"), price: 25, weight: "250gm" },
  { id: "2", name: "Apple", source: require("../Components/Images/apple.png"), price: 180, weight: "1kg" },
  { id: "3", name: "Ladies Finger", source: require("../Components/Images/ladiesfinger.png"), price: 35, weight: "500gm" },
  { id: "4", name: "Cauliflower", source: require("../Components/Images/cauliflower.png"), price: 35, weight: "750gm" },
];


export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [search, setSearch] = useState("");
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const { user } = useUser();
  const initial = user?.name?.charAt(0).toUpperCase() || "M";

  useEffect(() => {
    if (params.clearCart === "true") {
      clearCart();
      router.setParams({ clearCart: undefined });
    }
  }, [params]);

  const cartTotal = cartItems.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity,
    0
  );

  const filteredData = search
    ? PRODUCT_DATA.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
    : PRODUCT_DATA;

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <MyHeader />

      <ScrollView>
        <View style={styles.container}>
          {/* 🔍 Search Box */}
          <View style={styles.searchBoxContainer}>
            <FontAwesome
              name="search"
              size={18}
              color="#416944"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchBox}
              placeholder="Search Our Products"
              placeholderTextColor="#6b6b6b"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {search.length > 0 ? (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard
                  item={item}
                  onAddToCart={() => addToCart({ ...item, price: Number(item.price) })}
                  onPress={() => router.push({
                    pathname: "/ProductDetails",
                    params: { ...item }
                  })}
                />

              )}
              ListEmptyComponent={
                <Text style={styles.noItemsText}>No items found.</Text>
              }
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }} // Added paddingHorizontal
            />
          ) : (
            <>
              <Banner />

              {/* Fast Moving Section */}
              <View style={[styles.titlebar, { paddingHorizontal: 16 }]}>
                <Text style={styles.titleLeftText}>⚡ Fast Moving</Text>
                <TouchableOpacity
                  onPress={() => router.push("/componentTabs/mainComponents")}
                >
                  <Text style={styles.titleRightText}>
                    View All <FontAwesome name="arrow-right" size={12} color="#416944" />
                  </Text>
                </TouchableOpacity>
              </View>

              <FastMovingRow />

              {/* Fruits & Veggies Section */}
              <View style={[styles.titlebar, { marginTop: 16, paddingHorizontal: 15 }]}>
                <Text style={styles.titleLeftText}>
                  🥬 24-Hour Delivery
                </Text>

                <TouchableOpacity
                  onPress={() => router.push("/componentTabs/mainComponents")}
                >
                  <Text style={styles.titleRightText}>
                    View All <FontAwesome name="arrow-right" size={12} color="#416944" />
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.subInfoText, { paddingHorizontal: 16 }]}>
                Get select items delivered within 24 hours!
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {PRODUCT_DATA.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onAddToCart={() => addToCart({ ...item, price: Number(item.price) })}
                    onPress={() => router.push({
                      pathname: "/ProductDetails",
                      params: { ...item }
                    })}
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>

      {/* 🛒 Cart Summary */}
      {cartItems.length > 0 && (
        <CartSummary
          totalItems={totalItems}
          totalCost={Number(cartTotal)}
          onClearCart={clearCart}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAF6",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50, // More space for status bar
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    // Removed border, added soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    zIndex: 100,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAF6", // Light premium green/grey tint
    // Removed paddingHorizontal to allow full-width Banner
    paddingTop: 20,
    paddingBottom: 110,
  },
  searchBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginHorizontal: 16, // Added margin for spacing
    marginBottom: 20,
    height: 50,
    // Floating effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 0, // Clean look
  },
  searchIcon: {
    marginRight: 10,
    opacity: 0.6,
  },
  searchBox: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 15,
    color: "#2D2D2D",
    height: '100%',
  },
  titlebar: {
    // Removed background and elevation for cleaner "Section Header" look
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  titleLeftText: {
    fontWeight: "800",
    fontSize: 18, // Larger heading size
    color: "#1a1a1a",
  },
  titleRightText: {
    fontWeight: "600",
    fontSize: 13,
    color: "#416944",
  },
  subInfoText: {
    color: "#6b6b6b",
    fontSize: 13,
    padding: 15,
    paddingBottom: 10,
  },
  noItemsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
    fontWeight: "600",
  },
});