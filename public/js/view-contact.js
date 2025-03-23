import {
  getContactById,
  getContactByToken,
  downloadContactAsVCard,
  normalizeContactData,
} from "./contacts.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Get contact ID or token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = urlParams.get("id");
  const shareToken = urlParams.get("token");

  if (!contactId && !shareToken) {
    document.getElementById("contact-details").innerHTML =
      "<p>Fehler: Kein Kontakt angegeben</p>";
    return;
  }

  try {
    // Load contact data by ID or token
    let contactData;
    if (contactId) {
      contactData = await getContactById(contactId);
    } else if (shareToken) {
      contactData = await getContactByToken(shareToken);
    }

    displayContactDetails(contactData);

    // Setup contact save function
    document.getElementById("save-contact").addEventListener("click", () => {
      downloadContactAsVCard(contactData);
    });

    // Add install app functionality
    const installBtn = document.getElementById("install-app");
    if (installBtn) {
      let deferredPrompt;

      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the install button
        installBtn.style.display = "block";
      });

      installBtn.addEventListener("click", (e) => {
        if (!deferredPrompt) {
          alert(
            "Diese App kann momentan nicht installiert werden. Bitte versuchen Sie es später oder besuchen Sie die Website direkt."
          );
          return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
          deferredPrompt = null;
        });
      });
    }
  } catch (error) {
    document.getElementById(
      "contact-details"
    ).innerHTML = `<p>Fehler: ${error.message}</p>`;
  }
});

function displayContactDetails(contact) {
  // Ensure we have a normalized contact
  const normalizedContact = normalizeContactData(contact);
  const contactDetails = document.getElementById("contact-details");

  const html = `
    <div class="contact-info">
      <h2>${normalizedContact.firstName} ${normalizedContact.lastName}</h2>
      ${
        normalizedContact.company
          ? `<div class="contact-field"><span class="field-label">Firma:</span> <span class="field-value">${normalizedContact.company}</span></div>`
          : ""
      }
      ${
        normalizedContact.position
          ? `<div class="contact-field"><span class="field-label">Position:</span> <span class="field-value">${normalizedContact.position}</span></div>`
          : ""
      }
      ${
        normalizedContact.email
          ? `<div class="contact-field"><span class="field-label">E-Mail:</span> <span class="field-value"><a href="mailto:${normalizedContact.email}">${normalizedContact.email}</a></span></div>`
          : ""
      }
      ${
        normalizedContact.phoneNumber
          ? `<div class="contact-field"><span class="field-label">Telefon:</span> <span class="field-value"><a href="tel:${normalizedContact.phoneNumber}">${normalizedContact.phoneNumber}</a></span></div>`
          : ""
      }
      ${
        normalizedContact.address
          ? `<div class="contact-field"><span class="field-label">Adresse:</span> <span class="field-value">${normalizedContact.address}</span></div>`
          : ""
      }
      ${
        normalizedContact.website
          ? `<div class="contact-field"><span class="field-label">Website:</span> <span class="field-value website"><a href="${normalizedContact.website}" target="_blank">${normalizedContact.website}</a></span></div>`
          : ""
      }
    </div>
  `;

  contactDetails.innerHTML = html;
}
