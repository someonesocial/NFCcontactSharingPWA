export function initializeService(app) {
  // Zugriff auf die overlay-Komponente
  const nfcOverlay = app.$refs.nfcOverlay;

  async function writeUrlToNFC(url) {
    if (!("NDEFReader" in window)) {
      throw new Error(
        "Web NFC wird von diesem Browser nicht unterstützt. Verwenden Sie Chrome für Android."
      );
    }

    try {
      // Show overlay during NFC operation
      await nfcOverlay.show("Bitte halten Sie das NFC-Tag an Ihr Gerät");

      const ndef = new NDEFReader();
      await ndef.write({
        records: [{ recordType: "url", data: url }],
      });

      await nfcOverlay.show("URL erfolgreich auf NFC-Tag geschrieben!");

      // Hide overlay after success
      setTimeout(() => {
        nfcOverlay.hide();
      }, 2000);

      return true;
    } catch (error) {
      console.error("Fehler beim Schreiben auf das NFC-Tag:", error);
      nfcOverlay.error(error);
      throw error;
    }
  }

  async function writeContactToNFC(contactData) {
    if (!("NDEFReader" in window)) {
      throw new Error(
        "Web NFC wird von diesem Browser nicht unterstützt. Verwenden Sie Chrome für Android."
      );
    }

    // Make sure we have a share URL to write
    if (!contactData.shareUrl) {
      throw new Error("Keine Teilen-URL für diesen Kontakt verfügbar.");
    }

    try {
      // Show overlay during NFC operation
      await nfcOverlay.show("Bitte halten Sie das NFC-Tag an Ihr Gerät");

      const ndef = new NDEFReader();
      await ndef.write({
        records: [{ recordType: "url", data: contactData.shareUrl }],
      });

      await nfcOverlay.show("Kontakt-URL erfolgreich auf NFC-Tag geschrieben!");

      // Hide overlay after success
      setTimeout(() => {
        nfcOverlay.hide();
      }, 2000);

      return true;
    } catch (error) {
      console.error("Fehler beim Schreiben auf das NFC-Tag:", error);
      nfcOverlay.error(error);
      throw error;
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
    if (!("NDEFReader" in window)) {
      throw new Error(
        "Web NFC wird von diesem Browser nicht unterstützt. Verwenden Sie Chrome für Android."
      );
    }

    try {
      // Show overlay during NFC scan
      const overlayPromise = nfcOverlay.show(
        "Bitte halten Sie das NFC-Tag an Ihr Gerät"
      );

      const ndef = new NDEFReader();
      let readTimeout;

      // Start NFC scan
      await ndef.scan();
      console.log("NFC scan started successfully");

      // Set a timeout for reading
      readTimeout = setTimeout(() => {
        nfcOverlay.error(
          new Error("Zeitüberschreitung beim Lesen des NFC-Tags.")
        );
      }, 60000); // 1 minute timeout

      // Promise for NFC reading
      const readPromise = new Promise((resolve, reject) => {
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
            nfcOverlay.success(contactData);
            resolve(contactData);
          } else if (records.length > 0) {
            // Try to interpret as plain text
            const text = decoder.decode(records[0].data);

            if (text.includes("BEGIN:VCARD") && text.includes("END:VCARD")) {
              const contactData = parseVCard(text);
              nfcOverlay.success(contactData);
              resolve(contactData);
            } else if (text.startsWith("http")) {
              // It's a URL - extract the token if it's a contact sharing URL
              try {
                const url = new URL(text);
                const token = url.searchParams.get("token");

                if (token) {
                  console.log("Found contact token in URL:", token);
                  nfcOverlay.success({
                    isUrl: true,
                    url: text,
                    token: token,
                  });
                  resolve({
                    isUrl: true,
                    url: text,
                    token: token,
                  });
                } else {
                  nfcOverlay.success({
                    isUrl: true,
                    url: text,
                  });
                  resolve({
                    isUrl: true,
                    url: text,
                  });
                }
              } catch (e) {
                // Not a valid URL
                nfcOverlay.success({
                  isUrl: true,
                  url: text,
                });
                resolve({
                  isUrl: true,
                  url: text,
                });
              }
            } else {
              // Just some text
              nfcOverlay.success({
                note: text,
              });
              resolve({
                note: text,
              });
            }
          } else {
            const error = new Error(
              "Keine lesbaren Daten auf dem NFC-Tag gefunden."
            );
            nfcOverlay.error(error);
            reject(error);
          }
        };

        ndef.onreadingerror = (error) => {
          clearTimeout(readTimeout);
          nfcOverlay.error(error);
          reject(error);
        };
      });

      // Wait for either overlay cancel or successful read
      return await Promise.race([overlayPromise, readPromise]);
    } catch (error) {
      nfcOverlay.error(error);
      throw error;
    }
  }

  return {
    writeUrlToNFC,
    writeContactToNFC,
    readNFCData,
    createVCard,
    parseVCard,
  };
}
