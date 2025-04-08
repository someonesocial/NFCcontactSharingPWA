<template>
  <div id="overlay" v-if="visible">
    <div id="overlayMessage">{{ message }}</div>
    <button id="cancelNfcOperation" @click="cancel">Abbrechen</button>
  </div>
</template>

<script>
export default {
  name: 'NfcOverlay',
  data() {
    return {
      visible: false,
      message: 'Bitte halten Sie das NFC-Tag an Ihr Gerät',
      resolveFunction: null,
      rejectFunction: null
    }
  },
  methods: {
    show(message) {
      this.message = message || 'Bitte halten Sie das NFC-Tag an Ihr Gerät'
      this.visible = true

      return new Promise((resolve, reject) => {
        this.resolveFunction = resolve
        this.rejectFunction = reject
      })
    },
    hide() {
      this.visible = false
    },
    cancel() {
      this.hide()
      if (this.rejectFunction) {
        this.rejectFunction(new Error('Scan abgebrochen.'))
        this.resolveFunction = null
        this.rejectFunction = null
      }
    },
    success(data) {
      if (this.resolveFunction) {
        this.resolveFunction(data)
        this.resolveFunction = null
        this.rejectFunction = null
      }
      this.hide()
    },
    error(err) {
      if (this.rejectFunction) {
        this.rejectFunction(err)
        this.resolveFunction = null
        this.rejectFunction = null
      }
      this.hide()
    }
  }
}
</script>

<style scoped>
#overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 1000;
}

#overlay button {
  margin-top: 20px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  pointer-events: auto;
  background-color: white;
  border: none;
  border-radius: 5px;
}
</style>