import { initNFC } from "./nfc.js";
import { setupAuth } from "./auth.js";
import { signInAnon, auth } from "./firebase-config.js";
import { createContact } from "./contacts.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((reg) => console.log("Service Worker registriert", reg))
    .catch((err) =>
      console.error("Service Worker Registrierung fehlgeschlagen", err)
    );
}

document.addEventListener("DOMContentLoaded", async () => {
  setupAuth();
  const nfcHandler = initNFC();

  // Anonym anmelden
  await signInAnon();

  // Login-Status anzeigen
  auth.onAuthStateChanged((user) => {
    const loginStatus = document.getElementById("login-status");
    if (loginStatus) {
      if (user) {
        loginStatus.innerHTML =
          "Sie sind angemeldet und können Kontakte erstellen.";
      } else {
        loginStatus.innerHTML =
          "Nicht angemeldet. Einige Funktionen könnten eingeschränkt sein.";
      }
      console.log(
        "Auth state changed:",
        user ? "angemeldet" : "nicht angemeldet"
      );
    }
  });

  // Formular-Handler für Kontakterstellung
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const contactData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        company: document.getElementById("company").value,
        position: document.getElementById("position").value,
      };

      try {
        const contactId = await createContact(contactData);
        showContactSuccess(contactId);
      } catch (error) {
        alert("Fehler beim Erstellen des Kontakts: " + error.message);
      }
    });
  }

  // Neuen Kontakt erstellen Button
  const createNewButton = document.getElementById("create-new");
  if (createNewButton) {
    createNewButton.addEventListener("click", () => {
      document.getElementById("create-contact-form").style.display = "block";
      document.getElementById("contact-success").style.display = "none";
      document.getElementById("contact-form").reset();
    });
  }
});

// Nach erfolgreicher Kontakterstellung
function showContactSuccess(contactId) {
  const contactUrl = `${window.location.origin}/contact.html?id=${contactId}`;

  document.getElementById("create-contact-form").style.display = "none";
  document.getElementById("contact-success").style.display = "block";

  const contactUrlElement = document.getElementById("contact-url");
  contactUrlElement.href = contactUrl;
  contactUrlElement.textContent = contactUrl;
}

// Diese Funktion entfernen, da sie in nfc.js bereits existiert
// writeUrlToNFC wird über nfcHandler bereitgestellt
