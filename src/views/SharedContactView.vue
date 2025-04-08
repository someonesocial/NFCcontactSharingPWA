<template>
  <div class="main-content">
    <div class="contact-card">
      <h1>Kontakt Details</h1>
      <div id="contact-details">
        <p v-if="loading">Lade Kontaktdetails...</p>
        <p v-if="error">{{ error }}</p>
        
        <div v-if="contact" class="contact-info">
          <h2>{{ contact.firstName }} {{ contact.lastName }}</h2>
          
          <div v-if="contact.company" class="contact-field">
            <span class="field-label">Firma:</span>
            <span class="field-value">{{ contact.company }}</span>
          </div>
          
          <div v-if="contact.position" class="contact-field">
            <span class="field-label">Position:</span>
            <span class="field-value">{{ contact.position }}</span>
          </div>
          
          <div v-if="contact.email" class="contact-field">
            <span class="field-label">E-Mail:</span>
            <span class="field-value">
              <a :href="'mailto:' + contact.email">{{ contact.email }}</a>
            </span>
          </div>
          
          <div v-if="contact.phoneNumber" class="contact-field">
            <span class="field-label">Telefon:</span>
            <span class="field-value">
              <a :href="'tel:' + contact.phoneNumber">{{ contact.phoneNumber }}</a>
            </span>
          </div>
          
          <div v-if="contact.address" class="contact-field">
            <span class="field-label">Adresse:</span>
            <span class="field-value">{{ contact.address }}</span>
          </div>
          
          <div v-if="contact.website" class="contact-field">
            <span class="field-label">Website:</span>
            <span class="field-value website">
              <a :href="contact.website" target="_blank">{{ contact.website }}</a>
            </span>
          </div>
        </div>
      </div>
      
      <div class="button-group">
        <button class="button save-button" @click="downloadContact">
          Als Kontakt speichern
        </button>
        <button v-if="canInstall" class="button cancel-button" @click="installApp">
          App installieren
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getContactByToken } from '@/services/firebaseService';
import { normalizeContactData, downloadContactAsVCard } from '@/services/storageService';

export default {
  name: 'SharedContactView',
  
  setup() {
    const route = useRoute();
    const contact = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const canInstall = ref(false);
    let deferredPrompt = null;

    // Lädt Kontaktdaten anhand des Tokens in der URL
    const loadContactData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (!token) {
        loading.value = false;
        error.value = "Fehler: Kein Kontakt angegeben";
        return;
      }
      
      try {
        const contactData = await getContactByToken(token);
        contact.value = normalizeContactData(contactData);
        loading.value = false;
      } catch (err) {
        console.error("Fehler beim Laden des Kontakts:", err);
        error.value = `Fehler: ${err.message}`;
        loading.value = false;
      }
    };

    // VCard herunterladen
    const downloadContact = () => {
      if (contact.value) {
        downloadContactAsVCard(contact.value);
      }
    };

    // App Installation
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      // Show the install button
      canInstall.value = true;
    };

    const installApp = async () => {
      if (!deferredPrompt) {
        alert(
          "Diese App kann momentan nicht installiert werden. Bitte versuchen Sie es später oder besuchen Sie die Website direkt."
        );
        return;
      }

      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      deferredPrompt = null;
      canInstall.value = false;
    };

    onMounted(() => {
      // Lade Kontaktdaten beim Mounten der Komponente
      loadContactData();
      
      // Registriere Event-Listener für Installation
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      // Cleanup
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    });
    
    return {
      contact,
      loading,
      error,
      canInstall,
      downloadContact,
      installApp
    };
  }
}
</script>

<style scoped>
.contact-card {
  background-color: #f0f0f5;
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  position: relative;
}

h1 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 22px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.contact-field {
  margin-bottom: 5px;
}

.field-label {
  font-weight: bold;
}

.field-value {
  margin-left: 8px;
}

.website a {
  text-decoration: underline;
  color: #000;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.button {
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.save-button {
  background-color: #333;
  color: white;
}

.cancel-button {
  background-color: #e0e0e5;
  color: #333;
}
</style>