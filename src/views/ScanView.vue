<template>
  <div class="scan-view">
    <div class="nfc-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
          fill="#AAAABC"
        />
        <path
          d="M8 12C8 9.79 9.79 8 12 8"
          stroke="#AAAABC"
          stroke-width="2"
        />
        <path
          d="M7 12C7 9.24 9.24 7 12 7"
          stroke="#AAAABC"
          stroke-width="2"
        />
        <path
          d="M6 12C6 8.69 8.69 6 12 6"
          stroke="#AAAABC"
          stroke-width="2"
        />
      </svg>
    </div>
    <div class="scan-text">NFC-Chip jetzt einscannen</div>
    <button id="startScan" class="button save-button" @click="startScan">Scan starten</button>
  </div>
</template>

<script>
import { getContactByToken } from '@/services/firebaseService';
import { normalizeContactData, saveContactToLocalStorage } from '@/services/storageService';

export default {
  name: 'ScanView',
  inject: ['nfcService'],
  methods: {
    async startScan() {
      try {
        const scannedData = await this.nfcService.readNFCData();
        console.log("Scanned NFC data:", scannedData);

        if (scannedData) {
          let contactData;

          // Check if this is a URL with a token
          if (scannedData.isUrl && scannedData.token) {
            try {
              console.log("Fetching contact data with token:", scannedData.token);
              contactData = await getContactByToken(scannedData.token);
              console.log("Retrieved contact data:", contactData);

              // Validate the contact data
              if (!contactData || Object.keys(contactData).length === 0) {
                throw new Error("Keine Kontaktdaten gefunden für diesen Token.");
              }
            } catch (error) {
              console.error("Error fetching contact data from token:", error);
              alert("Fehler beim Abrufen der Kontaktdaten: " + error.message);
              return;
            }
          } else {
            // Use scanned data directly, but normalize it
            contactData = normalizeContactData(scannedData);
          }

          // Verify we have valid data before displaying
          if (!contactData) {
            alert("Die gescannten Daten enthalten keine gültigen Kontaktinformationen.");
            return;
          }

          // Store contact data in router state and navigate to details view
          this.$router.push({ 
            name: 'ContactDetails',
            params: { isScanned: true },
            state: { contact: contactData }
          });
        }
      } catch (error) {
        console.error("Error scanning NFC:", error);
        alert("Fehler beim Scannen: " + error.message);
      }
    }
  }
}
</script>

<style scoped>
.scan-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nfc-icon {
  width: 150px;
  height: 150px;
  background-color: #f0f0f5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.nfc-icon svg {
  width: 60px;
  height: 60px;
}

.scan-text {
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
}

.button {
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px;
}

.save-button {
  background-color: #333;
  color: white;
}
</style>