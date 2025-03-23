import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Create a new contact in Firebase
export async function createContact(contactData) {
  try {
    const docRef = await addDoc(collection(db, "contacts"), {
      ...contactData,
      createdAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Fehler beim Erstellen des Kontakts:", error);
    throw error;
  }
}

// Get a contact by ID from Firebase
export async function getContactById(id) {
  try {
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

// Function to convert contact to vCard format
export function contactToVCard(contact) {
  let vcard = "BEGIN:VCARD\nVERSION:3.0\n";

  // Add name
  vcard += `N:${contact.lastName || ""};${contact.firstName || ""};;;\n`;
  vcard += `FN:${contact.firstName || ""} ${contact.lastName || ""}\n`;

  // Add other details if they exist
  if (contact.email) vcard += `EMAIL:${contact.email}\n`;
  if (contact.phoneNumber) vcard += `TEL:${contact.phoneNumber}\n`;
  if (contact.company) vcard += `ORG:${contact.company}\n`;
  if (contact.position) vcard += `TITLE:${contact.position}\n`;
  if (contact.address) vcard += `ADR:;;${contact.address};;;\n`;
  if (contact.website) vcard += `URL:${contact.website}\n`;

  vcard += "END:VCARD";

  return vcard;
}

// Save contact as vCard file
export function downloadContactAsVCard(contact) {
  const vcardContent = contactToVCard(contact);
  const blob = new Blob([vcardContent], { type: "text/vcard" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${contact.firstName || "contact"}_${
    contact.lastName || ""
  }.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
