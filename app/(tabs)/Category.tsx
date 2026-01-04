import { useAuth } from "@/context/AuthContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";

type Category = {
  id: string;
  name: string;
  image: any;
};

const groceryCategories: Category[] = [
  { id: "1", name: "Rice", image: require("../Components/Images/rice.png") },
  { id: "2", name: "Flours", image: require("../Components/Images/flour.png") },
  { id: "3", name: "Nuts", image: require("../Components/Images/nuts.png") },
  { id: "4", name: "Spices", image: require("../Components/Images/spices.png") },
  { id: "5", name: "Millets", image: require("../Components/Images/millets.png") },
  { id: "6", name: "Sugar", image: require("../Components/Images/sugar.png") },
];

const freshCategories: Category[] = [
  { id: "7", name: "Vegetables", image: require("../Components/Images/vegetables.png") },
  { id: "8", name: "Fruits", image: require("../Components/Images/fruits.png") },
];

const sections = [
  { title: "Fresh. Fast. Delivered 24/7", data: freshCategories },
  { title: "Grocery Staples", data: groceryCategories },
];

export default function CategoryScreen() {
  const [isGrid, setIsGrid] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { userData: authUserData, user: firebaseUser, loading } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  const toggleView = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsGrid(!isGrid);
  };

  const filteredSections = search
    ? sections
        .map((section) => ({
          ...section,
          data: section.data.filter((item) => 
            item.name.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((section) => section.data.length > 0)
    : sections;

  const noResults = search && filteredSections.length === 0;

  const userName =
    authUserData?.name ||
    firebaseUser?.displayName ||
    firebaseUser?.email?.split("@")[0] ||
    "User";

  const initial = userName.charAt(0).toUpperCase();

  const renderGridItem = ({ item }: { item: Category }) => (
    <View style={styles.gridItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/componentTabs/mainComponents",
            params: { category: item.name },
          })
        }
      >
        <View>
          <Image source={item.image} style={styles.imagePlaceholder} />
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderListItem = ({ item }: { item: Category }) => (
    <View>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/componentTabs/mainComponents",
            params: { category: item.name },
          })
        }
      >
        <View style={styles.listItem}>
          <Image source={item.image} style={styles.listImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.listCategoryName}>{item.name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#416944" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/Home")}>
          <Ionicons name="arrow-back" size={24} color="#2E3B2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <TouchableOpacity onPress={() => router.push("/Profile")}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>{initial}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar + Toggle */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#416944" />
          <TextInput
            placeholder="Search our products..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity onPress={toggleView} style={styles.toggleBtn}>
          {isGrid ? (
            <MaterialIcons name="list" size={22} color="#416944" />
          ) : (
            <Ionicons name="grid" size={22} color="#416944" />
          )}
        </TouchableOpacity>
      </View>

      {/* Categories Section */}
      {noResults ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No items found</Text>
        </View>
      ) : (
        <SectionList
          sections={filteredSections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section: { title, data } }) => (
            <View>
              <Text style={styles.sectionHeader}>{title}</Text>
              {isGrid && (
       <FlatList
          data={data}
          keyExtractor={(it) => it.id}
          numColumns={2}
          renderItem={renderGridItem}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }}
      />
              )}
            </View>
          )}
          renderItem={({ item }) => (!isGrid ? renderListItem({ item }) : null)}
          contentContainerStyle={{ paddingBottom: 110 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAF6", // Consistent background
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    // Premium soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    zIndex: 100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E3B2E", // Dark text for white header
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8EFE6", // Soft green bg
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: { color: "#416944", fontWeight: "bold", fontSize: 16 },

  // Search bar section
  searchRow: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    // Floating effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    color: "#2D2D2D",
    fontSize: 15,
  },
  toggleBtn: {
    marginLeft: 15,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  // Grid view
  gridItem: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    padding: 15,
    // Soft card shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F8FAF6",
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E3B2E",
    textAlign: "center",
  },

  // List view
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 16,
    marginVertical: 6,
    // List shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#F8FAF6",
  },
  listCategoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3B2E",
  },

  // Section header
  sectionHeader: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
    color: "#1a1a1a", // Clean distinct header
  },

  // Empty view
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "gray",
    marginTop: 10,
  },
});