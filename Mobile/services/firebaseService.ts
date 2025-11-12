import { db } from '../config/firebaseConfig'; // Ajusta la ruta a tu config
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { Local, Combo } from '../app/models'; // Ajusta la ruta a tus modelos

// ---
// === SERVICIOS DE LOCALES (Para el Admin) ===
// ---

/**
 * Crea un nuevo Local en la colección 'locales'
 * (Usado en app/locales/crear-local.tsx)
 */
export const createLocal = async (local: Omit<Local, 'id'>) => {
  try {
    // Filtra las URLs de imágenes vacías antes de guardar
    const data = {
      ...local,
      images: local.images?.filter(img => img && img.trim() !== '') || []
    };
    const docRef = await addDoc(collection(db, 'locales'), data);
    console.log("Local creado con ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error al añadir local: ", e);
    throw e;
  }
};

/**
 * Obtiene todos los Locales de la base de datos
 * (Usado en app/locales/index.tsx)
 */
export const getLocales = async (): Promise<Local[]> => {
  const querySnapshot = await getDocs(collection(db, 'locales'));
  const locales: Local[] = [];
  querySnapshot.forEach((doc) => {
    locales.push({ id: doc.id, ...doc.data() } as Local);
  });
  return locales;
};

// ---
// === SERVICIOS DE COMBOS (Para el Admin y Público) ===
// ---

/**
 * Crea un nuevo Combo en la colección 'combos'
 * (Usado en app/locales/crear-combo.tsx)
 */
export const createCombo = async (combo: Omit<Combo, 'id'>) => {
  try {
    // Aquí podrías validar que combo.localId existe
    const docRef = await addDoc(collection(db, 'combos'), combo);
    console.log("Combo creado con ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error al añadir combo: ", e);
    throw e;
  }
};

/**
 * Obtiene todos los Combos de un Local específico
 * (Usado en la nueva pantalla app/locales/[id].tsx)
 */
export const getCombosByLocalId = async (localId: string): Promise<Combo[]> => {
  const q = query(collection(db, 'combos'), where('localId', '==', localId));
  const querySnapshot = await getDocs(q);
  const combos: Combo[] = [];
  querySnapshot.forEach((doc) => {
    combos.push({ id: doc.id, ...doc.data() } as Combo);
  });
  return combos;
};

// ---
// === SERVICIOS PÚBLICOS (Para la App de Clientes) ===
// ---

/**
 * Obtiene TODOS los Combos (para la home pública)
 * (Usado en app/(tabs)/index.tsx)
 */
export const getCombos = async (): Promise<Combo[]> => {
  const querySnapshot = await getDocs(collection(db, 'combos'));
  const combos: Combo[] = [];
  querySnapshot.forEach((doc) => {
    combos.push({ id: doc.id, ...doc.data() } as Combo);
  });
  return combos;
};

/**
 * Obtiene un Combo específico por su ID
 * (Usado en app/product/[id].tsx)
 */
export const getComboById = async (id: string): Promise<Combo | null> => {
  const docRef = doc(db, 'combos', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Combo;
  } else {
    console.warn("No se encontró el combo con id: ", id);
    return null;
  }
};

/**
 * Obtiene un Local específico por su ID
 * (Usado en app/product/[id].tsx)
 */
export const getLocalById = async (id: string): Promise<Local | null> => {
  const docRef = doc(db, 'locales', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Local;
  } else {
    console.warn("No se encontró el local con id: ", id);
    return null;
  }
};

// ---  NUEVA FUNCIÓN ---
/**
 * Actualiza un Local específico en la base de datos
 * (La usaremos para 'destacar' un combo)
 */
export const updateLocal = async (id: string, data: Partial<Local>) => {
  // 'Partial<Local>' significa que le podemos pasar solo
  // algunas propiedades de Local, no todas (ej: solo 'featuredComboId')
  const docRef = doc(db, 'locales', id);
  try {
    await updateDoc(docRef, data);
    console.log("Local actualizado con éxito");
  } catch (e) {
    console.error("Error al actualizar local: ", e);
    throw e;
  }
};
// --- FIN DE LA NUEVA FUNCIÓN ---