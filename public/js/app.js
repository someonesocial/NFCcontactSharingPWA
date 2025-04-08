import { initNFC } from "./nfc.js";
import { setupAuth } from "./auth.js";
import { signInAnon, auth } from "./firebase-config.js";
import {
  createContact,
  getContactByToken,
  normalizeContactData,
} from "./contacts.js";
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
        const scannedData = await nfcHandler.readNFCData();
        console.log("Scanned NFC data:", scannedData);

        if (scannedData) {
          let contactData;

          // Check if this is a URL with a token
          if (scannedData.isUrl && scannedData.token) {
            try {
              // Add clear console logging
              console.log(
                "Fetching contact data with token:",
                scannedData.token
              );
              contactData = await getContactByToken(scannedData.token);
              console.log("Retrieved contact data:", contactData);

              // Validate the contact data
              if (!contactData || Object.keys(contactData).length === 0) {
                throw new Error(
                  "Keine Kontaktdaten gefunden für diesen Token."
                );
              }
            } catch (error) {
              console.error("Error fetching contact data from token:", error);
              alert("Fehler beim Abrufen der Kontaktdaten: " + error.message);
              return;
            }
          } else {
            // Use scanned data directly, but normalize it
            contactData = normalizeContactData(scannedData);
          }

          // Verify we have valid data before displaying
          if (!contactData) {
            alert(
              "Die gescannten Daten enthalten keine gültigen Kontaktinformationen."
            );
            return;
          }

          console.log("Final contact data to display:", contactData);
          displayContactDetails(contactData);
          showView("contactDetails");

          // Save the scanned contact button
          const saveContactBtn = document.getElementById("save-contact-btn");
          if (saveContactBtn) {
            saveContactBtn.textContent = "Speichern";
            saveContactBtn.onclick = function () {
              saveContactToLocalStorage(contactData);
              alert("Kontakt erfolgreich gespeichert!");
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
        // Save to Firebase and get share URL
        const result = await createContact(contactData);

        // Save to local storage
        saveContactToLocalStorage({
          ...contactData,
          id: result.id,
          shareUrl: result.shareUrl,
          source: "firebase",
        });

        // Show success message with share URL
        alert(
          `Kontakt erfolgreich gespeichert!\nTeilen Sie diesen Link: ${result.shareUrl}`
        );

        // Reset form
        contactForm.reset();
      } catch (error) {
        console.error("Error creating contact:", error);
        alert("Fehler beim Erstellen des Kontakts: " + error.message);
      }
    });
  }

  // Write to NFC button
  const writeNfcBtn = document.getElementById("write-nfc-btn");
  if (writeNfcBtn) {
    writeNfcBtn.addEventListener("click", async () => {
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

      try {
        // Save to Firebase and get share URL
        const result = await createContact(contactData);

        // Save the contact data including the shareUrl and shareToken
        const savedContact = saveContactToLocalStorage({
          ...contactData,
          id: result.id,
          shareUrl: result.shareUrl,
          shareToken: result.shareToken,
          source: "firebase",
        });

        // Show NFC write view
        showView("writeToChip");

        // Write URL to NFC tag
        nfcHandler.writeContactToNFC(savedContact);
      } catch (error) {
        console.error("Error creating contact for NFC:", error);
        alert("Fehler beim Erstellen des Kontakts: " + error.message);
      }
    });
  }

  // Initialize contacts list
  displayContacts();
});

// Display contact details in the contact details view
function displayContactDetails(contact) {
  console.log("Displaying contact details:", contact);
  const contactInfo = document.getElementById("contact-info");

  if (!contactInfo) {
    console.error("Contact info element not found");
    return;
  }

  // Ensure we have a normalized contact object
  const normalizedContact = normalizeContactData(contact);

  let html = "";

  // Remove debug section that was showing raw contact data
  // No need to display technical information to users
  // Add a debug section (always show in this case to help troubleshoot)
  /*
  html += `<div style="font-size:10px; color:#999; margin-bottom:10px">Debug: ${JSON.stringify(
    normalizedContact
  )}</div>`;
  */

  if (normalizedContact.firstName || normalizedContact.lastName) {
    html += `
      <div class="contact-field">
        <span class="field-label">Name:</span>
        <span class="field-value">${normalizedContact.firstName || ""} ${
      normalizedContact.lastName || ""
    }</span>
      </div>
    `;
  }

  if (normalizedContact.company) {
    html += `
      <div class="contact-field">
        <span class="field-label">Unternehmen:</span>
        <span class="field-value">${normalizedContact.company}</span>
      </div>
    `;
  }

  if (normalizedContact.position) {
    html += `
      <div class="contact-field">
        <span class="field-label">Position:</span>
        <span class="field-value">${normalizedContact.position}</span>
      </div>
    `;
  }

  if (normalizedContact.address) {
    html += `
      <div class="contact-field">
        <span class="field-label">Adresse:</span>
        <span class="field-value">${normalizedContact.address}</span>
      </div>
    `;
  }

  if (normalizedContact.phoneNumber) {
    html += `
      <div class="contact-field">
        <span class="field-label">Telefon:</span>
        <span class="field-value"><a href="tel:${normalizedContact.phoneNumber}">${normalizedContact.phoneNumber}</a></span>
      </div>
    `;
  }

  if (normalizedContact.email) {
    html += `
      <div class="contact-field">
        <span class="field-label">E-Mail:</span>
        <span class="field-value"><a href="mailto:${normalizedContact.email}">${normalizedContact.email}</a></span>
      </div>
    `;
  }

  if (normalizedContact.website) {
    html += `
      <div class="contact-field">
        <span class="field-label">Website:</span>
        <span class="field-value website"><a href="${normalizedContact.website}" target="_blank">${normalizedContact.website}</a></span>
      </div>
    `;
  }

  // If we have a URL but no other info, display the URL
  if (normalizedContact.isUrl && normalizedContact.url && html === "") {
    html += `
      <div class="contact-field">
        <span class="field-label">URL:</span>
        <span class="field-value website"><a href="${normalizedContact.url}" target="_blank">${normalizedContact.url}</a></span>
      </div>
    `;
  }

  // If shareUrl is available, show it
  if (
    normalizedContact.shareUrl &&
    !html.includes(normalizedContact.shareUrl)
  ) {
    html += `
      <div class="contact-field">
        <span class="field-label">Teilen:</span>
        <span class="field-value website"><a href="${normalizedContact.shareUrl}" target="_blank">${normalizedContact.shareUrl}</a></span>
      </div>
    `;
  }

  // If note is available (for plain text NFC tags)
  if (normalizedContact.note) {
    html += `
      <div class="contact-field">
        <span class="field-label">Notiz:</span>
        <span class="field-value">${normalizedContact.note}</span>
      </div>
    `;
  }

  // If no fields were generated, show a more detailed error message
  if (
    html === "" ||
    (html.includes("Debug:") && html.split("</div>").length === 1)
  ) {
    html += `<p>Keine Kontaktdaten verfügbar. Bitte überprüfen Sie den NFC-Tag.</p>`;
  }

  contactInfo.innerHTML = html;
}

// Expose necessary functions to window
window.displayContactDetails = displayContactDetails;
