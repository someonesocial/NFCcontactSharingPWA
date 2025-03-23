// Local storage key for contacts
const CONTACTS_STORAGE_KEY = "nfc_saved_contacts";

// Import normalized contact format function
import { normalizeContactData } from "./contacts.js";

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

// Delete a contact from local storage
export function deleteContactFromLocalStorage(contactId) {
  const contacts = getContactsFromLocalStorage();
  const updatedContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
}

// Display contacts in the contacts list view
export function displayContacts() {
  const contacts = getContactsFromLocalStorage();
  const contactsContainer = document.getElementById("contacts-container");

  if (!contactsContainer || !contacts.length) {
    if (contactsContainer) {
      contactsContainer.innerHTML =
        '<p style="text-align: center; width: 100%;">Keine Kontakte gespeichert</p>';
    }
    return;
  }

  let html = "";

  contacts.forEach((contact) => {
    const initials = getInitials(contact.firstName, contact.lastName);

    html += `
            <div class="contact-item" data-id="${
              contact.id
            }" onclick="showContactDetails('${contact.id}')">
                <div class="contact-avatar">${initials}</div>
                <div class="contact-details-mini">
                    <div class="contact-name">${contact.firstName || ""} ${
      contact.lastName || ""
    }</div>
                    ${
                      contact.company
                        ? `<div class="contact-company">${contact.company}</div>`
                        : ""
                    }
                    ${
                      contact.email
                        ? `<div class="contact-email">${contact.email}</div>`
                        : ""
                    }
                </div>
            </div>
        `;
  });

  contactsContainer.innerHTML = html;
}

// Get initials from name
function getInitials(firstName, lastName) {
  let initials = "";
  if (firstName && firstName.length > 0) {
    initials += firstName[0].toUpperCase();
  }
  if (lastName && lastName.length > 0) {
    initials += lastName[0].toUpperCase();
  }
  return initials || "?";
}

// Generate a unique ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Function to show contact details from the contacts list
window.showContactDetails = function (contactId) {
  const contacts = getContactsFromLocalStorage();
  const contact = contacts.find((c) => c.id === contactId);

  if (contact) {
    window.displayContactDetails(contact);
    window.showView("contactDetails");

    // Update save button to handle deletion instead
    const saveBtn = document.getElementById("save-contact-btn");
    if (saveBtn) {
      saveBtn.textContent = "Löschen";
      saveBtn.onclick = function () {
        if (confirm("Möchten Sie diesen Kontakt wirklich löschen?")) {
          deleteContactFromLocalStorage(contactId);
          window.showView("contactsList");
        }
      };
    }
  }
};
