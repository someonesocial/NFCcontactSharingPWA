# NFC Contact Sharing PWA

A Progressive Web Application that allows users to create and share contact information through unique URLs and NFC tags.

## Features

- Create digital contact cards with personal information
- Generate unique shareable URLs for each contact
- Write contact URLs to NFC tags
- Read contact URLs from NFC tags
- Works offline (PWA functionality)
- Firebase backend for data persistence
- Mobile-friendly interface

## How It Works

### 1. Creating a Contact

1. Open the app and navigate to the contact form
2. Enter your contact details (name, email, phone)
3. Submit the form to generate a unique URL
4. Your contact information is stored in Firebase

### 2. Sharing via NFC

1. After creating a contact, click "Write to NFC"
2. Hold an NFC tag near your device
3. The app writes your unique contact URL to the tag
4. Others can now scan this tag with any NFC-enabled phone

### 3. Reading Contacts

1. When someone scans the NFC tag
2. Their phone automatically opens the unique URL
3. They see your contact information in a clean card format

## Technical Requirements

- Android device with Chrome 89+ for NFC functionality
- NFC tags (NDEF format compatible)
- Internet connection for initial setup
- Firebase account for backend services

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
npm install
```

3. Configure Firebase:

   - Create a Firebase project
   - Copy your Firebase config to `src/config/firebase.ts`
   - Enable Firestore database

4. Start development server:

```bash
npm start
```

## Firebase Configuration

Update `src/config/firebase.ts` with your Firebase credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-domain.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-bucket.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
```

## Development Notes

### NFC Compatibility

- The Web NFC API is currently only supported on Android devices with Chrome 89+
- iOS devices cannot write to NFC tags through web browsers
- Testing should be done on physical Android devices

### PWA Features

- The app works offline after initial load
- Contact data is cached using Service Workers
- Can be installed as a home screen app

## Security Considerations

- NFC tags are write-protected after initial writing
- URLs use unique identifiers to prevent guessing
- Firebase security rules should be configured properly

## Troubleshooting

Common issues and solutions:

1. NFC not working

   - Ensure NFC is enabled in device settings
   - Use Chrome browser on Android
   - Hold the tag closer to the NFC sensor

2. PWA not installing
   - Make sure to use HTTPS
   - Verify manifest.json is properly configured
   - Clear browser cache if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License
