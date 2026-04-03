# ScanSavvy Express Backend API

Node.js Express backend for ScanSavvy coupon aggregation app. Provides REST API endpoints for QR session management, coupon operations, and store location services.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account with service role key
- Environment variables configured

### Installation

```bash
cd /app/backend
npm install
# or
yarn install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_min_32_chars
PORT=8001
NODE_ENV=development
FRONTEND_URL=https://your-frontend-url.com
```

**⚠️ IMPORTANT**: You must replace `SUPABASE_SERVICE_KEY` with your actual Supabase service role key (not the anon key). Find it in Supabase Dashboard → Settings → API → service_role key.

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

Server will start on `http://localhost:8001` (or PORT specified in .env)

## 📡 API Endpoints

### Health Check

**GET** `/health`

Check if API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-07-20T12:00:00.000Z",
  "service": "ScanSavvy API",
  "version": "1.0.0"
}
```

---

### Sessions

#### Create QR Session

**POST** `/api/sessions/create`

Generate a new QR code session with JWT token.

**Request Body:**
```json
{
  "userId": "uuid",
  "retailer": "Kroger",
  "storeId": "store-123" // optional
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "qrToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-07-20T18:00:00.000Z",
  "couponCount": 12,
  "estimatedSavings": 47.40
}
```

**Details:**
- Queries user's clipped coupons from Supabase
- Calculates estimated savings ($3.95 avg per coupon)
- Saves visit session to `visit_sessions` table
- Generates signed JWT token (6 hour expiry)
- Token contains: sessionId, userId, retailer, couponIds, savings

---

#### Validate Session

**GET** `/api/sessions/:sessionId/validate`

Validate a QR session token and retrieve session details.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "valid": true,
  "session": {
    "id": "uuid",
    "userId": "uuid",
    "storeName": "Kroger",
    "estimatedSavings": 47.50,
    "couponCount": 12,
    "createdAt": "2024-07-20T12:00:00.000Z"
  },
  "clippedCoupons": ["1", "2", "3", "8"],
  "expiresAt": "2024-07-20T18:00:00.000Z"
}
```

**Error Responses:**
- `401` - Token expired or invalid
- `404` - Session not found

---

### Coupons

#### Get Retailer Coupons

**GET** `/api/coupons/:retailer`

Fetch available coupons for a specific retailer.

**Query Parameters:**
- `category` (optional) - Filter by category (Grocery, Personal Care, etc.)
- `limit` (optional) - Max results (default: 20)

**Example:**
```
GET /api/coupons/Kroger?category=Grocery&limit=10
```

**Response:**
```json
{
  "retailer": "Kroger",
  "coupons": [
    {
      "id": "3",
      "retailer": "Kroger",
      "discount": "BOGO Free",
      "description": "Select Snacks & Beverages",
      "category": "Grocery",
      "value": 15,
      "claimed": 1567
    }
  ],
  "count": 1
}
```

---

#### Clip Coupons

**POST** `/api/coupons/clip`

Clip multiple coupons for a user.

**Request Body:**
```json
{
  "userId": "uuid",
  "couponIds": ["1", "2", "3"]
}
```

**Response:**
```json
{
  "clipped": 3,
  "success": true
}
```

**Details:**
- Inserts records into `clipped_coupons` table
- Uses upsert to handle duplicates
- Ignores already-clipped coupons

---

#### Unclip Coupon

**DELETE** `/api/coupons/unclip`

Remove a clipped coupon.

**Request Body:**
```json
{
  "userId": "uuid",
  "couponId": "1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon unclipped successfully"
}
```

---

### Stores

#### Find Nearby Stores

**GET** `/api/stores/nearby`

Find stores within a radius of given coordinates.

**Query Parameters:**
- `lat` (required) - Latitude
- `lng` (required) - Longitude
- `radius` (optional) - Search radius in miles (default: 0.5)

**Example:**
```
GET /api/stores/nearby?lat=39.9612&lng=-82.9988&radius=1
```

**Response:**
```json
{
  "stores": [
    {
      "id": "1",
      "retailer": "Kroger",
      "storeName": "Kroger - Main Street",
      "address": "123 Main St, Columbus, OH 43215",
      "lat": 39.9612,
      "lng": -82.9988,
      "distance": 0.15
    }
  ],
  "count": 1,
  "searchRadius": 1,
  "userLocation": {
    "lat": 39.9612,
    "lng": -82.9988
  }
}
```

**Details:**
- Uses Haversine formula to calculate distances
- Returns stores sorted by distance (closest first)
- Distance in miles

---

#### Get Retailer Locations

**GET** `/api/stores/:retailer/locations`

Get all locations for a specific retailer.

**Query Parameters:**
- `limit` (optional) - Max results (default: 10)

**Example:**
```
GET /api/stores/Kroger/locations?limit=5
```

**Response:**
```json
{
  "retailer": "Kroger",
  "stores": [
    {
      "id": "1",
      "retailer": "Kroger",
      "storeName": "Kroger - Main Street",
      "address": "123 Main St, Columbus, OH 43215",
      "lat": 39.9612,
      "lng": -82.9988
    }
  ],
  "count": 1
}
```

---

## 🔒 Security

### Helmet Security Headers
All responses include security headers via Helmet:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- etc.

### CORS Configuration
CORS enabled for frontend URL specified in `.env`
- Credentials: enabled
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

### JWT Token Security
- Tokens signed with `JWT_SECRET` from environment
- 6 hour expiration
- HS256 algorithm
- Validated on protected endpoints

### Authorization
Protected endpoints require `Authorization: Bearer <token>` header.

---

## 📂 Project Structure

```
/app/backend/
├── server.js              # Main Express app
├── lib/
│   └── supabase.js       # Supabase admin client
├── routes/
│   ├── sessions.js       # QR session endpoints
│   ├── coupons.js        # Coupon management
│   └── stores.js         # Store location services
├── package.json          # Dependencies
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment template
├── Procfile              # Deployment config
└── README.md             # This file
```

---

## 🗄️ Database Schema

The API interacts with these Supabase tables:

### `visit_sessions`
```sql
- id (UUID)
- user_id (UUID, references auth.users)
- store_name (TEXT)
- estimated_savings (NUMERIC)
- coupon_count (INTEGER)
- created_at (TIMESTAMP)
```

### `clipped_coupons`
```sql
- id (UUID)
- user_id (UUID, references auth.users)
- coupon_id (TEXT)
- created_at (TIMESTAMP)
UNIQUE(user_id, coupon_id)
```

---

## 🧪 Testing Endpoints

### Test Health Check
```bash
curl http://localhost:8001/health
```

### Test Session Creation
```bash
curl -X POST http://localhost:8001/api/sessions/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "retailer": "Kroger"
  }'
```

### Test Nearby Stores
```bash
curl "http://localhost:8001/api/stores/nearby?lat=39.9612&lng=-82.9988&radius=1"
```

### Test Get Coupons
```bash
curl http://localhost:8001/api/coupons/Kroger
```

### Test Clip Coupons
```bash
curl -X POST http://localhost:8001/api/coupons/clip \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "couponIds": ["1", "2", "3"]
  }'
```

---

## 🚢 Deployment

### Using Procfile (Heroku, Railway, etc.)
```
web: node server.js
```

### Environment Variables
Set these in your deployment platform:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`
- `PORT` (usually auto-set by platform)
- `NODE_ENV=production`
- `FRONTEND_URL`

### Build Command
```bash
npm install
```

### Start Command
```bash
npm start
```

---

## 📝 Notes

- **Mock Data**: Coupons and store locations are currently mocked. Replace with real data in production.
- **Service Role Key**: API uses Supabase service role key which bypasses Row Level Security (RLS). Handle with care.
- **JWT Secret**: Generate a strong random secret for production (min 32 characters).
- **Port Conflict**: If port 8001 is in use, change `PORT` in `.env`.

---

## 🛠️ Dependencies

```json
{
  "express": "^4.18.2",
  "@supabase/supabase-js": "^2.39.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "helmet": "^7.1.0"
}
```

---

## 📄 License

MIT

---

**Built for ScanSavvy** - All Your Coupons. One QR Code.
