// config.js - Lädt Konfiguration aus .env oder verwendet Fallback-Werte
export const config = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || "PLACEHOLDER_API_KEY",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "example.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "example-project",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "example.appspot.com",
    messagingSenderId:
      process.env.FIREBASE_MESSAGING_SENDER_ID || "000000000000",
    appId: process.env.FIREBASE_APP_ID || "1:000000000000:web:0000000000000000",
  },
};
