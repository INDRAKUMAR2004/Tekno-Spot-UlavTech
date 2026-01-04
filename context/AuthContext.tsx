import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

interface UserData {
  name?: string;
  phone?: string;
  email?: string;
  photoURL?: string | null;
}

interface AuthContextType {
  user: User | null; // 🔹 Firebase Auth user
  userData: UserData | null; // 🔹 Extra Firestore info
  loading: boolean;
  signup: (email: string, password: string, extraData?: Partial<UserData>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
} 

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserData(snap.data() as UserData);
        } else {
          setUserData({ name: firebaseUser.displayName || "", email: firebaseUser.email || "" });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, extraData: Partial<UserData> = {}) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const ref = doc(db, "users", cred.user.uid);
    const data: UserData = { email, ...extraData };
    await setDoc(ref, data);
    setUserData(data);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) throw new Error("No logged in user");
    const ref = doc(db, "users", user.uid);
    const newData = { ...userData, ...data };
    await setDoc(ref, newData, { merge: true });
    setUserData(newData);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signup, login, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
