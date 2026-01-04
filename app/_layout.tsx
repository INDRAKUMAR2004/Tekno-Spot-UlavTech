// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { UserProvider } from "../context/UserContext";
import { StatusBar } from "expo-status-bar";


export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  );
}