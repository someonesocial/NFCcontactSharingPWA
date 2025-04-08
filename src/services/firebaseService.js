import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Firebase Konfiguration
const firebaseConfig = {
  apiKey: "DEINE_API_KEY",
  authDomain: "beispiel.firebaseapp.com",
  projectId: "dein-projekt-id",
  storageBucket: "beispiel.firebasestorage.app",
  messagingSenderId: "deine-sender-id",
  appId: "1:123456789:web:abcdef123456789",
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Anonyme Anmeldung für einfachen Start
export async function signInAnon() {
  try {
    // Prüfen, ob bereits angemeldet
    if (!auth.currentUser) {
      const userCredential = await signInAnonymously(auth);
      console.log("Anonyme Anmeldung erfolgreich", userCredential.user.uid);
      return userCredential.user;
    } else {
      console.log("Bereits angemeldet als", auth.currentUser.uid);
      return auth.currentUser;
    }
  } catch (error) {
    console.error("Anmeldungsfehler:", error);
    throw error;
  }
}

// Generate a random shareable URL token
function generateRandomToken(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Create a new contact in Firebase
export async function createContact(contactData) {
  try {
    await signInAnon();

    // Generate a unique sharing token
    const shareToken = generateRandomToken();
    const shareUrl = `${window.location.origin}/contact?token=${shareToken}`;

    const docRef = await addDoc(collection(db, "contacts"), {
      ...contactData,
      shareToken: shareToken,
      shareUrl: shareUrl,
      createdAt: new Date(),
    });

    return {
      id: docRef.id,
      shareToken,
      shareUrl,
    };
  } catch (error) {
    console.error("Fehler beim Erstellen des Kontakts:", error);
    throw error;
  }
}

// Get a contact by ID from Firebase
export async function getContactById(id) {
  try {
    await signInAnon();

    const docRef = doc(db, "contacts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id: docSnap.id,
      };
    } else {
      throw new Error("Kontakt nicht gefunden");
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des Kontakts:", error);
    throw error;
  }
}

// Get a contact by token from Firebase
export async function getContactByToken(token) {
  try {
    await signInAnon();

    const contactsCollection = collection(db, "contacts");
    const snapshot = await getDocs(
      query(contactsCollection, where("shareToken", "==", token))
    );

    if (snapshot.empty) {
      throw new Error("Kontakt nicht gefunden");
    }

    const docData = snapshot.docs[0].data();

    return {
      ...docData,
      id: snapshot.docs[0].id,
    };
  } catch (error) {
    console.error("Fehler beim Abrufen des Kontakts mit Token:", error);
    throw error;
  }
}

export { auth, db };
