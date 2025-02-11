export const writeNfcTag = async (url: string) => {
    if ('NFC' in window) {
        try {
            const nfc = new NDEFReader();
            await nfc.write({
                records: [
                    {
                        recordType: "url",
                        data: url
                    }
                ]
            });
            console.log('NFC tag written successfully!');
        } catch (error) {
            console.error('Error writing NFC tag:', error);
        }
    } else {
        console.error('Web NFC is not supported on this device.');
    }
};

export const readNfcTag = async () => {
    if ('NFC' in window) {
        try {
            const nfc = new NDEFReader();
            await nfc.scan();
            nfc.onreading = (event) => {
                const message = event.message;
                for (const record of message.records) {
                    if (record.recordType === "url") {
                        console.log('NFC tag URL:', record.data);
                    }
                }
            };
            console.log('NFC scan started successfully!');
        } catch (error) {
            console.error('Error reading NFC tag:', error);
        }
    } else {
        console.error('Web NFC is not supported on this device.');
    }
};