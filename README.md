# Smart QR Code Generator

A full-stack web application built with Next.js that generates trackable QR codes with real-time scan analytics. Monitor how many times your QR codes are scanned, view detailed analytics, and export QR codes in multiple formats.

![Smart QR Code Generator](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat&logo=mongodb)

## Features

✨ **QR Code Generation**
- Generate QR codes for URLs or plain text
- Support for PNG and SVG formats
- High-quality QR codes with error correction

🔗 **Short URL Generation**
- Automatic short URL creation using nanoid
- Clean, shareable links for your QR codes
- 8-character unique codes

📊 **Scan Analytics**
- Real-time scan tracking
- Detailed scan timeline with charts
- User agent and IP address logging
- Scans over time visualization

📈 **Analytics Dashboard**
- Total scan count
- Unique days with scans
- Average scans per day
- Recent scan activity
- Interactive line charts

💾 **QR Code History**
- View all generated QR codes
- Pagination support
- Quick access to analytics
- Sort by creation date

📥 **Export Functionality**
- Download QR codes as PNG or SVG
- One-click copy short URLs
- High-resolution exports

🎨 **Modern UI**
- Beautiful gradient backgrounds
- Responsive design for all devices
- Smooth animations and transitions
- Clean, intuitive interface

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **QR Generation**: qrcode library
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Short URLs**: nanoid

## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- MongoDB installed and running locally, or a MongoDB Atlas account
- npm or yarn package manager

## Installation

1. **Clone the repository** (or navigate to the project directory):

```bash
cd qr-gen
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**:

The `.env.local` file should already exist with:

```env
MONGODB_URI=mongodb://localhost:27017/qr-generator
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

If using MongoDB Atlas, update `MONGODB_URI` with your connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qr-generator
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Start MongoDB** (if running locally):

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows
net start MongoDB

# On Linux
sudo systemctl start mongod
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Usage

### Generating a QR Code

1. Navigate to the home page
2. Enter a URL or text in the input field
3. Select the desired format (PNG or SVG)
4. Click "Generate QR Code"
5. Your QR code will be displayed with a short URL
6. Copy the short URL or download the QR code

### Viewing Analytics

1. From the home page, scroll to the "QR Code History" section
2. Click the "Analytics" button on any QR code
3. View detailed statistics including:
   - Total scan count
   - Scans over time chart
   - Recent scan activity
   - User agent and IP information

### Scanning a QR Code

1. Use any QR code scanner app on your mobile device
2. Scan the generated QR code
3. You'll be redirected to the original URL
4. The scan will be automatically tracked and recorded

## Project Structure

```
qr-gen/
├── app/
│   ├── api/
│   │   ├── qr/
│   │   │   ├── generate/route.ts    # QR generation endpoint
│   │   │   ├── list/route.ts        # List all QR codes
│   │   │   └── analytics/[id]/route.ts  # Analytics endpoint
│   │   └── scan/[shortCode]/route.ts    # Scan tracking & redirect
│   ├── qr/[id]/page.tsx             # Analytics page
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Global styles
├── components/
│   ├── QRGenerator.tsx              # QR generation form
│   ├── QRHistory.tsx                # QR code history list
│   └── Analytics.tsx                # Analytics dashboard
├── lib/
│   ├── mongodb.ts                   # MongoDB connection
│   ├── qr-generator.ts              # QR generation utilities
│   └── short-url.ts                 # Short URL utilities
├── models/
│   └── QRCode.ts                    # Mongoose schema
├── .env.local                       # Environment variables
├── package.json                     # Dependencies
└── README.md                        # This file
```

## API Endpoints

### POST `/api/qr/generate`
Generate a new QR code

**Request Body:**
```json
{
  "url": "https://example.com",
  "format": "png"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "shortCode": "abc12345",
    "shortUrl": "http://localhost:3000/api/scan/abc12345",
    "qrImage": "data:image/png;base64,...",
    "originalUrl": "https://example.com",
    "scanCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET `/api/qr/list?page=1&limit=10`
List all QR codes with pagination

### GET `/api/qr/analytics/[id]`
Get detailed analytics for a specific QR code

### GET `/api/scan/[shortCode]`
Track scan and redirect to original URL

## Database Schema

```typescript
{
  shortCode: string (unique, indexed),
  originalUrl: string,
  qrImageData: string (base64),
  scans: [{
    timestamp: Date,
    userAgent: string,
    ipAddress: string
  }],
  scanCount: number,
  createdAt: Date
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXT_PUBLIC_BASE_URL`: Your production URL
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

## Troubleshooting

### MongoDB Connection Issues

If you see "Failed to connect to MongoDB":
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env.local`
- Verify network connectivity

### QR Code Not Scanning

If QR codes aren't scanning properly:
- Ensure `NEXT_PUBLIC_BASE_URL` is set correctly
- Check that the short URL is accessible
- Verify the QR code quality (try increasing size)

### Scans Not Being Tracked

If scans aren't being recorded:
- Check MongoDB connection
- Verify the scan endpoint is accessible
- Check browser console for errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- QR codes generated using [qrcode](https://github.com/soldair/node-qrcode)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)
