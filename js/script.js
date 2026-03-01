document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('qr-form');
    const modalOverlay = document.getElementById('qr-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    let qrCodeInstance = null;

    // Helper to encode string to base64 properly handling utf-8
    function toBase64(str) {
        return btoa(String.fromCharCode(...new Uint8Array(new TextEncoder().encode(str))));
    }

    // Following formatSample.js logic but using browser APIs
    function generateQrPayload(ssid, password) {
        const ssidB64 = toBase64(ssid);
        const passB64 = toBase64(password);
        return `4=${ssidB64}/${passB64}`;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const ssid = document.getElementById('ssid').value;
        const password = document.getElementById('password').value;

        if (!ssid) return;

        const payload = generateQrPayload(ssid, password);

        // Clear previous QR code if exists
        qrcodeContainer.innerHTML = '';

        // Generate new QR code using QRCode.js
        qrCodeInstance = new QRCode(qrcodeContainer, {
            text: payload,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        // Show modal
        openModal();
    });

    function openModal() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeModal);

    // Close on click outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
});
