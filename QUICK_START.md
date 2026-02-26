# Quick Start Guide

Get your Smart QR Code Generator running in 3 minutes!

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ MongoDB running (local or Atlas)

## Start in 3 Steps

### 1. Check MongoDB

**Local MongoDB:**
```bash
# Windows - MongoDB should be running as a service
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod
```

**MongoDB Atlas:**
- Update `MONGODB_URI` in `.env.local` with your connection string

### 2. Run the App

```bash
npm run dev
```

### 3. Open Browser

Go to: **http://localhost:3000**

## First Test

1. Enter a URL: `https://google.com`
2. Click "Generate QR Code"
3. Scan the QR code with your phone
4. Click "Analytics" to see the scan was tracked

## That's It! 🎉

You now have a fully functional QR code generator with analytics!

## Common Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Check for errors
npm run lint
```

## Need Help?

- 📖 Full documentation: [README.md](README.md)
- 🛠️ Setup guide: [SETUP.md](SETUP.md)
- 📊 Project details: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## Quick Troubleshooting

**MongoDB not connecting?**
```bash
# Check if MongoDB is running
mongosh
```

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Dependencies missing?**
```bash
npm install
```

## Deploy to Production

**Vercel (Recommended):**
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

---

**Happy coding!** 🚀
