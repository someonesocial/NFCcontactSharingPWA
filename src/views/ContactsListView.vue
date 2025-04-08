<template>
  <div class="contacts-list">
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Kontakte suchen"
        class="form-input"
      />
      <span>🔍</span>
    </div>

    <div id="contacts-container">
      <div 
        v-for="contact in filteredContacts" 
        :key="contact.id" 
        class="contact-item"
        @click="showContactDetails(contact.id)"
      >
        <div class="contact-avatar">{{ getInitials(contact.firstName, contact.lastName) }}</div>
        <div class="contact-details-mini">
          <div class="contact-name">{{ contact.firstName || '' }} {{ contact.lastName || '' }}</div>
          <div v-if="contact.company" class="contact-company">{{ contact.company }}</div>
          <div v-if="contact.email" class="contact-email">{{ contact.email }}</div>
        </div>
      </div>
      
      <p v-if="contacts.length === 0" style="text-align: center; width: 100%;">Keine Kontakte gespeichert</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getContactsFromLocalStorage } from '@/services/storageService';

export default {
  name: 'ContactsListView',
  setup() {
    const router = useRouter();
    const contacts = ref([]);
    const searchQuery = ref('');
    
    // Gefilterte Kontakte basierend auf der Suchquery
    const filteredContacts = computed(() => {
      if (!searchQuery.value) return contacts.value;
      
      const query = searchQuery.value.toLowerCase();
      return contacts.value.filter(contact => 
        (contact.firstName && contact.firstName.toLowerCase().includes(query)) ||
        (contact.lastName && contact.lastName.toLowerCase().includes(query)) ||
        (contact.company && contact.company.toLowerCase().includes(query)) ||
        (contact.email && contact.email.toLowerCase().includes(query)) ||
        (contact.phoneNumber && contact.phoneNumber.includes(query))
      );
    });
    
    // Lädt Kontakte aus dem lokalen Speicher
    const loadContacts = () => {
      contacts.value = getContactsFromLocalStorage();
    };
    
    // Initialen aus Name generieren
    const getInitials = (firstName, lastName) => {
      let initials = "";
      if (firstName && firstName.length > 0) {
        initials += firstName[0].toUpperCase();
      }
      if (lastName && lastName.length > 0) {
        initials += lastName[0].toUpperCase();
      }
      return initials || "?";
    };
    
    // Kontaktdetails anzeigen
    const showContactDetails = (contactId) => {
      router.push({ 
        name: 'ContactDetails',
        params: { id: contactId }
      });
    };
    
    // Beim Mounten der Komponente Kontakte laden
    onMounted(() => {
      loadContacts();
    });
    
    return {
      contacts,
      searchQuery,
      filteredContacts,
      getInitials,
      showContactDetails
    };
  }
}
</script>

<style scoped>
.contacts-list {
  padding-top: 20px;
  align-items: flex-start;
  width: 100%;
}

.search-bar {
  background-color: #f0f0f5;
  padding: 10px 15px;
  border-radius: 25px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
}

.form-input {
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
}

.contact-item {
  display: flex;
  padding: 12px 0;
  width: 100%;
  border-bottom: 1px solid #f0f0f5;
  cursor: pointer;
}

.contact-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f5;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  font-weight: bold;
}

.contact-name {
  font-weight: bold;
  margin-bottom: 3px;
}

.contact-company,
.contact-email {
  font-size: 14px;
  color: #666;
  margin-bottom: 3px;
}
</style>