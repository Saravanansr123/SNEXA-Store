import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type AdminUser = {
  uid: string;
  name: string;
  email: string;
};

interface AuthContextType {
  user: User | null;
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>; // ✅ ADD
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const adminRef = doc(db, "admins", firebaseUser.uid);
        const snap = await getDoc(adminRef);

        if (snap.exists()) {
          setAdmin({
            uid: firebaseUser.uid,
            name: snap.data().name,
            email: snap.data().email,
          });
        } else {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }

      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // ✅ PASSWORD RESET
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{ user, admin, loading, login, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}
