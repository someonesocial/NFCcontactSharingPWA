// Local storage key for contacts
const CONTACTS_STORAGE_KEY = "nfc_saved_contacts";

// Normalize contact data format
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

// Save a contact to local storage
export function saveContactToLocalStorage(contact) {
  // Normalize the contact data first
  const normalizedContact = normalizeContactData(contact);

  // Add timestamp and ensure ID
  const contactWithTimestamp = {
    ...normalizedContact,
    savedAt: new Date().toISOString(),
    id: normalizedContact.id || generateId(),
  };

  // Get existing contacts
  const contacts = getContactsFromLocalStorage();

  // Check if the contact already exists
  const existingIndex = contacts.findIndex(
    (c) =>
      (c.id && c.id === contactWithTimestamp.id) ||
      (c.email && c.email === contactWithTimestamp.email)
  );

  if (existingIndex >= 0) {
    // Update existing contact
    contacts[existingIndex] = contactWithTimestamp;
  } else {
    // Add new contact
    contacts.push(contactWithTimestamp);
  }

  // Save back to local storage
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));

  return contactWithTimestamp;
}

// Get all contacts from local storage
export function getContactsFromLocalStorage() {
  const contactsJson = localStorage.getItem(CONTACTS_STORAGE_KEY);
  if (!contactsJson) {
    return [];
  }

  try {
    return JSON.parse(contactsJson);
  } catch (error) {
    console.error("Error parsing contacts from local storage", error);
    return [];
  }
}

// Get a single contact by ID from local storage
export function getContactByIdFromLocalStorage(id) {
  const contacts = getContactsFromLocalStorage();
  return contacts.find((contact) => contact.id === id) || null;
}

// Delete a contact from local storage
export function deleteContactFromLocalStorage(contactId) {
  const contacts = getContactsFromLocalStorage();
  const updatedContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
}

// Generate a unique ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Function to convert contact to vCard format and download
export function downloadContactAsVCard(contact) {
  const vCardContent = contactToVCard(contact);
  const blob = new Blob([vCardContent], { type: "text/vcard" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${contact.firstName || "contact"}_${
    contact.lastName || ""
  }.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Convert contact to vCard format
function contactToVCard(contact) {
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
