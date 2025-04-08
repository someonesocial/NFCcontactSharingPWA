<template>
  <div id="app">
    <router-view />
    <NavigationBar />
    <NfcOverlay ref="nfcOverlay" />
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue'
import NfcOverlay from './components/NfcOverlay.vue'
import { initializeService } from './services/nfcService'

export default {
  name: 'App',
  components: {
    NavigationBar,
    NfcOverlay
  },
  provide() {
    return {
      nfcService: initializeService(this)
    }
  },
  mounted() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => console.log('Service Worker registriert', reg))
        .catch(err => console.error('Service Worker Registrierung fehlgeschlagen', err))
    }
  }
}
</script>

<style>
/* Globale Styles werden aus CSS-Datei importiert */
</style>