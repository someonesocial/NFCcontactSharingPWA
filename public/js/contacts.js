import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Neuen Kontakt erstellen
export async function createContact(contactData) {
  try {
    const docRef = await addDoc(collection(db, "contacts"), {
      ...contactData,
      createdAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Fehler beim Erstellen des Kontakts:", error);
    throw error;
  }
}

// Kontakt anhand der ID abrufen
export async function getContactById(id) {
  try {
    const docRef = doc(db, "contacts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Kontakt nicht gefunden");
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des Kontakts:", error);
    throw error;
  }
}
