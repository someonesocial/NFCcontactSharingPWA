import { getContactById } from "./contacts.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Kontakt-ID aus der URL holen
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = urlParams.get("id");

  if (!contactId) {
    document.getElementById("contact-details").innerHTML =
      "<p>Fehler: Kein Kontakt angegeben</p>";
    return;
  }

  try {
    // Kontaktdaten laden
    const contactData = await getContactById(contactId);
    displayContactDetails(contactData);

    // Kontakt-Speichern-Funktion einrichten
    document.getElementById("save-contact").addEventListener("click", () => {
      saveContact(contactData);
    });
  } catch (error) {
    document.getElementById(
      "contact-details"
    ).innerHTML = `<p>Fehler: ${error.message}</p>`;
  }
});

function displayContactDetails(contact) {
  const contactDetails = document.getElementById("contact-details");

  const html = `
    <div class="contact-card">
      <h2>${contact.firstName} ${contact.lastName}</h2>
      ${
        contact.company
          ? `<p><strong>Firma:</strong> ${contact.company}</p>`
          : ""
      }
      ${
        contact.position
          ? `<p><strong>Position:</strong> ${contact.position}</p>`
          : ""
      }
      ${
        contact.email
          ? `<p><strong>E-Mail:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>`
          : ""
      }
      ${
        contact.phoneNumber
          ? `<p><strong>Telefon:</strong> <a href="tel:${contact.phoneNumber}">${contact.phoneNumber}</a></p>`
          : ""
      }
    </div>
  `;

  contactDetails.innerHTML = html;
}

function saveContact(contact) {
  // vCard erstellen
  const vcardData = `BEGIN:VCARD
VERSION:3.0
N:${contact.lastName};${contact.firstName};;;
FN:${contact.firstName} ${contact.lastName}
${contact.email ? `EMAIL:${contact.email}` : ""}
${contact.phoneNumber ? `TEL:${contact.phoneNumber}` : ""}
${contact.company ? `ORG:${contact.company}` : ""}
${contact.position ? `TITLE:${contact.position}` : ""}
END:VCARD`;

  // Als Datei zum Download anbieten
  const blob = new Blob([vcardData], { type: "text/vcard" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${contact.firstName}_${contact.lastName}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
