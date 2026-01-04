import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");

export default function Index() {
  const { user: firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [animationFinished, setAnimationFinished] = useState(false);

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  // 1. Run Animation on Mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // Scale to normal size
        duration: 1200, // Slightly longer for effect
        useNativeDriver: true,
        easing: Easing.elastic(1.2), // Bouncy effect
      }),
    ]).start(() => {
        // Wait a bit more for premium feel
        setTimeout(() => setAnimationFinished(true), 500);
    });
  }, []);

  // 2. Check Navigation (Auth + Animation)
  useEffect(() => {
    if (!loading && animationFinished) {
      if (firebaseUser) {
        router.replace("/(tabs)/Home");
      } else {
        router.replace("/LoginScreen");
      }
    }
  }, [loading, animationFinished, firebaseUser]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.Image
          source={require("./Components/Images/logo.png")} // Make sure this path is correct based on LoginScreen usage
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Clean white background
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});
