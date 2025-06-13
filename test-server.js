const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
    console.log('Debug endpoint accessed');
    res.json({ status: 'ok', message: 'Debug endpoint working' });
});

// WhatsApp connect endpoint
app.get('/api/whatsapp-connect', (req, res) => {
    console.log('WhatsApp connect endpoint accessed');
    res.json({
        success: true,
        qrcode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://masswhats.com/connect',
        phoneCode: '233-928'
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
});