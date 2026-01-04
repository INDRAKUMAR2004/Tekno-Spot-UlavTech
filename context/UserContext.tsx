import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";

// Types
export type Address = {
  id: string;
  label: string;
  details: string;
};

export type User = {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  selectedAddress?: Address;
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean; // Add loading state
};

// Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUser(userSnap.data() as User);
          } else {
            // Create a new user object for first-time users
            const newUser: User = {
              name: firebaseUser.displayName || "",
              email: firebaseUser.email || "",
              phone: firebaseUser.phoneNumber || "",
              addresses: [],
            };
            setUser(newUser);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false); // Set loading to false after auth check
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};

export default UserContext;