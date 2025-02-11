import React from 'react';

const NfcWriter: React.FC<{ url: string }> = ({ url }) => {
    const writeToNfc = async () => {
        if ('NFC' in navigator) {
            try {
                const nfc = navigator.nfc;
                const message = [
                    {
                        recordType: 'text',
                        data: url,
                    },
                ];
                await nfc.write(message);
                alert('NFC tag written successfully!');
            } catch (error) {
                console.error('Error writing to NFC tag:', error);
                alert('Failed to write to NFC tag.');
            }
        } else {
            alert('NFC is not supported on this device.');
        }
    };

    return (
        <div>
            <button onClick={writeToNfc}>Write URL to NFC Tag</button>
        </div>
    );
};

export default NfcWriter;