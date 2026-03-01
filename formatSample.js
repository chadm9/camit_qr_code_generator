function generateQrPayload(ssid, password) {
    const ssidB64 = Buffer.from(ssid, 'utf8').toString('base64');
    const passB64 = Buffer.from(password, 'utf8').toString('base64');
    return `4=${ssidB64}/${passB64}`;
}