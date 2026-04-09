"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/firebase";
import { handleFirestoreError, OperationType } from "@/lib/firebase-error";

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  role: "user" | "admin";
  createdAt: any;
}

interface FirebaseContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const useFirebase = () => useContext(FirebaseContext);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            // Auto-upgrade to admin if email matches
            if (currentUser.email === "chm810302@gmail.com" && data.role !== "admin") {
              await setDoc(userRef, { role: "admin" }, { merge: true });
              data.role = "admin";
            }
            setProfile(data);
          } else {
            // Create new profile
            const newProfile = {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "",
              photoURL: currentUser.photoURL || "",
              role: currentUser.email === "chm810302@gmail.com" ? "admin" : "user",
              createdAt: serverTimestamp(),
            };
            await setDoc(userRef, newProfile);
            setProfile(newProfile as UserProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`, auth);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, profile, loading, signInWithGoogle, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
}
