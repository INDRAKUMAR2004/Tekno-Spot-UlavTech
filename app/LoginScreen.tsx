
import { Ionicons } from "@expo/vector-icons";
// import {
//     GoogleSignin,
//     statusCodes,
// } from '@react-native-google-signin/google-signin';
import { LinearGradient } from "expo-linear-gradient";
import { router, useRouter } from "expo-router";
import { AuthCredential, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

// Define a premium color palette
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
  googleButton: "#ffffff",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // GoogleSignin.configure({
        // webClientId: '<FROM DEVELOPER CONSOLE>', // client ID of type WEB for your server (needed to verify user ID and offline access)
    // });
  }, []);

  // async function onGoogleButtonPress() {
  //   try {
  //       // await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  //       // const signInResult = await GoogleSignin.signIn();
        
  //       // let idToken = signInResult.data?.idToken;
  //       // // Handle cases where idToken might be nested differently based on version
  //       // if (!idToken && (signInResult as any).idToken) {
  //       //     idToken = (signInResult as any).idToken;
  //       // }

  //       // if (!idToken) {
  //       //     throw new Error('No ID token found');
  //       // }
      
  //       const googleCredential = GoogleAuthProvider.credential(idToken);
  //       const userCredential = await signInWithCredential(auth,
  //         // googleCredential
  //         );
  //       // const user = userCredential.user;

  //        // Log successful login
  //       await addDoc(collection(db, "loginAttempts"), {
  //           // uid: user.uid,
  //           // email: user.email,
  //           timestamp: serverTimestamp(),
  //           method: 'google',
  //           success: true,
  //       });

  //       router.replace("/(tabs)/Home");
  //   } catch (error: any) {
  //       // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //           // user cancelled the login flow
  //           // console.log('User cancelled Google Sign-In');
  //       // } else if (error.code === statusCodes.IN_PROGRESS) {
  //           // operation (e.g. sign in) is in progress already
  //           //  console.log('Google Sign-In in progress');
  //       // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //           // play services not available or outdated
  //           //  console.log('Play Services not available');
  //           //  setPasswordError('Google Play Services needed for Google Sign-In');
  //       // } else {
  //           // some other error happened
  //           // console.error(error);
  //           // setPasswordError('Google Sign-In failed');
  //       // }
  //   }
  // }

  const validateEmail = (email: string) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    // setEmailError("");
    // setPasswordError("");
    // let valid = true;

    // if (!email) {
    //   setEmailError("Email is required");
    //   valid = false;
    // } else if (!validateEmail(email)) {
    //   setEmailError("Invalid email format");
    //   valid = false;
    // }

    // if (!password) {
    //   setPasswordError("Password is required");
    //   valid = false;
    // } else if (password.length < 6) {
    //   setPasswordError("Password must be at least 6 characters");
    //   valid = false;
    // }

    // if (!valid) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        await addDoc(collection(db, "loginAttempts"), {
            uid: user.uid,
            email: user.email,
            timestamp: serverTimestamp(),
            success: true,
        });
      } catch (loggingError) {
          console.log("Failed to log login attempt:", loggingError);
      }

      router.replace("/(tabs)/Home");
    } catch (err: any) {
      let errorMessage = "Login failed. Please try again.";
      const code: string = err?.code ?? "";
      if (code === "auth/user-not-found" || code === "auth/invalid-login-credentials") errorMessage = "Invalid email or password.";
      else if (code === "auth/wrong-password") errorMessage = "Incorrect password.";
      else if (code === "auth/invalid-email") errorMessage = "Invalid email address.";
      else if (code === "auth/too-many-requests") errorMessage = "Too many attempts. Please try later.";
      else errorMessage = err.message || "Login failed."; // Fallback to raw message for debugging

      try {
        await addDoc(collection(db, "loginAttempts"), {
          email,
          timestamp: serverTimestamp(),
          success: false,
          error: errorMessage,
        });
      } catch (firestoreErr) {
        console.log("Firestore logging error:", firestoreErr);
      }
      // setPasswordError(errorMessage);
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={[styles.inputContainer, emailError ? styles.inputError : null]}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Email Address"
                  placeholderTextColor={COLORS.textSecondary}
                  style={styles.input}
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
                  placeholder="Password"
                  placeholderTextColor={COLORS.textSecondary}
                  style={styles.input}
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

              {/* Login Button */}
              <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
                <LinearGradient
                  colors={[COLORS.primaryLight, COLORS.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>LOGIN</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Google Sign-In Button */}
              <TouchableOpacity 
              // onPress={onGoogleButtonPress} 
              activeOpacity={0.8} style={styles.googleButton}>
                <View style={styles.googleButtonContent}>
                    <Image 
                      source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }} 
                      style={styles.googleIcon} 
                    />
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </View>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.footerLink}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/SignUpScreen")}>
                  <Text style={styles.linkText}>Sign Up</Text>
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
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: "white",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
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
});
