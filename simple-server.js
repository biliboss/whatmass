const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Serve the landing page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
    console.log('Debug endpoint accessed');
    res.json({ status: 'ok', message: 'Debug endpoint working' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
});