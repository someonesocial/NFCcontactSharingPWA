import { db, auth } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { signInAnon } from "./firebase-config.js";

// Generate a random shareable URL token
function generateRandomToken(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Create a new contact in Firebase
export async function createContact(contactData) {
  try {
    // Generate a unique sharing token
    const shareToken = generateRandomToken();
    const shareUrl = `${window.location.origin}/contact.html?token=${shareToken}`;

    const docRef = await addDoc(collection(db, "contacts"), {
      ...contactData,
      shareToken: shareToken,
      shareUrl: shareUrl,
      createdAt: new Date(),
    });

    return {
      id: docRef.id,
      shareToken,
      shareUrl,
    };
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
      return normalizeContactData({
        ...docSnap.data(),
        id: docSnap.id,
      });
    } else {
      throw new Error("Kontakt nicht gefunden");
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des Kontakts:", error);
    throw error;
  }
}

// Updated getContactByToken function
export async function getContactByToken(token) {
  try {
    console.log("Getting contact with token:", token);

    // First ensure we're authenticated
    if (!auth.currentUser) {
      console.warn("User not authenticated yet, trying to sign in...");
      try {
        await signInAnon();
      } catch (authError) {
        console.error("Failed to authenticate:", authError);
      }
    }

    const contactsCollection = collection(db, "contacts");
    const snapshot = await getDocs(
      query(contactsCollection, where("shareToken", "==", token))
    );

    console.log(
      "Query result:",
      snapshot.empty ? "No results" : `${snapshot.docs.length} results`
    );

    if (snapshot.empty) {
      throw new Error("Kontakt nicht gefunden");
    }

    const docData = snapshot.docs[0].data();
    console.log("Retrieved document data:", docData);

    // Standardize contact format
    return normalizeContactData({
      ...docData,
      id: snapshot.docs[0].id,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen des Kontakts mit Token:", error);
    throw error;
  }
}

// Standardize contact data format
export function normalizeContactData(contact) {
  return {
    id: contact.id || null,
    firstName: contact.firstName || "",
    lastName: contact.lastName || "",
    email: contact.email || "",
    phoneNumber: contact.phoneNumber || "",
    company: contact.company || "",
    position: contact.position || "",
    address: contact.address || "",
    website: contact.website || "",
    shareUrl: contact.shareUrl || null,
    shareToken: contact.shareToken || null,
    // Keep other properties
    ...contact,
  };
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
