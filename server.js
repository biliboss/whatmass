const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 12000;

// Evolution API configuration
const EVOLUTION_API_URL = 'http://localhost:12001';
const EVOLUTION_API_KEY = 'masswhats-api-key'; // This should match the APIKEY in your docker-compose.env file
const INSTANCE_NAME = 'masswhats';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
    console.log('Debug endpoint accessed');
    res.json({ status: 'ok', message: 'Debug endpoint working' });
});

// Test endpoint to check Evolution API connection
app.get('/api/test-evolution', async (req, res) => {
    console.log('Testing Evolution API connection...');
    
    try {
        // Test 0: Check API version
        console.log('Test 0: Checking API version...');
        try {
            const versionResponse = await axios.get(`${EVOLUTION_API_URL}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': EVOLUTION_API_KEY,
                    'Authorization': `Bearer ${EVOLUTION_API_KEY}`
                }
            });
            
            console.log('API version:', JSON.stringify(versionResponse.data));
        } catch (versionError) {
            console.log('Version check error:', versionError.message);
        }
        
        // Test 1: Fetch instances
        console.log('Test 1: Fetching instances...');
        const instancesResponse = await axios.get(`${EVOLUTION_API_URL}/instance/fetchInstances`, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY,
                'Authorization': `Bearer ${EVOLUTION_API_KEY}`
            }
        });
        
        console.log('Instances response:', JSON.stringify(instancesResponse.data));
        
        // Test 2: Try different instance creation payloads
        console.log('Test 2: Testing instance creation...');
        
        // Try different payloads for instance creation
        const payloads = [
            { instanceName: INSTANCE_NAME, integration: "baileys" },
            { instanceName: INSTANCE_NAME, integration: "wa" },
            { instanceName: INSTANCE_NAME, integration: "whatsapp" },
            { instanceName: INSTANCE_NAME },
            { instanceName: INSTANCE_NAME, token: "masswhats-token" }
        ];
        
        let createSuccess = false;
        let createError = null;
        
        for (const payload of payloads) {
            try {
                console.log(`Trying payload: ${JSON.stringify(payload)}`);
                const createResponse = await axios.post(`${EVOLUTION_API_URL}/instance/create`, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': EVOLUTION_API_KEY,
                        'Authorization': `Bearer ${EVOLUTION_API_KEY}`
                    }
                });
                
                console.log('Create instance response:', JSON.stringify(createResponse.data));
                createSuccess = true;
                break;
            } catch (error) {
                console.log(`Create error with payload ${JSON.stringify(payload)}:`, error.message);
                createError = error;
            }
        }
        
        if (!createSuccess) {
            console.log('All instance creation attempts failed');
        }
        
        // Test 3: Try to get QR code directly
        console.log('Test 3: Getting QR code directly...');
        try {
            const qrResponse = await axios.get(`${EVOLUTION_API_URL}/instance/qrcode`, {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': EVOLUTION_API_KEY,
                    'Authorization': `Bearer ${EVOLUTION_API_KEY}`
                }
            });
            
            console.log('Direct QR code response:', JSON.stringify(qrResponse.data).substring(0, 100) + '...');
        } catch (qrError) {
            console.log('Direct QR code error:', qrError.message);
        }
        
        // Return success with all test results
        return res.json({
            success: true,
            message: 'Evolution API tests completed',
            apiUrl: EVOLUTION_API_URL,
            instanceName: INSTANCE_NAME,
            createSuccess: createSuccess,
            createError: createError ? createError.message : null
        });
    } catch (error) {
        console.error('Error testing Evolution API:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Failed to connect to Evolution API: ' + error.message,
            apiUrl: EVOLUTION_API_URL
        });
    }
});

// Endpoint to get WhatsApp QR code or phone code
app.get('/api/whatsapp-connect', async (req, res) => {
    console.log('WhatsApp connect endpoint accessed');
    
    try {
        // First, try to create the instance (will be ignored if it already exists)
        try {
            console.log('Creating instance if it does not exist...');
            const createResponse = await axios.post(`${EVOLUTION_API_URL}/instance/create`, {
                instanceName: INSTANCE_NAME,
                integration: "WHATSAPP-BAILEYS"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': EVOLUTION_API_KEY
                }
            });
            
            console.log('Instance creation response:', JSON.stringify(createResponse.data));
        } catch (createError) {
            // If creation fails because instance already exists, that's fine
            console.log('Instance creation error (may already exist):', createError.message);
        }
        
        // Connect to the instance - this is the main endpoint we want to use
        console.log('Connecting to instance...');
        const connectResponse = await axios.get(`${EVOLUTION_API_URL}/instance/connect/${INSTANCE_NAME}`, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY
            }
        });
        
        console.log('Connection response:', JSON.stringify(connectResponse.data));
        
        // Return only the connect endpoint response
        return res.status(connectResponse.status || 200).send(connectResponse.data);
    } catch (error) {
        console.error('Error connecting to Evolution API:', error.message);
        
        // Return the error without any fallback
        if (error.response) {
            // If we have a response from the API, pass it through
            return res.status(error.response.status || 500).send(error.response.data);
        } else {
            // Otherwise return a generic error
            return res.status(500).json({
                error: 'Failed to connect to WhatsApp API',
                details: error.message
            });
        }
    }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
    console.log(`Server should be accessible at http://localhost:${PORT}`);
});