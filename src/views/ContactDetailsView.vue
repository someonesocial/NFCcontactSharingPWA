<template>
  <div class="contact-details">
    <div class="contact-card">
      <div class="close-btn" @click="goBack">✕</div>
      <div id="contact-info" class="contact-info">
        <!-- Debug info (nur für Entwicklung) -->
        <div v-if="debug" class="debug-info">
          Debug: {{ JSON.stringify(contact) }}
        </div>

        <div v-if="contact.firstName || contact.lastName" class="contact-field">
          <span class="field-label">Name:</span>
          <span class="field-value">{{ contact.firstName || '' }} {{ contact.lastName || '' }}</span>
        </div>

        <div v-if="contact.company" class="contact-field">
          <span class="field-label">Unternehmen:</span>
          <span class="field-value">{{ contact.company }}</span>
        </div>

        <div v-if="contact.position" class="contact-field">
          <span class="field-label">Position:</span>
          <span class="field-value">{{ contact.position }}</span>
        </div>

        <div v-if="contact.address" class="contact-field">
          <span class="field-label">Adresse:</span>
          <span class="field-value">{{ contact.address }}</span>
        </div>

        <div v-if="contact.phoneNumber" class="contact-field">
          <span class="field-label">Telefon:</span>
          <span class="field-value">
            <a :href="'tel:' + contact.phoneNumber">{{ contact.phoneNumber }}</a>
          </span>
        </div>

        <div v-if="contact.email" class="contact-field">
          <span class="field-label">E-Mail:</span>
          <span class="field-value">
            <a :href="'mailto:' + contact.email">{{ contact.email }}</a>
          </span>
        </div>

        <div v-if="contact.website" class="contact-field">
          <span class="field-label">Website:</span>
          <span class="field-value website">
            <a :href="contact.website" target="_blank">{{ contact.website }}</a>
          </span>
        </div>

        <div v-if="contact.isUrl && contact.url && noFields" class="contact-field">
          <span class="field-label">URL:</span>
          <span class="field-value website">
            <a :href="contact.url" target="_blank">{{ contact.url }}</a>
          </span>
        </div>

        <div v-if="contact.shareUrl && !urlIncluded" class="contact-field">
          <span class="field-label">Teilen:</span>
          <span class="field-value website">
            <a :href="contact.shareUrl" target="_blank">{{ contact.shareUrl }}</a>
          </span>
        </div>

        <div v-if="contact.note" class="contact-field">
          <span class="field-label">Notiz:</span>
          <span class="field-value">{{ contact.note }}</span>
        </div>

        <p v-if="noData">Keine Kontaktdaten verfügbar. Bitte überprüfen Sie den NFC-Tag.</p>
      </div>

      <div class="button-group">
        <button class="button save-button" @click="handleActionButton">
          {{ actionButtonText }}
        </button>
        <button class="button cancel-button" @click="goBack">
          {{ isScanned ? 'Verwerfen' : 'Zurück' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { normalizeContactData, saveContactToLocalStorage, getContactByIdFromLocalStorage, deleteContactFromLocalStorage, downloadContactAsVCard } from '@/services/storageService';

export default {
  name: 'ContactDetailsView',
  props: {
    id: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const contact = ref({});
    const isScanned = ref(route.params.isScanned === 'true' || Boolean(route.params.isScanned));
    const debug = ref(process.env.NODE_ENV !== 'production');

    // Check where the contact data comes from
    if (route.params.id) {
      // Load from localStorage by ID
      const storedContact = getContactByIdFromLocalStorage(route.params.id);
      if (storedContact) {
        contact.value = normalizeContactData(storedContact);
      }
    } else if (router.currentRoute.value.state?.contact) {
      // Contact from router state (from scan)
      contact.value = normalizeContactData(router.currentRoute.value.state.contact);
    }

    const noFields = computed(() => {
      return !contact.value.firstName && 
             !contact.value.lastName && 
             !contact.value.company && 
             !contact.value.position && 
             !contact.value.address && 
             !contact.value.phoneNumber && 
             !contact.value.email && 
             !contact.value.website;
    });

    const noData = computed(() => {
      return noFields.value && 
             !contact.value.isUrl && 
             !contact.value.url && 
             !contact.value.shareUrl &&
             !contact.value.note;
    });

    const urlIncluded = computed(() => {
      const html = document.getElementById('contact-info')?.innerHTML || '';
      return html.includes(contact.value.shareUrl);
    });

    const actionButtonText = computed(() => {
      return isScanned.value ? 'Speichern' : 'Löschen';
    });

    const goBack = () => {
      if (isScanned.value) {
        router.push('/');
      } else {
        router.push('/contacts');
      }
    };

    const handleActionButton = () => {
      if (isScanned.value) {
        // Save scanned contact
        saveContactToLocalStorage(contact.value);
        alert('Kontakt erfolgreich gespeichert!');
        router.push('/contacts');
      } else {
        // Delete stored contact
        if (confirm('Möchten Sie diesen Kontakt wirklich löschen?')) {
          deleteContactFromLocalStorage(contact.value.id);
          router.push('/contacts');
        }
      }
    };

    return {
      contact,
      isScanned,
      debug,
      noFields,
      noData,
      urlIncluded,
      actionButtonText,
      goBack,
      handleActionButton
    };
  }
}
</script>

<style scoped>
.contact-details {
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

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.debug-info {
  font-size: 10px;
  color: #999;
  margin-bottom: 10px;
  word-break: break-all;
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

.website {
  text-decoration: underline;
  color: #000;
}

.website a {
  color: inherit;
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