# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (React)                  │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │ QRGenerator │  │  QRHistory   │  │  Analytics   │ │  │
│  │  └─────────────┘  └──────────────┘  └──────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Generate   │  │     List     │  │  Analytics   │     │
│  │ /api/qr/gen  │  │ /api/qr/list │  │/api/qr/ana/id│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Scan & Redirect: /api/scan/:code           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   QRCode Collection                   │  │
│  │  • shortCode (indexed)                                │  │
│  │  • originalUrl                                        │  │
│  │  • qrImageData (base64)                              │  │
│  │  • scans[] (timestamp, userAgent, IP)                │  │
│  │  • scanCount                                          │  │
│  │  • createdAt                                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. QR Code Generation Flow

```
User Input (URL)
    │
    ▼
QRGenerator Component
    │
    ▼
POST /api/qr/generate
    │
    ├─► Generate unique short code (nanoid)
    │
    ├─► Create QR code image (qrcode library)
    │   └─► Points to: /api/scan/:shortCode
    │
    ├─► Save to MongoDB
    │   └─► QRCode document with image data
    │
    └─► Return QR image + short URL
        │
        ▼
    Display to User
```

### 2. QR Code Scan Flow

```
User Scans QR Code
    │
    ▼
GET /api/scan/:shortCode
    │
    ├─► Find QR code in MongoDB
    │
    ├─► Record scan event
    │   ├─► Timestamp
    │   ├─► User Agent
    │   └─► IP Address
    │
    ├─► Increment scan counter
    │
    └─► Redirect to original URL
        │
        ▼
    User reaches destination
```

### 3. Analytics Flow

```
User Clicks "Analytics"
    │
    ▼
Navigate to /qr/:id
    │
    ▼
GET /api/qr/analytics/:id
    │
    ├─► Fetch QR code from MongoDB
    │
    ├─► Process scan data
    │   ├─► Group by date
    │   ├─► Calculate totals
    │   └─► Get recent scans
    │
    └─► Return analytics data
        │
        ▼
    Display Charts & Stats
```

## Component Hierarchy

```
app/
├── layout.tsx (Root Layout)
│   └── page.tsx (Home Page)
│       ├── QRGenerator Component
│       │   ├── Form Input
│       │   ├── Format Selection
│       │   ├── Generate Button
│       │   └── QR Display
│       │       ├── QR Image
│       │       ├── Copy URL Button
│       │       └── Download Button
│       │
│       └── QRHistory Component
│           ├── QR Code List
│           │   └── QR Card (multiple)
│           │       ├── Short Code
│           │       ├── URLs
│           │       ├── Scan Count
│           │       └── Analytics Link
│           │
│           └── Pagination Controls
│
└── qr/[id]/page.tsx (Analytics Page)
    └── Analytics Component
        ├── Header Section
        │   ├── QR Info
        │   ├── QR Image
        │   └── Action Buttons
        │
        ├── Stats Cards
        │   ├── Total Scans
        │   ├── Unique Days
        │   └── Avg Scans/Day
        │
        ├── Chart Section
        │   └── Recharts Line Chart
        │
        └── Recent Scans List
```

## API Endpoints

### POST /api/qr/generate
**Purpose:** Create new QR code  
**Input:** `{ url: string, format: 'png' | 'svg' }`  
**Output:** QR image data + short URL  
**Database:** INSERT new QRCode document

### GET /api/qr/list
**Purpose:** List all QR codes  
**Input:** Query params: `page`, `limit`  
**Output:** Array of QR codes with pagination  
**Database:** FIND with pagination

### GET /api/qr/analytics/:id
**Purpose:** Get detailed analytics  
**Input:** QR code ID  
**Output:** Full analytics data  
**Database:** FIND by ID with full scan array

### GET /api/scan/:shortCode
**Purpose:** Track scan and redirect  
**Input:** Short code from URL  
**Output:** 302 redirect  
**Database:** FIND by shortCode, UPDATE (push scan, increment count)

## Database Schema

```typescript
QRCode {
  _id: ObjectId
  shortCode: string (unique, indexed)
  originalUrl: string
  qrImageData: string (base64)
  scans: [
    {
      timestamp: Date
      userAgent?: string
      ipAddress?: string
    }
  ]
  scanCount: number
  createdAt: Date
}
```

### Indexes
- `shortCode`: Unique index for fast lookups during scans
- `createdAt`: Implicit index for sorting

## Technology Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (Next.js API Routes)
- **Database:** MongoDB
- **ODM:** Mongoose
- **QR Generation:** qrcode library
- **Short URLs:** nanoid

## Key Design Decisions

### 1. Why Next.js App Router?
- ✅ Server-side rendering for better SEO
- ✅ API routes in same codebase
- ✅ File-based routing
- ✅ Optimized for serverless

### 2. Why MongoDB?
- ✅ Flexible schema for scan data
- ✅ Easy to scale
- ✅ Great for embedded documents (scans array)
- ✅ Fast with proper indexing

### 3. Why Embedded Scans?
- ✅ Faster queries (no joins)
- ✅ Atomic updates
- ✅ Simpler data model
- ⚠️ Consider separate collection if scans > 10,000 per QR

### 4. Why Short Codes?
- ✅ Clean, shareable URLs
- ✅ Smaller QR codes (less data)
- ✅ Professional appearance
- ✅ Easy to remember

### 5. Why Base64 Storage?
- ✅ No file system needed
- ✅ Works in serverless
- ✅ Easy to serve
- ⚠️ Consider cloud storage for very high volume

## Performance Considerations

### Database
- ✅ Connection pooling implemented
- ✅ Indexed queries
- ✅ Lean queries for lists
- ✅ Pagination to limit data transfer

### Frontend
- ✅ Component-based architecture
- ✅ Proper state management
- ✅ Loading states
- ✅ Error boundaries

### API
- ✅ Efficient MongoDB queries
- ✅ Minimal data transfer
- ✅ Proper error handling
- ✅ Serverless-optimized

## Security Considerations

### Current Implementation
- ✅ Input validation
- ✅ URL validation
- ✅ Error handling
- ✅ Environment variables

### Production Recommendations
- ⚠️ Add rate limiting
- ⚠️ Implement authentication
- ⚠️ Add CORS configuration
- ⚠️ Sanitize user input
- ⚠️ Add request size limits
- ⚠️ Implement API keys

## Scalability

### Current Capacity
- **QR Codes:** Millions (MongoDB scales well)
- **Scans per QR:** ~10,000 (embedded array limit)
- **Concurrent Users:** Depends on hosting

### Scaling Strategies
1. **Horizontal Scaling:** Deploy to serverless (Vercel)
2. **Database Scaling:** Use MongoDB Atlas with auto-scaling
3. **Caching:** Add Redis for frequently accessed QR codes
4. **CDN:** Serve QR images from CDN
5. **Separate Scans:** Move to separate collection if needed

## Monitoring & Observability

### Recommended Tools
- **Application:** Vercel Analytics
- **Database:** MongoDB Atlas monitoring
- **Errors:** Sentry or similar
- **Logs:** Vercel logs or CloudWatch
- **Uptime:** UptimeRobot or Pingdom

## Deployment Architecture

```
GitHub Repository
    │
    ▼
Vercel (CI/CD)
    │
    ├─► Build Next.js app
    ├─► Deploy to Edge Network
    └─► Connect to MongoDB Atlas
        │
        ▼
    Production URL
```

## Future Enhancements

### Phase 1 (MVP+)
- User authentication
- Rate limiting
- API documentation

### Phase 2 (Growth)
- Custom QR designs
- Bulk generation
- CSV exports
- Webhooks

### Phase 3 (Enterprise)
- Team collaboration
- Advanced analytics
- White-labeling
- API access

---

This architecture is designed for:
- ✅ Easy development
- ✅ Simple deployment
- ✅ Good performance
- ✅ Future scalability
