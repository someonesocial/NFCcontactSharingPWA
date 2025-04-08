<template>
  <div class="write-to-chip">
    <div class="contact-card">
      <div class="close-btn" @click="goBack">✕</div>
      <div class="nfc-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
      <div class="scan-text">
        NFC-Chip jetzt ans Gerät halten, um den Kontakt darauf zu schreiben.
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'WriteToChipView',
  inject: ['nfcService'],
  
  setup() {
    const router = useRouter();
    
    // Kontaktdaten holen und NFC-Schreibvorgang starten
    onMounted(async () => {
      // Get contact data from router state
      const contactData = router.currentRoute.value.state?.contactData;
      
      if (!contactData || !contactData.shareUrl) {
        alert("Fehler: Keine Kontaktdaten zum Schreiben gefunden");
        router.push('/add-contact');
        return;
      }
      
      try {
        // Write contact data to NFC tag
        await writeContactToNFC(contactData);
      } catch (error) {
        console.error("Fehler beim Schreiben auf das NFC-Tag:", error);
        alert(`Fehler beim Schreiben auf das NFC-Tag: ${error.message}`);
        router.push('/add-contact');
      }
    });
    
    // NFC-Schreibvorgang
    const writeContactToNFC = async (contactData) => {
      try {
        await this.nfcService.writeContactToNFC(contactData);
        setTimeout(() => {
          router.push('/add-contact');
        }, 2000);
      } catch (error) {
        throw error;
      }
    };
    
    // Zurück zur vorherigen Seite
    const goBack = () => {
      router.push('/add-contact');
    };
    
    return {
      goBack
    };
  }
}
</script>

<style scoped>
.write-to-chip {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.contact-card {
  background-color: #f0f0f5;
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 18px;
  cursor: pointer;
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
  margin: 0 auto;
}

.nfc-icon svg {
  width: 60px;
  height: 60px;
}

.scan-text {
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
}
</style>