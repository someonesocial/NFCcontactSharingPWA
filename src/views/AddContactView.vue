<template>
  <div class="add-contact">
    <div class="form-title">Erstellen Sie Ihren eigenen Kontakt</div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <input
          type="text"
          v-model="contactData.lastName"
          class="form-input"
          placeholder="Nachname*"
          required
        />
      </div>

      <div class="form-group">
        <input
          type="text"
          v-model="contactData.firstName"
          class="form-input"
          placeholder="Vorname*"
          required
        />
      </div>

      <div class="form-group">
        <input
          type="text"
          v-model="contactData.company"
          class="form-input"
          placeholder="Firma*"
          required
        />
      </div>

      <div class="form-group">
        <input
          type="text"
          v-model="contactData.position"
          class="form-input"
          placeholder="Position*"
          required
        />
      </div>

      <div class="form-group">
        <input
          type="email"
          v-model="contactData.email"
          class="form-input"
          placeholder="E-Mail*"
          required
        />
      </div>

      <div class="form-group">
        <input
          type="text"
          v-model="contactData.address"
          class="form-input"
          placeholder="Adresse*"
          required
        />
      </div>

      <div class="form-group">
        <input
          type="tel"
          v-model="contactData.phoneNumber"
          class="form-input"
          placeholder="Telefon*"
          required
        />
      </div>

      <div class="form-group">
        <input
          type="url"
          v-model="contactData.website"
          class="form-input"
          placeholder="Website"
        />
      </div>

      <div class="button-group">
        <button type="submit" class="button save-button">Speichern</button>
        <button
          type="button"
          class="button write-nfc-button"
          @click="handleWriteToNfc"
        >
          Auf NFC-Chip schreiben
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { createContact } from '@/services/firebaseService';
import { saveContactToLocalStorage } from '@/services/storageService';

export default {
  name: 'AddContactView',
  inject: ['nfcService'],
  
  setup() {
    const router = useRouter();
    const contactData = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      company: '',
      position: '',
      address: '',
      website: '',
    });

    // Formular absenden und Kontakt speichern
    const handleSubmit = async () => {
      try {
        // Save to Firebase and get share URL
        const result = await createContact(contactData);

        // Save to local storage
        saveContactToLocalStorage({
          ...contactData,
          id: result.id,
          shareUrl: result.shareUrl,
          source: 'firebase',
        });

        // Show success message with share URL
        alert(
          `Kontakt erfolgreich gespeichert!\nTeilen Sie diesen Link: ${result.shareUrl}`
        );

        // Reset form
        Object.keys(contactData).forEach(key => {
          contactData[key] = '';
        });
      } catch (error) {
        console.error("Error creating contact:", error);
        alert("Fehler beim Erstellen des Kontakts: " + error.message);
      }
    };

    // Auf NFC-Chip schreiben
    const handleWriteToNfc = async () => {
      // Check if required fields are filled
      if (
        !contactData.firstName ||
        !contactData.lastName ||
        !contactData.email
      ) {
        alert("Bitte füllen Sie mindestens Vorname, Nachname und E-Mail aus.");
        return;
      }

      try {
        // Save to Firebase and get share URL
        const result = await createContact(contactData);

        // Save the contact data including the shareUrl and shareToken
        const savedContact = saveContactToLocalStorage({
          ...contactData,
          id: result.id,
          shareUrl: result.shareUrl,
          shareToken: result.shareToken,
          source: "firebase",
        });

        // Navigate to write to chip view with the contact data
        router.push({
          name: 'WriteToChip',
          state: { contactData: savedContact }
        });
      } catch (error) {
        console.error("Error creating contact for NFC:", error);
        alert("Fehler beim Erstellen des Kontakts: " + error.message);
      }
    };

    return {
      contactData,
      handleSubmit,
      handleWriteToNfc
    };
  }
}
</script>

<style scoped>
.add-contact {
  width: 100%;
}

.form-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  align-self: flex-start;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
}

.form-input {
  padding: 12px 15px;
  border-radius: 15px;
  border: none;
  width: 100%;
  background-color: #f0f0f5;
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

.write-nfc-button {
  background-color: #e0e0e5;
  color: #333;
}
</style>