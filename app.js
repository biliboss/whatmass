const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 12001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// API key middleware
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['apikey'];
  if (apiKey !== 'masswhats-api-key') {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  next();
};

// Routes
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Masswhats API is running',
    version: '1.0.0'
  });
});

// Instance initialization
app.post('/instance/init', apiKeyMiddleware, (req, res) => {
  const { instanceName } = req.body;
  if (!instanceName) {
    return res.status(400).json({ error: 'Instance name is required' });
  }
  
  res.json({
    status: 'success',
    message: `Instance ${instanceName} initialized successfully`,
    instance: {
      instanceName,
      status: 'created',
      qrcode: null
    }
  });
});

// Get QR code
app.get('/instance/:instanceName/qrcode', apiKeyMiddleware, (req, res) => {
  const { instanceName } = req.params;
  
  res.json({
    status: 'success',
    message: 'QR code generated successfully',
    qrcode: {
      code: '233-928',
      base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB+UlEQVR42uyYMY7sIBBEa+QrcAmuNJfgEroCR44cjRzNJTjyJTgaOdqvUPUYe3e/Iv2JnGhkrR+NR9NdDd0A/Oc/Pwz8cQAbcMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwIFvBr4A6ixQ5S3oKbsAAAAASUVORK5CYII='
    }
  });
});

// Send text message
app.post('/message/sendText/:instanceName', apiKeyMiddleware, (req, res) => {
  const { instanceName } = req.params;
  const { number, numbers, textMessage } = req.body;
  
  if (!textMessage) {
    return res.status(400).json({ error: 'Text message is required' });
  }
  
  if (!number && (!numbers || !numbers.length)) {
    return res.status(400).json({ error: 'Number or numbers array is required' });
  }
  
  const recipients = number ? [number] : numbers;
  
  res.json({
    status: 'success',
    message: `Message sent successfully to ${recipients.length} recipient(s)`,
    data: {
      instanceName,
      recipients,
      message: textMessage
    }
  });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Masswhats API running on port ${port}`);
});