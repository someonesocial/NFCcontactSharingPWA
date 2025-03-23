export function initNFC() {
  // Create overlay element for NFC interactions
  const overlayDiv = document.createElement("div");
  overlayDiv.id = "overlay";
  overlayDiv.innerHTML = `
        <div id="overlayMessage">Bitte halten Sie das NFC-Tag an Ihr Gerät</div>
        <button id="cancelNfcOperation">Abbrechen</button>
    `;
  document.body.appendChild(overlayDiv);

  const overlay = document.getElementById("overlay");
  const overlayMessage = document.getElementById("overlayMessage");
  const cancelButton = document.getElementById("cancelNfcOperation");

  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }

  function showOverlay(message) {
    overlayMessage.textContent = message;
    overlay.style.display = "flex";
  }

  function hideOverlay() {
    overlay.style.display = "none";
  }

  async function writeUrlToNFC(url) {
    if (!("NDEFReader" in window)) {
      alert(
        "Web NFC wird von diesem Browser nicht unterstützt. Verwenden Sie Chrome für Android."
      );
      return;
    }

    try {
      showOverlay("Bitte halten Sie das NFC-Tag an Ihr Gerät");

      const ndef = new NDEFReader();
      await ndef.write({
        records: [{ recordType: "url", data: url }],
      });

      showOverlay("URL erfolgreich auf NFC-Tag geschrieben!");

      setTimeout(() => {
        hideOverlay();
        window.showView("scanView");
      }, 2000);
    } catch (error) {
      console.error("Fehler beim Schreiben auf das NFC-Tag:", error);
      alert("Fehler beim Schreiben auf das NFC-Tag: " + error.message);
      hideOverlay();
    }
  }

  async function writeContactToNFC(contactData) {
    if (!("NDEFReader" in window)) {
      alert(
        "Web NFC wird von diesem Browser nicht unterstützt. Verwenden Sie Chrome für Android."
      );
      return;
    }

    // Create vCard format
    const vcard = createVCard(contactData);

    try {
      showOverlay("Bitte halten Sie das NFC-Tag an Ihr Gerät");

      const ndef = new NDEFReader();
      await ndef.write({
        records: [
          { recordType: "mime", mediaType: "text/vcard", data: vcard },
          // Also add a URL record for better compatibility with different readers
          { recordType: "url", data: window.location.origin },
        ],
      });

      showOverlay("Kontakt erfolgreich auf NFC-Tag geschrieben!");

      setTimeout(() => {
        hideOverlay();
        window.showView("addContact");
      }, 2000);
    } catch (error) {
      console.error("Fehler beim Schreiben auf das NFC-Tag:", error);
      alert("Fehler beim Schreiben auf das NFC-Tag: " + error.message);
      hideOverlay();
    }
  }

  function createVCard(contact) {
    let vcard = "BEGIN:VCARD\nVERSION:3.0\n";

    // Add name
    vcard += `N:${contact.lastName || ""};${contact.firstName || ""};;;\n`;
    vcard += `FN:${contact.firstName || ""} ${contact.lastName || ""}\n`;

    // Add other details if they exist
    if (contact.email) vcard += `EMAIL:${contact.email}\n`;
    if (contact.phoneNumber) vcard += `TEL:${contact.phoneNumber}\n`;
    if (contact.company) vcard += `ORG:${contact.company}\n`;
    if (contact.position) vcard += `TITLE:${contact.position}\n`;
    if (contact.address) vcard += `ADR:;;${contact.address};;;\n`;
    if (contact.website) vcard += `URL:${contact.website}\n`;

    vcard += "END:VCARD";

    return new TextEncoder().encode(vcard);
  }

  function parseVCard(vcardText) {
    const contact = {};
    const lines = vcardText.split("\n");

    for (const line of lines) {
      if (line.startsWith("FN:")) {
        const fullName = line.substring(3).trim();
        const nameParts = fullName.split(" ");
        if (nameParts.length > 1) {
          contact.firstName = nameParts[0];
          contact.lastName = nameParts.slice(1).join(" ");
        } else {
          contact.firstName = fullName;
        }
      } else if (line.startsWith("N:")) {
        const nameParts = line.substring(2).split(";");
        contact.lastName = nameParts[0]?.trim() || "";
        contact.firstName = nameParts[1]?.trim() || "";
      } else if (line.startsWith("EMAIL:")) {
        contact.email = line.substring(6).trim();
      } else if (line.startsWith("TEL:")) {
        contact.phoneNumber = line.substring(4).trim();
      } else if (line.startsWith("ORG:")) {
        contact.company = line.substring(4).trim();
      } else if (line.startsWith("TITLE:")) {
        contact.position = line.substring(6).trim();
      } else if (line.startsWith("ADR:")) {
        const addressParts = line.substring(4).split(";");
        // Usually the street address is in the third component
        contact.address =
          addressParts[2]?.trim() || addressParts.slice(2).join(", ").trim();
      } else if (line.startsWith("URL:")) {
        contact.website = line.substring(4).trim();
      }
    }

    return contact;
  }

  async function readNFCData() {
    return new Promise((resolve, reject) => {
      if (!("NDEFReader" in window)) {
        reject(
          new Error(
            "Web NFC wird von diesem Browser nicht unterstützt. Verwenden Sie Chrome für Android."
          )
        );
        return;
      }

      try {
        showOverlay("Bitte halten Sie das NFC-Tag an Ihr Gerät");

        const ndef = new NDEFReader();
        let readTimeout;

        const scanPromise = ndef.scan().then(() => {
          console.log("NFC scan started successfully");

          // Set a timeout for reading
          readTimeout = setTimeout(() => {
            hideOverlay();
            reject(new Error("Zeitüberschreitung beim Lesen des NFC-Tags."));
          }, 60000); // 1 minute timeout

          ndef.onreading = (event) => {
            clearTimeout(readTimeout);

            const decoder = new TextDecoder();
            const records = event.message.records;
            let vcardRecord = null;

            // Look for vCard record
            for (const record of records) {
              if (
                record.mediaType === "text/vcard" ||
                record.mediaType === "text/x-vcard"
              ) {
                vcardRecord = record;
                break;
              }
            }

            if (vcardRecord) {
              const vcardText = decoder.decode(vcardRecord.data);
              const contactData = parseVCard(vcardText);
              hideOverlay();
              resolve(contactData);
            } else if (records.length > 0) {
              // Try to interpret as plain text
              const text = decoder.decode(records[0].data);

              if (text.includes("BEGIN:VCARD") && text.includes("END:VCARD")) {
                const contactData = parseVCard(text);
                hideOverlay();
                resolve(contactData);
              } else if (text.startsWith("http")) {
                // It's a URL - we can't do much with it directly
                hideOverlay();
                resolve({
                  url: text,
                  isUrl: true,
                });
              } else {
                // Just some text
                hideOverlay();
                resolve({
                  note: text,
                });
              }
            } else {
              hideOverlay();
              reject(
                new Error("Keine lesbaren Daten auf dem NFC-Tag gefunden.")
              );
            }
          };

          ndef.onreadingerror = (error) => {
            clearTimeout(readTimeout);
            hideOverlay();
            reject(error);
          };
        });

        // Allow user to cancel
        document.getElementById("cancelNfcOperation").onclick = () => {
          clearTimeout(readTimeout);
          hideOverlay();
          reject(new Error("Scan abgebrochen."));
        };

        return scanPromise;
      } catch (error) {
        hideOverlay();
        reject(error);
      }
    });
  }

  return {
    writeUrlToNFC,
    writeContactToNFC,
    readNFCData,
  };
}
