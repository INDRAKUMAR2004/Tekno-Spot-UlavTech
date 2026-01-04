// Banner.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const BANNERS = [
  {
    id: "1",
    source: require("../assets/images/banner_veg.jpg"), // Local Asset
    title: "Farm Fresh\nVegetables",
    subtitle: "Organic & Pesticide Free",
    offer: "Min 30% Off",
  },
  {
    id: "2",
    source: { uri: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=2070&auto=format&fit=crop" }, // Fruits
    title: "Juicy Seasonal\nFruits",
    subtitle: "Sweetness of Nature",
    offer: "Fresh Arrival",
  },
  {
    id: "3",
    source: { uri: "https://images.unsplash.com/photo-1664389686375-7b640cb97241?q=80&w=2070&auto=format&fit=crop" }, // Millets/Grains
    title: "Healthy\nMillets",
    subtitle: "Superfood for Super You",
    offer: "Buy 1 Get 1",
  },
  {
    id: "4",
    source: { uri: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop" }, // Rice
    title: "Premium\nRice Varieties",
    subtitle: "Aromatic & Authentic",
    offer: "Best Price",
  },
];

export default function Banner() {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  // 🔹 Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % BANNERS.length;
      setIndex(nextIndex);

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 4000); 

    return () => clearInterval(interval);
  }, [index]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <ImageBackground
              source={item.source}
              style={styles.image}
              imageStyle={{ borderRadius: 20 }}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
                style={styles.gradient}
              >
                <View style={styles.textContainer}>
                    <View style={styles.offerBadge}>
                        <Text style={styles.offerText}>{item.offer}</Text>
                    </View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                    
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        )}
        onScroll={(e) => {
             const scrollIndex = Math.round(e.nativeEvent.contentOffset.x / width);
             if (scrollIndex !== index) {
                 setIndex(scrollIndex);
             }
        }}
      />
      
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              index === i ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    height: 240, 
    marginVertical: 10,
  },
  imageWrapper: {
    width: width,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.92,
    height: "100%",
    justifyContent: "flex-end", 
    // Shadows
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",  
    paddingHorizontal: 20,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  offerBadge: {
    backgroundColor: "#FFD700", // Gold
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  offerText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#e0e0e0",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: "#416944", // Brand Green
    fontWeight: "bold",
    fontSize: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#416944', 
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#C4C4C4',
  },
});
