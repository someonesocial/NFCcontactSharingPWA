# nfc-contact-pwa/nfc-contact-pwa/README.md

# NFC Contact PWA

This project is a Progressive Web App (PWA) that allows users to create a contact site with a unique URL that can be shared with others. The app utilizes the Web NFC API to write the unique URL to an NFC tag, making it easily accessible on any phone. It is built using React and Firebase.

## Features

- Create and manage contact information
- Generate a unique URL for each contact
- Write the unique URL to an NFC tag using the Web NFC API
- Offline capabilities through service workers

## Project Structure

```
nfc-contact-pwa
├── public
│   ├── manifest.json
│   ├── service-worker.js
│   └── index.html
├── src
│   ├── components
│   │   ├── ContactForm.tsx
│   │   ├── ContactCard.tsx
│   │   └── NfcWriter.tsx
│   ├── config
│   │   └── firebase.ts
│   ├── services
│   │   ├── contactService.ts
│   │   └── nfcService.ts
│   ├── types
│   │   └── index.ts
│   ├── utils
│   │   └── helpers.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── tsconfig.json
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd nfc-contact-pwa
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the app.

## Usage

- Fill out the contact form to create a new contact.
- Click the button to generate a unique URL.
- Use the NFC writer to write the URL to an NFC tag.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.