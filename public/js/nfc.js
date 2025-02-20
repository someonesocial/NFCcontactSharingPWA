export function initNFC() {
  const writeButton = document.getElementById("writeNFC");
  const readButton = document.getElementById("readNFC");
  const overlay = document.getElementById("overlay");
  const overlayMessage = document.getElementById("overlayMessage");
  const saveContactButton = document.getElementById("saveContact");
  let vcardContent = "";

  function showOverlayTillTap(message, showButton = false) {
    overlayMessage.textContent = message;
    overlay.style.display = "flex";
    saveContactButton.style.display = showButton ? "block" : "none";
  }

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.style.display = "none";
    }
  });

  writeButton.addEventListener("click", writeNFCData);
  readButton.addEventListener("click", readNFCData);
  saveContactButton.addEventListener("click", handleSaveContact);

  async function writeNFCData() {
    if (!("NDEFReader" in window)) {
      alert("Web NFC wird von diesem Browser nicht unterstützt.");
      return;
    }

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    if (!firstName || !lastName || !phoneNumber) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }

    const vcardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${firstName} ${lastName}\nTEL:${phoneNumber}\nEND:VCARD`;

    try {
      const ndef = new NDEFReader();
      await ndef.write(vcardData);
      showOverlayTillTap("Daten erfolgreich auf das NFC-Tag geschrieben!");
    } catch (error) {
      console.error("Fehler beim Schreiben auf das NFC-Tag:", error);
      alert("Fehler beim Schreiben auf das NFC-Tag.");
    }
  }

  async function readNFCData() {
    if (!("NDEFReader" in window)) {
      alert("Web NFC wird von diesem Browser nicht unterstützt.");
      return;
    }

    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      showOverlayTillTap(
        "Bitte halten Sie ein NFC-Tag in die Nähe des Geräts."
      );

      ndef.onreading = (event) => {
        const decoder = new TextDecoder();
        const records = event.message.records;
        if (records.length > 0) {
          vcardContent = decoder.decode(records[0].data);
          showOverlayTillTap("Gelesene Daten:\n" + vcardContent, true);
          ndef.onreading = null;
        }
      };
    } catch (error) {
      console.error("Fehler beim Lesen des NFC-Tags:", error);
      alert("Fehler beim Lesen des NFC-Tags.");
    }
  }

  async function handleSaveContact() {
    const file = new File([vcardContent], "contact.vcf", {
      type: "text/vcard",
    });
    if (navigator.canShare && navigator.canShare()) {
      try {
        await navigator.share({
          title: "Kontakt speichern",
          text: "Speichern Sie diesen Kontakt",
        });
      } catch (error) {
        console.error("Fehler beim Teilen des Kontakts:", error);
        alert("Error");
      }
    } else {
      const blob = new Blob([vcardContent], { type: "text/vcard" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "contact.vcf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showOverlayTillTap(
        "Kontaktdatei heruntergeladen. Öffnen Sie die Datei, um den Kontakt zu speichern."
      );
    }
  }
}
