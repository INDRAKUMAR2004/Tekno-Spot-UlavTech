import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#416944",
        tabBarInactiveTintColor: "#999",

        // 👇 CRITICAL PART
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              active="home"
              inactive="home-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Category"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              active="grid"
              inactive="grid-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Cart"
        options={{
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              active="cart"
              inactive="cart-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Order"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              active="document-text"
              inactive="document-text-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}

/* 🔹 Icon wrapper */
function TabIcon({
  focused,
  color,
  active,
  inactive,
}: {
  focused: boolean;
  color: string;
  active: any;
  inactive: any;
}) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconActive]}>
      <Ionicons
        name={focused ? active : inactive}
        size={24}
        color={focused ? "#fff" : color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  /* This controls spacing & position */
  tabBar: {
    backgroundColor: "transparent", // IMPORTANT
    borderTopWidth: 0,
    elevation: 0,
    paddingBottom: 20,
    paddingTop: 10,
  },

  /* This is the floating rounded bar */
  tabBarBackground: {
    position: "absolute",
    left: 1,
    right: 1,
    bottom: 2,
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 24,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },

  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  iconActive: {
    backgroundColor: "#416944",
  },
});
