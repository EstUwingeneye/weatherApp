import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { auth, db } from "../lib/firebase";
import type { UserProfile } from "../types";
import { AuthContext, type LoginInput, type RegisterInput } from "./authContextCore";
const googleProvider = new GoogleAuthProvider();

async function saveUserProfile(user: User, provider: UserProfile["provider"], name?: string) {
  const ref = doc(db, "users", user.uid);
  const existing = await getDoc(ref);
  const displayName = name || user.displayName || user.email?.split("@")[0] || "Weatherly User";
  const email = user.email || "";

  await setDoc(
    ref,
    {
      uid: user.uid,
      name: displayName,
      email,
      provider,
      updatedAt: serverTimestamp(),
      ...(!existing.exists() ? { createdAt: serverTimestamp() } : {}),
    },
    { merge: true }
  );
}

async function readUserProfile(user: User): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", user.uid));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    uid: user.uid,
    name: String(data.name ?? user.displayName ?? "Weatherly User"),
    email: String(data.email ?? user.email ?? ""),
    provider: data.provider === "google" ? "google" : "password",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setProfile(user ? await readUserProfile(user) : null);
      setLoading(false);
    });
  }, []);

  async function register({ name, email, password }: RegisterInput) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await saveUserProfile(credential.user, "password", name);
    setProfile(await readUserProfile(credential.user));
  }

  async function login({ email, password }: LoginInput) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    setProfile(await readUserProfile(credential.user));
  }

  async function loginWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider);
    await saveUserProfile(credential.user, "google");
    setProfile(await readUserProfile(credential.user));
  }

  const value = useMemo(
    () => ({
      currentUser,
      profile,
      loading,
      register,
      login,
      loginWithGoogle,
      logout: () => signOut(auth),
    }),
    [currentUser, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
