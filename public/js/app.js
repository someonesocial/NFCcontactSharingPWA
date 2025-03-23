import { initNFC } from "./nfc.js";
import { setupAuth } from "./auth.js";
import { signInAnon, auth } from "./firebase-config.js";
import { createContact } from "./contacts.js";
import {
  saveContactToLocalStorage,
  getContactsFromLocalStorage,
  displayContacts,
} from "./local-storage.js";

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((reg) => console.log("Service Worker registriert", reg))
    .catch((err) =>
      console.error("Service Worker Registrierung fehlgeschlagen", err)
    );
}

// Update time in status bar
function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;

  document.getElementById("current-time").textContent = `${hours}:${minutes}`;
}

// Show selected view
window.showView = function (viewId) {
  // Hide all views
  document
    .querySelectorAll(
      ".scan-view, .contact-details, .contacts-list, .add-contact, .write-to-chip"
    )
    .forEach((view) => {
      view.classList.remove("active");
    });

  // Show the selected view
  document.getElementById(viewId).classList.add("active");

  // If we're showing the contacts list, refresh the displayed contacts
  if (viewId === "contactsList") {
    displayContacts();
  }
};

// Main initialization
document.addEventListener("DOMContentLoaded", async () => {
  // Update time every minute
  updateTime();
  setInterval(updateTime, 60000);

  // Initialize NFC
  const nfcHandler = initNFC();

  // Setup auth
  setupAuth();

  try {
    // Anonymously sign in
    await signInAnon();
  } catch (error) {
    console.error("Authentication error:", error);
  }

  // Start NFC scan button
  const startScanButton = document.getElementById("startScan");
  if (startScanButton) {
    startScanButton.addEventListener("click", async () => {
      try {
        const scannedContact = await nfcHandler.readNFCData();
        if (scannedContact) {
          displayContactDetails(scannedContact);
          showView("contactDetails");

          // Save the scanned contact button
          const saveContactBtn = document.getElementById("save-contact-btn");
          if (saveContactBtn) {
            saveContactBtn.onclick = function () {
              saveContactToLocalStorage(scannedContact);
              showView("contactsList");
            };
          }
        }
      } catch (error) {
        console.error("Error scanning NFC:", error);
        alert("Fehler beim Scannen: " + error.message);
      }
    });
  }

  // Contact form submission
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
        address: document.getElementById("address").value,
        website: document.getElementById("website").value || "",
      };

      try {
        // Save to Firebase
        const contactId = await createContact(contactData);

        // Save to local storage
        saveContactToLocalStorage({
          ...contactData,
          id: contactId,
          source: "firebase",
        });

        // Reset form
        contactForm.reset();

        alert("Kontakt erfolgreich gespeichert!");
      } catch (error) {
        console.error("Error creating contact:", error);
        alert("Fehler beim Erstellen des Kontakts: " + error.message);
      }
    });
  }

  // Write to NFC button
  const writeNfcBtn = document.getElementById("write-nfc-btn");
  if (writeNfcBtn) {
    writeNfcBtn.addEventListener("click", () => {
      // Get form data
      const contactData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        company: document.getElementById("company").value,
        position: document.getElementById("position").value,
        address: document.getElementById("address").value,
        website: document.getElementById("website").value || "",
      };

      // Check if required fields are filled
      if (
        !contactData.firstName ||
        !contactData.lastName ||
        !contactData.email
      ) {
        alert("Bitte füllen Sie mindestens Vorname, Nachname und E-Mail aus.");
        return;
      }

      // Show NFC write view
      showView("writeToChip");

      // Start writing process
      nfcHandler.writeContactToNFC(contactData);
    });
  }

  // Initialize contacts list
  displayContacts();
});

// Display contact details in the contact details view
function displayContactDetails(contact) {
  const contactInfo = document.getElementById("contact-info");

  let html = "";

  if (contact.firstName || contact.lastName) {
    html += `
            <div class="contact-field">
                <span class="field-label">Name:</span>
                <span class="field-value">${contact.firstName || ""} ${
      contact.lastName || ""
    }</span>
            </div>
        `;
  }

  if (contact.company) {
    html += `
            <div class="contact-field">
                <span class="field-label">Unternehmen:</span>
                <span class="field-value">${contact.company}</span>
            </div>
        `;
  }

  if (contact.position) {
    html += `
            <div class="contact-field">
                <span class="field-label">Position:</span>
                <span class="field-value">${contact.position}</span>
            </div>
        `;
  }

  if (contact.address) {
    html += `
            <div class="contact-field">
                <span class="field-label">Adresse:</span>
                <span class="field-value">${contact.address}</span>
            </div>
        `;
  }

  if (contact.phoneNumber) {
    html += `
            <div class="contact-field">
                <span class="field-label">Telefon:</span>
                <span class="field-value"><a href="tel:${contact.phoneNumber}">${contact.phoneNumber}</a></span>
            </div>
        `;
  }

  if (contact.email) {
    html += `
            <div class="contact-field">
                <span class="field-label">E-Mail:</span>
                <span class="field-value"><a href="mailto:${contact.email}">${contact.email}</a></span>
            </div>
        `;
  }

  if (contact.website) {
    html += `
            <div class="contact-field">
                <span class="field-label">Website:</span>
                <span class="field-value website"><a href="${contact.website}" target="_blank">${contact.website}</a></span>
            </div>
        `;
  }

  contactInfo.innerHTML = html;
}

// Expose necessary functions to window
window.displayContactDetails = displayContactDetails;
