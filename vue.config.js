module.exports = {
  // ESLint komplett deaktivieren
  lintOnSave: false,
  chainWebpack: (config) => {
    config.plugins.delete("eslint");
  },

  // PWA-Konfiguration
  pwa: {
    // Nutze die InjectManifest-Methode mit einem benutzerdefinierten Service-Worker
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // Benutze unseren eigenen Service Worker
      swSrc: "./src/custom-service-worker.js",
      // Ändere den Ausgabedateinamen
      swDest: "service-worker.js",
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: "/index.html",
    },
    name: "NFC Kontakte",
    themeColor: "#333333",
    msTileColor: "#ffffff",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    manifestOptions: {
      display: "standalone",
      background_color: "#ffffff",
    },
  },

  // Konfiguriere den Ausgabepfad
  outputDir: "dist",
  // Pfad für statische Assets
  assetsDir: "assets",
  // Content-Hash für konsistentere Builds
  filenameHashing: true,
};
