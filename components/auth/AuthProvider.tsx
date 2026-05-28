"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getProgress, createDefaultProgress, saveProgress } from "@/lib/firestore";
import { useProgressStore } from "@/store/progress";

function getOrCreateGuestUid(): string {
  const key = "dsa-ai-guest-uid";
  let uid = localStorage.getItem(key);
  if (!uid) {
    uid = `guest_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, uid);
  }
  return uid;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOutUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signInWithGoogle: () => {},
  signOutUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setProgress } = useProgressStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          let progress = await getProgress(firebaseUser.uid);
          if (!progress) {
            progress = createDefaultProgress(firebaseUser.uid);
            await saveProgress(firebaseUser.uid, progress);
          }
          setProgress(progress);
        } catch (err) {
          // Firestore not configured yet — still show the app
          console.warn("Firestore unavailable, using local-only progress:", err);
          setProgress(createDefaultProgress(firebaseUser.uid));
        }
      } else {
        // Guest: reuse persisted local progress or create fresh
        const { progress: localProgress } = useProgressStore.getState();
        if (!localProgress) {
          const guestUid = getOrCreateGuestUid();
          setProgress(createDefaultProgress(guestUid));
        }
      }
      setLoading(false);
    });

    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(console.error);
  };

  const signOutUser = () => {
    signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
