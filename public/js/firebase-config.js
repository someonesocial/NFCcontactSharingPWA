// Firebase Konfiguration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getAuth,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Sichere Konfiguration - für die lokale Entwicklung werden Werte eingebettet,
// für die Produktion werden Umgebungsvariablen verwendet
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
async function signInAnon() {
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
    alert("Fehler bei der Anmeldung: " + error.message);
    throw error;
  }
}

export { app, db, auth, signInAnon };
