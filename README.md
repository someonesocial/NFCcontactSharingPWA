# NFC Contact Sharing PWA

This Progressive Web App (PWA) allows users to create, manage, and share contact information via NFC tags. It leverages modern web technologies and Firebase services to provide a seamless and user-friendly experience.

## Features

- **Contact Management**:
  - Create contact information (Name, Email, Phone, Company, Position, Address, Website).
  - Save contacts locally or in Firebase Firestore.
  - Generate a unique shareable URL for each contact.
- **NFC Functionality**:
  - Write contact URLs or vCard data to NFC tags.
  - Read NFC tags to retrieve contact information.
- **Offline Support**:
  - Works offline using a Service Worker.
  - Cached assets for faster loading.
- **Progressive Web App**:
  - Installable on mobile devices.
  - Responsive design for various screen sizes.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Firebase (Firestore, Authentication)
- **NFC**: Web NFC API (supported on Chrome for Android)
- **PWA**: Service Worker, Web App Manifest

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nfc-contact-sharing.git
cd nfc-contact-sharing
```

### 2. Install Dependencies

This project uses Firebase CLI for deployment and management. Install it globally if not already installed:

```bash
npm install -g firebase-tools
```

### 3. Configure Firebase

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Copy the Firebase configuration values into a `.env` file based on the `.env.example` file provided.

```env
FIREBASE_API_KEY="your-api-key"
FIREBASE_AUTH_DOMAIN="your-auth-domain"
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_STORAGE_BUCKET="your-storage-bucket"
FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
FIREBASE_APP_ID="your-app-id"
```

### 4. Deploy the App

1. Login to Firebase CLI:

```bash
firebase login
```

2. Initialize Firebase in the project directory:

```bash
firebase init
```

3. Deploy the app:

```bash
firebase deploy
```

## Usage

1. Open the app in a browser that supports Web NFC (e.g., Chrome for Android).
2. Create a new contact by filling out the form.
3. Save the contact locally or write it to an NFC tag.
4. Scan NFC tags to retrieve and display contact information.

## Project Structure

```
.
├── public/
│   ├── index.html          # Main HTML file
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript modules
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Service Worker for offline support
│   └── icons/              # App icons
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
├── .env.example            # Example environment variables
├── README.md               # Project documentation
└── package.json            # Project dependencies
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Firebase](https://firebase.google.com/) for backend services.
- [Workbox](https://developers.google.com/web/tools/workbox) for simplifying Service Worker implementation.
- [Web NFC API](https://developer.mozilla.org/en-US/docs/Web/API/Web_NFC_API) for NFC functionality.