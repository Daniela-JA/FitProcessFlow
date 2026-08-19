import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  initializeAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirestore, doc, setDoc, type Firestore } from "firebase/firestore";

import { readFirebaseConfig } from "./firebaseConfig";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function ensure(): { auth: Auth; db: Firestore } | null {
  const config = readFirebaseConfig();
  if (!config) return null;
  if (!app) {
    app = getApps()[0] ?? initializeApp(config);
    try {
      auth = initializeAuth(app);
    } catch {
      auth = getAuth(app);
    }
    db = getFirestore(app);
  }
  if (!auth || !db) return null;
  return { auth, db };
}

export function firebaseEnabled(): boolean {
  return readFirebaseConfig() !== null;
}

export async function firebaseSignUp(email: string, password: string): Promise<{ uid: string; email: string }> {
  const f = ensure();
  if (!f) throw new Error("Firebase is not configured");
  const cred = await createUserWithEmailAndPassword(f.auth, email, password);
  return { uid: cred.user.uid, email: cred.user.email ?? email };
}

export async function firebaseSignIn(email: string, password: string): Promise<{ uid: string; email: string }> {
  const f = ensure();
  if (!f) throw new Error("Firebase is not configured");
  const cred = await signInWithEmailAndPassword(f.auth, email, password);
  return { uid: cred.user.uid, email: cred.user.email ?? email };
}

export async function firebaseSignOutUser(): Promise<void> {
  const f = ensure();
  if (!f) return;
  await firebaseSignOut(f.auth);
}

export function listenFirebaseUser(cb: (user: { uid: string; email: string } | null) => void): () => void {
  const f = ensure();
  if (!f) {
    cb(null);
    return () => undefined;
  }
  return onAuthStateChanged(f.auth, (user: User | null) => {
    cb(user ? { uid: user.uid, email: user.email ?? "" } : null);
  });
}

export async function upsertWorkoutRemote(userId: string, payload: object): Promise<void> {
  const f = ensure();
  if (!f) return;
  const id = "id" in payload && typeof payload.id === "string" ? payload.id : `w_${Date.now()}`;
  await setDoc(doc(f.db, "users", userId, "workouts", id), payload, { merge: true });
}
