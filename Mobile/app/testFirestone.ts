import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Local, Combo } from "./models";

export async function testFirestoreConnection() {
  try {
    const localesSnap = await getDocs(collection(db, "locales"));
    const combosSnap = await getDocs(collection(db, "combos"));

    const locales: Local[] = localesSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Local),
    }));

    const combos: Combo[] = combosSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Combo),
    }));

    const localesConCombos = locales.map((local) => ({
      ...local,
      combos: combos.filter((combo) => combo.localId === local.id),
    }));

    //  Mostrar en una sola línea sin saltos
    console.log("Locales con combos:", JSON.stringify(localesConCombos));

  } catch (e) {
    console.error("Error conectando con Firestore:", e);
  }
}
