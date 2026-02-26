# Quick Setup Guide

This guide will help you get the Smart QR Code Generator up and running in minutes.

## Step 1: MongoDB Setup

You have two options for MongoDB:

### Option A: Local MongoDB (Recommended for Development)

#### Windows
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will start automatically as a service
4. Verify by opening Command Prompt and running: `mongosh`

#### macOS
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongosh
```

#### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

### Option B: MongoDB Atlas (Cloud - Free Tier Available)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier M0)
4. Create a database user with password
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
7. Update `.env.local` with your connection string

## Step 2: Environment Variables

The `.env.local` file should already exist with default values:

```env
MONGODB_URI=mongodb://localhost:27017/qr-generator
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**If using MongoDB Atlas**, update `MONGODB_URI`:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/qr-generator?retryWrites=true&w=majority
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Step 3: Install Dependencies

Dependencies should already be installed, but if needed:

```bash
npm install
```

## Step 4: Run the Application

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Step 5: Test the Application

1. Open http://localhost:3000 in your browser
2. Enter a URL (e.g., `https://google.com`)
3. Click "Generate QR Code"
4. You should see a QR code with a short URL
5. Test scanning the QR code with your phone
6. Check the analytics to see the scan was tracked

## Troubleshooting

### "Failed to connect to MongoDB"

**Solution:**
- Ensure MongoDB is running: `brew services list` (macOS) or check Windows Services
- Verify `MONGODB_URI` in `.env.local` is correct
- For Atlas, check your IP is whitelisted

### "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use

**Solution:**
```bash
# Kill the process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### QR codes not generating

**Solution:**
- Check browser console for errors
- Verify MongoDB connection is working
- Ensure all dependencies are installed

## Production Deployment

### Vercel (Easiest)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NEXT_PUBLIC_BASE_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
5. Deploy!

### Other Platforms

The app works on any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

**Important:** Always use MongoDB Atlas for production deployments.

## Next Steps

- Customize the UI colors in `app/globals.css`
- Add authentication for user-specific QR codes
- Implement QR code expiration dates
- Add more analytics features (geolocation, device types, etc.)
- Set up email notifications for scan milestones

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the code comments in each file
- Open an issue on GitHub

Happy QR code generating! 🎉
