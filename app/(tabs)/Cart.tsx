import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useCart } from "../../context/CartContext";

const { width } = Dimensions.get("window");

export default function CartScreen() {
  const { cartItems, updateQty, removeFromCart } = useCart();
  const router = useRouter();
  const { user } = useUser();
  const { userData: authUserData, user: firebaseUser } = useAuth();
  
  const userName =
    authUserData?.name ||
    firebaseUser?.displayName ||
    firebaseUser?.email?.split("@")[0] ||
    "User";

  const initial = userName.charAt(0).toUpperCase();

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItemCard}>
      <View style={styles.imageContainer}>
        {item.image ? (
            <Image 
                source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                style={styles.itemImage} 
            />
        ) : (
             <View style={[styles.itemImage, styles.placeholderImage]}>
                <Ionicons name="image-outline" size={24} color="#ccc" />
             </View>
        )}
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
             <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
             <TouchableOpacity onPress={() => removeFromCart(item.id)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
             </TouchableOpacity>
        </View>
        
        <Text style={styles.itemPrice}>₹ {item.price}</Text>

        <View style={styles.actionRow}>
            <View style={styles.quantityContainer}>
                <TouchableOpacity
                onPress={() => updateQty(item.id, -1)}
                style={styles.qtyBtn}
                >
                <Ionicons name="remove" size={18} color="#416944" />
                </TouchableOpacity>

                <Text style={styles.qtyCount}>{item.quantity}</Text>

                <TouchableOpacity
                onPress={() => updateQty(item.id, +1)}
                style={styles.qtyBtn}
                >
                <Ionicons name="add" size={18} color="#416944" />
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7F5" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
            onPress={() => router.push("/(tabs)/Home")}
            style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={() => router.push("/Profile")}>
            <View style={styles.profileCircle}>
                 <Text style={styles.profileText}>{initial}</Text>
            </View>
        </TouchableOpacity>
      </View>

      {/* Cart Content */}
      <View style={styles.contentContainer}>
        {cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
                <Ionicons name="cart-outline" size={80} color="#416944" />
            </View>
            <Text style={styles.emptyTitle}>Your Cart is Empty!</Text>
            <Text style={styles.emptySubtitle}>
                Looks like you haven't added anything to your cart yet.
            </Text>
            <TouchableOpacity 
                style={styles.shopNowBtn}
                onPress={() => router.push("/(tabs)/Home")}
            >
                <Text style={styles.shopNowText}>Start Shopping</Text>
            </TouchableOpacity>
            </View>
        ) : (
            <>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={renderCartItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.billSummary}>
                        <Text style={styles.summaryTitle}>Bill Details</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Item Total</Text>
                            <Text style={styles.summaryValue}>₹ {total}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Delivery Fee</Text>
                            <Text style={styles.summaryValueGreen}>Free</Text>
                        </View>
                         <View style={styles.divider} />
                         <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Grand Total</Text>
                            <Text style={styles.totalValue}>₹ {total}</Text>
                        </View>
                    </View>
                }
            />

            {/* Checkout Footer */}
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.footerTotalLabel}>Total</Text>
                    <Text style={styles.footerTotalPrice}>₹ {total}</Text>
                </View>
                <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => router.push("../PaymentScreen")}
                >
                <Text style={styles.checkoutText}>Proceed to Buy</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={{marginLeft: 8}}/>
                </TouchableOpacity>
            </View>
            </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    backgroundColor: "#F5F7F5",
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2}
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#416944",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
     shadowColor: "#416944",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4
  },
  profileText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F5F7F5",
  },
  listContent: {
    padding: 20,
    paddingBottom: 120,
  },
  cartItemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  placeholderImage: {
      justifyContent: 'center',
      alignItems: 'center'
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
    paddingVertical: 4
  },
  itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
  },
  itemName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#1A1A1A",
    flex: 1,
    marginRight: 8
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#416944",
    marginVertical: 4
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#F5F7F5',
    borderRadius: 12,
    padding: 4
  },
  qtyBtn: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyCount: {
    fontWeight: "600",
    color: "#1A1A1A",
    fontSize: 16,
    marginHorizontal: 12
  },
  billSummary: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  summaryTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1A1A1A',
      marginBottom: 16
  },
  summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
  },
  summaryLabel: {
      fontSize: 15,
      color: '#666',
  },
  summaryValue: {
      fontSize: 15,
      fontWeight: '600',
      color: '#1A1A1A'
  },
  summaryValueGreen: {
    fontSize: 15,
    fontWeight: '600',
    color: '#416944'
  },
  divider: {
      height: 1,
      backgroundColor: '#F0F0F0',
      marginVertical: 12,
  },
  totalLabel: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1A1A1A'
  },
  totalValue: {
      fontSize: 20,
      fontWeight: '700',
      color: '#416944'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -5 },
    elevation: 20,
  },
  totalContainer: {
      justifyContent: 'center'
  },
  footerTotalLabel: {
      fontSize: 14,
      color: '#666',
  },
  footerTotalPrice: {
      fontSize: 22,
      fontWeight: '700',
      color: '#1A1A1A'
  },
  checkoutBtn: {
    backgroundColor: "#416944",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: "center",
    shadowColor: "#416944",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 8
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 50
  },
  iconCircle: {
      width: 120,
      height: 120,
      backgroundColor: '#E8F5E9',
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24
  },
  emptyTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: '#1A1A1A',
      marginBottom: 12
  },
  emptySubtitle: {
      fontSize: 16,
      color: '#888',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32
  },
  shopNowBtn: {
      backgroundColor: '#416944',
      paddingVertical: 16,
      paddingHorizontal: 40,
      borderRadius: 30,
      shadowColor: "#416944",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 8
  },
  shopNowText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700'
  }
});
