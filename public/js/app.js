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
    if (user) {
      loginStatus.innerHTML =
        "Sie sind angemeldet und können Kontakte erstellen.";
    } else {
      loginStatus.innerHTML =
        "Nicht angemeldet. Einige Funktionen könnten eingeschränkt sein.";
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

// NFC URL Schreiben
async function writeUrlToNFC(url) {
  if (!("NDEFReader" in window)) {
    alert(
      "Web NFC wird von diesem Browser nicht unterstützt. Verwenden Sie Chrome für Android."
    );
    return;
  }

  try {
    const overlay = document.getElementById("overlay");
    const overlayMessage = document.getElementById("overlayMessage");

    overlay.style.display = "flex";
    overlayMessage.textContent = "Bitte halten Sie das NFC-Tag an Ihr Gerät";

    const ndef = new NDEFReader();
    await ndef.write({
      records: [{ recordType: "url", data: url }],
    });

    overlayMessage.textContent = "URL erfolgreich auf NFC-Tag geschrieben!";

    setTimeout(() => {
      overlay.style.display = "none";
    }, 2000);
  } catch (error) {
    console.error("Fehler beim Schreiben auf das NFC-Tag:", error);
    alert("Fehler beim Schreiben auf das NFC-Tag: " + error.message);
    document.getElementById("overlay").style.display = "none";
  }
}
