// CategoryTabs.tsx
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext"; // Fixed: use consistent import path
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CartSummary from "../CartSummary";

// 🔹 Product Type
type Product = {
  id: string;
  name: string;
  price: number;
  image: any;
};

// 🔹 Product Data (same as before)
const riceProducts: Product[] = [
  { id: "1", name: "White Rice", price: 60, image: require("../Components/Images/rice.png") },
  { id: "2", name: "Basmati Rice", price: 60, image: require("../Components/Images/rice.png") },
  { id: "3", name: "Brown Rice", price: 60, image: require("../Components/Images/rice.png") },
  { id: "4", name: "Matta Rice", price: 60, image: require("../Components/Images/rice.png") },
];

const flourProducts: Product[] = [
  { id: "5", name: "Wheat Flour", price: 55, image: require("../Components/Images/flour.png") },
  { id: "6", name: "Maida", price: 50, image: require("../Components/Images/flour.png") },
  { id: "7", name: "Rice Flour", price: 70, image: require("../Components/Images/flour.png") },
];

const nutsProducts: Product[] = [
  { id: "8", name: "Almonds", price: 120, image: require("../Components/Images/nuts.png") },
  { id: "9", name: "Cashews", price: 150, image: require("../Components/Images/nuts.png") },
  { id: "10", name: "Pista", price: 130, image: require("../Components/Images/nuts.png") },
];

const spicesProducts: Product[] = [
  { id: "11", name: "Cardomom", price: 50, image: require("../Components/Images/spices.png") },
  { id: "12", name: "Elachi", price: 30, image: require("../Components/Images/spices.png") },
  { id: "13", name: "Clove", price: 45, image: require("../Components/Images/spices.png") },
];

const milletsProducts: Product[] = [
  { id: "14", name: "Karuppukavini Rice", price: 50, image: require("../Components/Images/karupukavuni.png") },
  { id: "15", name: "Kuthiraivali Rice", price: 30, image: require("../Components/Images/millets.png") },
  { id: "16", name: "Samai Rice", price: 45, image: require("../Components/Images/millets.png") },
  { id: "17", name: "Ragi Rice", price: 45, image: require("../Components/Images/millets.png") },
];

const fruitsProducts: Product[] = [
  { id: "18", name: "Apple", price: 150, image: require("../Components/Images/apple.png") },
  { id: "19", name: "Mango", price: 30, image: require("../Components/Images/fruits.png") },
  { id: "20", name: "Orange", price: 45, image: require("../Components/Images/fruits.png") },
  { id: "21", name: "Grapes", price: 45, image: require("../Components/Images/fruits.png") },
];

const vegetableProducts: Product[] = [
  { id: "22", name: "Carrot", price: 40, image: require("../Components/Images/vegetables.png") },
  { id: "23", name: "Beans", price: 80, image: require("../Components/Images/vegetables.png") },
  { id: "24", name: "Beetroot", price: 45, image: require("../Components/Images/vegetables.png") },
  { id: "25", name: "Brinjal", price: 50, image: require("../Components/Images/vegetables.png") },
];

const sugarProducts: Product[] = [
  { id: "26", name: "Cane Sugar", price: 50, image: require("../Components/Images/sugar.png") },
  { id: "27", name: "Jaggery Sugar", price: 30, image: require("../Components/Images/sugar.png") },
  { id: "28", name: "Panankarkandu", price: 45, image: require("../Components/Images/sugar.png") },
];


// 🔹 Product Card
const ProductCard = ({ item, onAddToCart, onPress }: { item: Product; onAddToCart: (item: Product) => void, onPress: () => void }) => (
  <View style={styles.card}>
    <TouchableOpacity onPress={onPress} style={{ width: '100%', alignItems: 'center' }}>
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>₹ {item.price}</Text>
      </View>
      {item.image ? (
        <Image
          source={typeof item.image === "string" ? { uri: item.image } : item.image}
          style={styles.productImage}
        />
      ) : (
        <View style={styles.noImageBox}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <Text style={styles.productName}>{item.name}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.cartButton} onPress={() => onAddToCart(item)}>
      <Text style={styles.cartButtonText}>Add To Cart</Text>
    </TouchableOpacity>
  </View>
);

export default function CategoryTabs() {
  const params = useLocalSearchParams<{ category?: string }>();
  const router = useRouter();
  const { cartItems, setCartItems } = useCart();
  const { user } = useUser();

  const categories = [
    { key: "Vegetables", data: vegetableProducts },
    { key: "Fruits", data: fruitsProducts },
    { key: "Rice", data: riceProducts },
    { key: "Flours", data: flourProducts },
    { key: "Nuts", data: nutsProducts },
    { key: "Millets", data: milletsProducts },
    { key: "Spices", data: spicesProducts},
    { key: "Sugar", data: sugarProducts}
  ];

  const [selectedCategory, setSelectedCategory] = useState("Vegetables");

  useEffect(() => {
    if (params?.category) setSelectedCategory(params.category);
  }, [params]);

  const addToCart = (item: Product) => {
    setCartItems((currentItems: any[]) => {
      const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...currentItems, { ...item, quantity: 1 }];
      }
    });
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity,
    0
  );

  const activeCategory = categories.find((cat) => cat.key === selectedCategory)?.data || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 🔹 Horizontal Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.tab,
              selectedCategory === cat.key && styles.activeTab,
            ]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === cat.key && styles.activeTabText,
              ]}
            >
              {cat.key}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 🔹 Product Grid */}
      <FlatList
        data={activeCategory}
        renderItem={({ item }) => (
          <ProductCard 
            item={item} 
            onAddToCart={addToCart} 
            onPress={() => router.push({
              pathname: "/ProductDetails",
              params: { ...item }
            })}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
      />

      {cartItems.length > 0 && (
        <CartSummary totalItems={totalItems} totalCost={Number(cartTotal)} onClearCart={clearCart} />
      )}
    </View>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: 40,
    paddingBottom: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    maxHeight: 70, // Fixed: set max height instead of negative margin
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginRight: 8,
    height: 40,
  },
  activeTab: {
    backgroundColor: "#416944",
  },
  tabText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
    position: "relative",
  },
  priceTag: {
    backgroundColor: "#416944",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 1,
  },
  priceText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  productImage: {
    width: 90,
    height: 90,
    marginBottom: 10,
    resizeMode: "contain",
  },
  noImageBox: {
    width: 90,
    height: 90,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  noImageText: { fontSize: 12, color: "#aaa" },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  cartButton: {
    backgroundColor: "#416944",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 6,
    width: "85%",
    alignItems: "center",
  },
  cartButtonText: { fontWeight: "600", color: "#fff", fontSize: 14 },
});