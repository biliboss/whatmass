# Masswhats - WhatsApp Mass Messaging Solution

This project includes:
1. A landing page for Masswhats
2. Evolution API for WhatsApp integration
3. Node.js server for handling API requests

## Landing Page

The landing page is a high-conversion landing page for Masswhats, a tool to send mass messages via WhatsApp. It's built with HTML and Tailwind CSS (loaded from CDN).

### Features

- Clean, modern design optimized for conversions
- Mobile-responsive layout
- WhatsApp connection flow with QR code and phone code
- Clear call-to-action buttons
- Testimonials section
- Pricing information
- FAQ section

### Accessing the Landing Page

The landing page is served by the Node.js server and can be accessed at:

- Landing Page URL: http://localhost:3000

## Node.js Server

The Node.js server provides a simple API for interacting with the Evolution API. It's currently running on port 3000 and can be accessed at:

- Server URL: http://localhost:3000

### Running the Server

To run the server, use the following command:

```bash
cd /workspace && node server.js
```

The server will start on port 3000 and will be accessible at http://localhost:3000.

### API Endpoints

#### Get WhatsApp QR Code
```
GET /api/whatsapp-connect
```

This endpoint returns a QR code and phone code for connecting to WhatsApp. The response format is:

```json
{
  "success": true,
  "qrcode": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://masswhats.com/connect",
  "phoneCode": "233-928"
}
```

#### Debug Endpoint
```
GET /api/debug
```

This endpoint is used for testing the server. The response format is:

```json
{
  "status": "ok",
  "message": "Debug endpoint working"
}
```

## Evolution API

The Evolution API is a powerful WhatsApp API that allows you to send mass messages programmatically. It's currently running in a Docker container and can be accessed at:

- API URL: http://work-2-ztaujthhqgvckacl.prod-runtime.all-hands.dev:12001
- API Key: `masswhats-api-key`

### Infrastructure

The Evolution API is running with the following components:
- Evolution API (latest version: 2.2.3)
- PostgreSQL database
- Redis cache

All components are running in Docker containers and are configured to work together.

### Basic Usage

#### Create an instance
```bash
curl --location 'http://work-2-ztaujthhqgvckacl.prod-runtime.all-hands.dev:12001/instance/create' \
--header 'Content-Type: application/json' \
--header 'apikey: masswhats-api-key' \
--header 'Authorization: Bearer masswhats-api-key' \
--data '{
    "instanceName": "masswhats",
    "webhook": "",
    "webhookByEvents": false,
    "events": []
}'
```

#### Get QR Code
```bash
curl --location 'http://work-2-ztaujthhqgvckacl.prod-runtime.all-hands.dev:12001/instance/qrcode/masswhats' \
--header 'Content-Type: application/json' \
--header 'apikey: masswhats-api-key' \
--header 'Authorization: Bearer masswhats-api-key'
```

#### Send a Message
```bash
curl --location 'http://work-2-ztaujthhqgvckacl.prod-runtime.all-hands.dev:12001/message/sendText/masswhats' \
--header 'Content-Type: application/json' \
--header 'apikey: masswhats-api-key' \
--header 'Authorization: Bearer masswhats-api-key' \
--data '{
    "number": "5511999999999",
    "textMessage": "Hello from Masswhats!"
}'
```

#### Send a Message to Multiple Recipients
```bash
curl --location 'http://work-2-ztaujthhqgvckacl.prod-runtime.all-hands.dev:12001/message/sendText/masswhats' \
--header 'Content-Type: application/json' \
--header 'apikey: masswhats-api-key' \
--header 'Authorization: Bearer masswhats-api-key' \
--data '{
    "numbers": ["5511999999999", "5511888888888"],
    "textMessage": "Hello from Masswhats!"
}'
```

#### Send a Message with Media
```bash
curl --location 'http://work-2-ztaujthhqgvckacl.prod-runtime.all-hands.dev:12001/message/sendMedia/masswhats' \
--header 'Content-Type: application/json' \
--header 'apikey: masswhats-api-key' \
--header 'Authorization: Bearer masswhats-api-key' \
--data '{
    "number": "5511999999999",
    "mediaMessage": {
        "mediatype": "image",
        "media": "https://example.com/image.jpg",
        "caption": "Check out this image!"
    }
}'
```

#### Send a Template Message
```bash
curl --location 'http://work-2-ztaujthhqgvckacl.prod-runtime.all-hands.dev:12001/message/sendTemplate/masswhats' \
--header 'Content-Type: application/json' \
--header 'apikey: masswhats-api-key' \
--header 'Authorization: Bearer masswhats-api-key' \
--data '{
    "number": "5511999999999",
    "templateMessage": {
        "name": "welcome_template",
        "language": {
            "code": "en_US"
        },
        "components": [
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": "John Doe"
                    }
                ]
            }
        ]
    }
}'
```

### Management Interface

You can access the Evolution API management interface at:
http://work-2-ztaujthhqgvckacl.prod-runtime.all-hands.dev:12001/manager

For more information, check the [Evolution API documentation](https://doc.evolution-api.com/).