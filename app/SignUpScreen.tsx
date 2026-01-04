import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebaseConfig";

// Define a premium color palette (Matching LoginScreen)
const COLORS = {
  primary: "#2E7D32", // Deep Green
  primaryLight: "#4CAF50", // Lighter Green
  backgroundStart: "#f0f4f8", // Very light grey/blue
  backgroundEnd: "#ffffff", // White
  textPrimary: "#1a1a1a",
  textSecondary: "#666666",
  inputUser: "#f5f5f5",
  borderColor: "#e0e0e0",
  error: "#FF3B30",
  shadow: "#000",
};

export default function SignUpScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  // Validation error states
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
        // webClientId: '<FROM DEVELOPER CONSOLE>', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
  }, []);

  // async function onGoogleButtonPress() {
  //   try {
  //       await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  //       const signInResult = await GoogleSignin.signIn();
        
  //       let idToken = signInResult.data?.idToken;
  //       // Handle cases where idToken might be nested differently based on version
  //       if (!idToken && (signInResult as any).idToken) {
  //           idToken = (signInResult as any).idToken;
  //       }

  //       if (!idToken) {
  //           throw new Error('No ID token found');
  //       }
      
  //       const googleCredential = GoogleAuthProvider.credential(idToken);
  //       const userCredential = await signInWithCredential(auth, googleCredential);
  //       const user = userCredential.user;

  //       // Check if user document exists, if not create it
  //       const userDocRef = doc(db, "users", user.uid);
  //       const userDoc = await getDoc(userDocRef);

  //       if (!userDoc.exists()) {
  //           await setDoc(userDocRef, {
  //               uid: user.uid,
  //               name: user.displayName || name || "Google User",
  //               email: user.email,
  //               phone: user.phoneNumber || phone || "", // Google might not return phone
  //               createdAt: serverTimestamp(),
  //               authProvider: 'google'
  //           });
  //       }

  //       router.replace("/(tabs)/Home");
  //   } catch (error: any) {
  //       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //           console.log('User cancelled Google Sign-Up');
  //       } else if (error.code === statusCodes.IN_PROGRESS) {
  //            console.log('Google Sign-Up in progress');
  //       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //            setPasswordError('Google Play Services needed for Google Sign-Up');
  //       } else {
  //           console.error(error);
  //           setPasswordError('Google Sign-Up failed');
  //       }
  //   }
  // }

  const validateEmail = (email: string) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    const regex = /^[0-9]{10}$/; 
    return regex.test(phone);
  };

  const submit = async () => {
    // Reset errors
    setNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");

    let valid = true;

    if (!name) {
      setNameError("Full name is required");
      valid = false;
    }

    if (!phone) {
      setPhoneError("Phone number is required");
      valid = false;
    } else if (!validatePhone(phone)) {
      setPhoneError("Phone number must be 10 digits");
      valid = false;
    }

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    if (!confirm) {
      setConfirmError("Confirm password is required");
      valid = false;
    } else if (password !== confirm) {
      setConfirmError("Passwords do not match");
      valid = false;
    }

    if (!valid) return; // stop if validation fails

    try {
      setLoading(true);
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        phone,
        email,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      router.push("/LoginScreen");
    } catch (err: any) {
      setLoading(false);
      // Handle Firebase errors
      if (err.code === "auth/email-already-in-use") {
        setEmailError("Email is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setEmailError("Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        setPasswordError("Password is too weak.");
      } else {
        setPasswordError(err.message || "Signup failed. Please try again.");
      }
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.backgroundStart, COLORS.backgroundEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("./Components/Images/logo.png")}
                  style={styles.logo}
                />
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Full Name Input */}
              <View style={[styles.inputContainer, nameError ? styles.inputError : null]}>
                <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={COLORS.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
              </View>
              {nameError ? (
                  <View style={styles.errorContainer}>
                     <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                     <Text style={styles.errorText}> {nameError}</Text>
                  </View>
                ) : null}

              {/* Phone Number Input */}
              <View style={[styles.inputContainer, phoneError ? styles.inputError : null]}>
                <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor={COLORS.textSecondary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
              {phoneError ? (
                  <View style={styles.errorContainer}>
                     <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                     <Text style={styles.errorText}> {phoneError}</Text>
                  </View>
                ) : null}

              {/* Email Input */}
              <View style={[styles.inputContainer, emailError ? styles.inputError : null]}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {emailError ? (
                  <View style={styles.errorContainer}>
                     <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                     <Text style={styles.errorText}> {emailError}</Text>
                  </View>
                ) : null}

              {/* Password Input */}
              <View style={[styles.inputContainer, passwordError ? styles.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                 <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Ionicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                  <View style={styles.errorContainer}>
                     <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                     <Text style={styles.errorText}> {passwordError}</Text>
                  </View>
                ) : null}

              {/* Confirm Password Input */}
              <View style={[styles.inputContainer, confirmError ? styles.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={COLORS.textSecondary}
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry={!isConfirmVisible}
                />
                 <TouchableOpacity onPress={() => setIsConfirmVisible(!isConfirmVisible)}>
                  <Ionicons
                    name={isConfirmVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {confirmError ? (
                  <View style={styles.errorContainer}>
                     <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                     <Text style={styles.errorText}> {confirmError}</Text>
                  </View>
                ) : null}

              {/* Sign Up Button */}
              <TouchableOpacity onPress={submit} disabled={loading} activeOpacity={0.8}>
                <LinearGradient
                  colors={[COLORS.primaryLight, COLORS.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>{loading ? "Signing up..." : "Sign Up"}</Text>
                </LinearGradient>
              </TouchableOpacity>


              {/* Google Sign-Up Button */}
              <TouchableOpacity 
              // onPress={onGoogleButtonPress} 
              activeOpacity={0.8} style={styles.googleButton}>
                <View style={styles.googleButtonContent}>
                    <Image 
                      source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }} 
                      style={styles.googleIcon} 
                    />
                    <Text style={styles.googleButtonText}>Sign up with Google</Text>
                </View>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.footerLink}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/LoginScreen")}>
                  <Text style={styles.linkText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30, // Slightly less margin than login to fit more fields
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: "white",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 4,
    marginTop: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "500",
  },
  button: {
    marginTop: 32,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footerLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  linkText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  googleButton: {
    backgroundColor: "white",
    marginTop: 16,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  googleButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  googleIcon: {
      width: 24,
      height: 24,
      marginRight: 12,
  },
  googleButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
