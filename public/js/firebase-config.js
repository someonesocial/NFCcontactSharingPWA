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
  // WICHTIG: Ersetze diese Werte mit deinen eigenen, indem du eine .env Datei erstellst
  // und folge den Anweisungen in der README.md
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Anonyme Anmeldung für einfachen Start
async function signInAnon() {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error("Anmeldungsfehler:", error);
  }
}

export { app, db, auth, signInAnon };
