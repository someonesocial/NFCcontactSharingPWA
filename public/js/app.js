import { initNFC } from "./nfc.js";
import { setupAuth } from "./auth.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((reg) => console.log("Service Worker registered", reg))
    .catch((err) => console.error("Service Worker registration failed", err));
}

document.addEventListener("DOMContentLoaded", () => {
  setupAuth();
  initNFC();
});
