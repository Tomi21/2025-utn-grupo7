import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { User } from "../app/models";

// === 🔹 Crear usuario (Registro) ===
export async function registerUser(userData: Omit<User, "id">, password: string): Promise<User> {
  const { email, username, nombre, apellido, role = "user" } = userData;

  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Crear documento en Firestore
    const userRef = doc(db, "user", firebaseUser.uid); // singular si tu colección es "user"
    const userDoc: User = {
      id: firebaseUser.uid,
      username,
      nombre,
      apellido,
      email,
      role,
    };

    await setDoc(userRef, userDoc);
    console.log("Documento creado en Firestore:", userDoc);
    return userDoc;

  } catch (error: any) {
    console.error("Error completo en registerUser:", error);
    // Lanzamos el error para que quien llame a la función pueda manejarlo
    throw error;
  }
}

// === 🔹 Login de usuario ===
export async function loginUser(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Traer info adicional desde Firestore
  const userRef = doc(db, "user", firebaseUser.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    throw new Error("No se encontró el perfil del usuario.");
  }

  return snapshot.data() as User;
}

// === 🔹 Logout ===
export async function logoutUser() {
  await signOut(auth);
}

// === 🔹 Verificar sesión activa ===
export function listenToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userRef = doc(db, "users", firebaseUser.uid);
      const snapshot = await getDoc(userRef);
      const userData = snapshot.exists() ? (snapshot.data() as User) : null;
      callback(userData);
    } else {
      callback(null);
    }
  });
}

// === 🔹 Verificar autorización (por rol) ===
export async function authorizeUser(uid: string, requiredRole: "admin" | "user"): Promise<boolean> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return false;
  const user = snapshot.data() as User;

  if (requiredRole === "admin" && user.role !== "admin") {
    return false;
  }

  return true;
}

export async function getLoggedUser(): Promise<User | null> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  const userRef = doc(db, "user", firebaseUser.uid); // revisa que tu colección sea "user"
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  return snapshot.data() as User;
}
