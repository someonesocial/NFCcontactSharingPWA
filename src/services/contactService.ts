export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    uniqueUrl: string;
}

const contacts: Contact[] = [];

export const createContact = (name: string, email: string, phone: string): Contact => {
    const newContact: Contact = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        uniqueUrl: generateUniqueUrl(name)
    };
    contacts.push(newContact);
    return newContact;
};

export const getContacts = (): Contact[] => {
    return contacts;
};

export const shareContact = (contact: Contact): string => {
    return `Check out my contact: ${contact.uniqueUrl}`;
};

const generateUniqueUrl = (name: string): string => {
    const baseUrl = "https://yourapp.com/contact/";
    const uniqueId = encodeURIComponent(name + Date.now());
    return `${baseUrl}${uniqueId}`;
};