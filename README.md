# Mock Tive Sender

A Next.js application for generating and sending test Tive webhook payloads to the Integration API.

## Features

- Generate random Tive payloads
- Generate minimal valid payloads
- Pre-configured sample payloads (Full, Minimal, High Temperature, Low Battery, Poor Signal)
- Send individual payloads
- Send batch payloads (10 at a time)
- View send results with success/failure status
- Configurable API URL and API Key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser (or the port shown in the terminal)

## Usage

1. Enter the Integration API URL (default: `http://localhost:3000/api/webhook/tive`)
2. Enter your API Key
3. Generate a payload using one of the buttons or select a sample payload
4. Review/edit the JSON payload if needed
5. Click "Send Payload" to send a single payload, or "Send Batch" to send 10 payloads

## Configuration

The default API URL points to `http://localhost:3000/api/webhook/tive`. Make sure your Integration API is running on port 3000, or update the URL accordingly.

## Project Structure

```
mock-tive-sender/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main UI component
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── lib/
│   │   └── payload-generator.ts  # Payload generation utilities
│   └── types/
│       └── tive.ts           # TypeScript types for Tive payloads
└── README.md
```

## Notes

- This is a separate project from the Integration API
- The payloads generated follow the Tive webhook schema
- All payloads include valid timestamps and device IDs
- The application runs on a different port (3001) than the Integration API (3000)

