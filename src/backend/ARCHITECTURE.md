# CampusPool Backend - Architecture Documentation

## 🏗️ System Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────┐
│                       USER'S BROWSER                          │
│                    http://localhost:3000                      │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │         CampusPool Frontend (React + Tailwind)         │  │
│  │  - Login/Signup pages                                  │  │
│  │  - Profile pages                                       │  │
│  │  - Feed page (carpool requests)                        │  │
│  │  - Messages page                                       │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        │ HTTP REST API
                        │ JSON requests/responses
                        │ Authorization: Bearer <JWT>
                        │
┌───────────────────────▼──────────────────────────────────────┐
│               CampusPool Backend (Express.js)                 │
│                http://localhost:3001/api                      │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                 API Routes (server.js)                 │  │
│  │                                                        │  │
│  │  Authentication:                                       │  │
│  │    POST /api/auth/signup                              │  │
│  │    POST /api/auth/signin                              │  │
│  │    GET  /api/auth/session                             │  │
│  │                                                        │  │
│  │  User Profiles:                                        │  │
│  │    GET  /api/users/:userId                            │  │
│  │    POST /api/users/:userId                            │  │
│  │                                                        │  │
│  │  Carpool Requests:                                     │  │
│  │    GET    /api/carpool-requests                       │  │
│  │    POST   /api/carpool-requests                       │  │
│  │    PUT    /api/carpool-requests/:id                   │  │
│  │    DELETE /api/carpool-requests/:id                   │  │
│  │                                                        │  │
│  │  Messaging:                                            │  │
│  │    GET  /api/conversations                            │  │
│  │    GET  /api/conversations/:id/messages               │  │
│  │    POST /api/conversations/:id/messages               │  │
│  │    PUT  /api/conversations/:id                        │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                       │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │              Middleware Layer                          │  │
│  │  - CORS (Cross-Origin Resource Sharing)               │  │
│  │  - JSON Body Parser                                    │  │
│  │  - JWT Authentication Validator                        │  │
│  │  - Request Logger                                      │  │
│  │  - Error Handler                                       │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                       │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │           Data Storage (dataStore.js)                  │  │
│  │                                                        │  │
│  │  In-Memory Storage (Default):                          │  │
│  │    - users (Map)                                       │  │
│  │    - profiles (Map)                                    │  │
│  │    - carpoolRequests (Map)                             │  │
│  │    - conversations (Map)                               │  │
│  │    - messages (Map)                                    │  │
│  │                                                        │  │
│  │  Can be replaced with:                                 │  │
│  │    - PostgreSQL                                        │  │
│  │    - MongoDB                                           │  │
│  │    - MySQL                                             │  │
│  │    - Firebase                                          │  │
│  │    - Any database                                      │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### Example: User Creates a Carpool Request

```
1. USER ACTION
   User clicks "Create Request" button in frontend
   
2. FRONTEND
   ↓ Calls API with fetch()
   POST http://localhost:3001/api/carpool-requests
   Headers: {
     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
     'Content-Type': 'application/json'
   }
   Body: {
     "destination": "Downtown Campus",
     "date": "2025-11-01",
     "time": "09:00",
     "seats": 3
   }

3. BACKEND - MIDDLEWARE
   ↓ Request arrives at Express server
   ↓ CORS middleware: Checks origin ✓
   ↓ JSON parser: Parses request body ✓
   ↓ Logger: Logs "POST /api/carpool-requests" ✓
   ↓ Auth middleware: Validates JWT token ✓
      - Extracts token from Authorization header
      - Verifies signature with JWT_SECRET
      - Decodes user info (userId, email)
      - Attaches req.user = { userId, email }

4. BACKEND - ROUTE HANDLER
   ↓ server.js route handler executes
   ↓ Validates request data
   ↓ Adds userId from req.user
   ↓ Adds createdAt timestamp
   
5. DATA LAYER
   ↓ Calls dataStore.createCarpoolRequest()
   ↓ Generates UUID for request
   ↓ Stores in carpoolRequests Map
   ↓ Returns request ID

6. BACKEND - RESPONSE
   ↓ Formats response:
   {
     "message": "Carpool request created successfully",
     "request": {
       "id": "abc-123-xyz",
       "userId": "user-456",
       "destination": "Downtown Campus",
       ...
     }
   }
   ↓ Sends HTTP 201 Created

7. FRONTEND
   ↓ Receives response
   ↓ Updates UI
   ↓ Shows success message
   ↓ Adds request to feed
```

---

## 🔐 Authentication Flow

### Sign Up Flow

```
┌─────────┐
│ User    │ Enters email, password, name
└────┬────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│ Frontend (SignupPage.tsx)                   │
│                                             │
│ POST /api/auth/signup                       │
│ Body: { email, password, name }             │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│ Backend (server.js)                         │
│                                             │
│ 1. Validate input                           │
│ 2. Check if user exists                     │
│ 3. Hash password (bcrypt)                   │
│ 4. Store user in dataStore                  │
│ 5. Generate JWT token                       │
│    jwt.sign({ userId, email }, JWT_SECRET)  │
│ 6. Return { user, token }                   │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│ Frontend (API Client)                       │
│                                             │
│ 1. Store token in localStorage              │
│ 2. Store user in localStorage               │
│ 3. Redirect to profile setup                │
└─────────────────────────────────────────────┘
```

### Authenticated Request Flow

```
┌─────────┐
│ User    │ Makes any request
└────┬────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│ Frontend                                     │
│                                             │
│ 1. Get token from localStorage               │
│ 2. Add to Authorization header              │
│    'Bearer <token>'                         │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│ Backend - authenticateToken middleware      │
│                                             │
│ 1. Extract token from header                │
│ 2. Verify with jwt.verify()                 │
│ 3. Decode user info                         │
│ 4. Attach to req.user                       │
│ 5. Call next() or return 401                │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│ Backend - Route Handler                     │
│                                             │
│ Has access to req.user.userId               │
│ Can verify ownership, permissions, etc.     │
└─────────────────────────────────────────────┘
```

---

## 📦 Data Models

### User
```javascript
{
  id: "uuid-v4",              // Auto-generated
  email: "student@edu.com",   // Unique, required
  password: "hashed-password", // bcrypt hash, required
  name: "John Doe",           // Display name, required
  createdAt: "2025-10-27T..."  // Auto-generated
}
```

### User Profile
```javascript
{
  userId: "uuid-v4",           // References User.id
  name: "John Doe",
  college: "State University",
  hasCar: true,                // Boolean
  
  // If hasCar = true:
  carModel: "Honda Civic",
  carColor: "Blue",
  carYear: "2020",
  carLicense: "ABC123",
  
  bio: "Happy to give rides!",
  profilePicture: "https://...",
  updatedAt: "2025-10-27T..."   // Auto-updated
}
```

### Carpool Request
```javascript
{
  id: "uuid-v4",               // Auto-generated
  userId: "uuid-v4",           // References User.id
  userName: "John Doe",
  userPicture: "https://...",
  destination: "Downtown Campus",
  date: "2025-11-01",          // ISO date string
  time: "09:00",               // HH:MM format
  seats: 3,                    // Number of available seats
  notes: "Leaving from North",
  responses: ["user-id-1", "user-id-2"],  // Array of user IDs
  createdAt: "2025-10-27T..."  // Auto-generated
}
```

### Conversation
```javascript
{
  id: "conversation-id",       // Usually "userId1-userId2"
  participants: ["user-id-1", "user-id-2"],
  status: "pending",           // "pending" | "accepted" | "denied"
  createdAt: "2025-10-27T..."
}
```

### Message
```javascript
{
  id: "uuid-v4",               // Auto-generated
  conversationId: "conv-id",   // References Conversation.id
  senderId: "user-id",         // References User.id
  content: "Hi! Can I get a ride?",
  createdAt: "2025-10-27T..."  // Auto-generated
}
```

---

## 🔑 Security Architecture

### Password Security
```
User enters password
      ↓
Frontend sends to backend (over HTTPS in production)
      ↓
Backend hashes with bcrypt (10 rounds)
      ↓
Stores hash in dataStore (never stores plain password)
      ↓
For login: bcrypt.compare(entered, stored)
```

### JWT Token Security
```
Token Generation:
  jwt.sign(
    { userId, email },        ← Payload (not sensitive data)
    JWT_SECRET,               ← Secret key (from .env)
    { expiresIn: '7d' }       ← Expiration
  )

Token Verification:
  jwt.verify(token, JWT_SECRET)
    → Throws error if:
      - Token expired
      - Token signature invalid
      - Token tampered with
```

### Request Authorization
```
Every protected endpoint:
  1. Checks Authorization header exists
  2. Extracts token
  3. Verifies token signature
  4. Checks token not expired
  5. Decodes user info
  6. Proceeds with request
  
If any step fails → 401 Unauthorized
```

---

## 🗃️ Data Storage Architecture

### Current: In-Memory (Default)

```
┌─────────────────────────────────────────────┐
│         DataStore (In-Memory)               │
│                                             │
│  users = new Map([                          │
│    "user-id-1" => { id, email, ... },       │
│    "user-id-2" => { id, email, ... }        │
│  ])                                         │
│                                             │
│  profiles = new Map([                       │
│    "user-id-1" => { userId, name, ... }     │
│  ])                                         │
│                                             │
│  carpoolRequests = new Map([                │
│    "request-id-1" => { id, userId, ... }    │
│  ])                                         │
│                                             │
│  conversations = new Map([...])             │
│  messages = new Map([...])                  │
│                                             │
│  ⚠️ Data lost on server restart             │
└─────────────────────────────────────────────┘
```

### Future: PostgreSQL (Example)

```
┌─────────────────────────────────────────────┐
│         PostgreSQL Database                  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Table: users                        │   │
│  │ - id (UUID, PRIMARY KEY)            │   │
│  │ - email (VARCHAR, UNIQUE)           │   │
│  │ - password (VARCHAR)                │   │
│  │ - name (VARCHAR)                    │   │
│  │ - created_at (TIMESTAMP)            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Table: profiles                     │   │
│  │ - user_id (UUID, FK → users.id)     │   │
│  │ - college (VARCHAR)                 │   │
│  │ - has_car (BOOLEAN)                 │   │
│  │ - ...                               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ✅ Data persists across restarts           │
│  ✅ ACID transactions                       │
│  ✅ Backups and replication                 │
└─────────────────────────────────────────────┘
```

---

## 🌐 Deployment Architecture

### Development
```
Laptop/Desktop
├── Terminal 1: Backend (http://localhost:3001)
│   └── npm start
│
├── Terminal 2: Frontend (http://localhost:3000)
│   └── npm run dev
│
└── Browser: http://localhost:3000
    └── Talks to backend at localhost:3001
```

### Production
```
                     Internet
                        │
                        ▼
┌───────────────────────────────────────────┐
│           CDN / Frontend Host             │
│         (Vercel, Netlify, etc.)           │
│      https://campuspool.vercel.app        │
│                                           │
│  Static React App served globally         │
└───────────────┬───────────────────────────┘
                │
                │ API Calls
                ▼
┌───────────────────────────────────────────┐
│          Backend API Server               │
│         (Railway, Heroku, etc.)           │
│   https://campuspool-api.railway.app      │
│                                           │
│  Express.js server running 24/7           │
└───────────────┬───────────────────────────┘
                │
                │ Database Queries
                ▼
┌───────────────────────────────────────────┐
│         Database Server                   │
│     (PostgreSQL, MongoDB, etc.)           │
│                                           │
│  Persistent data storage                  │
└───────────────────────────────────────────┘
```

---

## 📊 Scalability Architecture

### Current (Single Server)
```
All Users → Single Backend Server → In-Memory Storage
            (Fine for 10-100 users)
```

### Scaled (Multiple Servers)
```
              Load Balancer
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
    Server 1   Server 2   Server 3
        │          │          │
        └──────────┼──────────┘
                   ▼
            Shared Database
          (PostgreSQL + Redis)
```

### Microservices (Future)
```
API Gateway
    │
    ├─→ Auth Service (signup, signin)
    ├─→ Profile Service (user profiles)
    ├─→ Carpool Service (requests)
    ├─→ Messaging Service (conversations, messages)
    │
    └─→ Each service has its own database
```

---

## 🔧 Middleware Stack

### Request Processing Pipeline

```
Incoming Request
       │
       ▼
┌──────────────────────────┐
│ CORS Middleware          │  Allows cross-origin requests
│ app.use(cors())          │  from frontend domain
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│ JSON Parser              │  Parses request body
│ app.use(express.json())  │  Makes available as req.body
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│ Request Logger           │  Logs all incoming requests
│ Custom middleware        │  Timestamp + method + path
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│ JWT Auth (if needed)     │  Validates JWT token
│ authenticateToken()      │  Attaches user to req.user
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│ Route Handler            │  Your business logic
│ async (req, res) => {}   │  Processes request
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│ Error Handler            │  Catches any errors
│ app.use((err,...) => {}) │  Returns 500 with message
└──────────┬───────────────┘
           ▼
    Response to Client
```

---

## 🔄 Real-Time Updates Architecture

### Current: Polling

```
Frontend                      Backend
   │                            │
   │ GET /api/carpool-requests  │
   ├────────────────────────────>
   │                            │
   │         [requests]         │
   <────────────────────────────┤
   │                            │
   │ Wait 5 seconds...          │
   │                            │
   │ GET /api/carpool-requests  │
   ├────────────────────────────>
   │                            │
   │         [requests]         │
   <────────────────────────────┤
   │                            │
   (Repeat every 5 seconds)
```

### Future: WebSocket (More Efficient)

```
Frontend                      Backend
   │                            │
   │ WebSocket Connect          │
   ├────────────────────────────>
   │        Connected           │
   <────────────────────────────┤
   │                            │
   │  (Keep connection open)    │
   │<──────────────────────────>│
   │                            │
   │  New request created       │
   <────────────────────────────┤
   │  (Push notification)       │
   │                            │
   │  New message received      │
   <────────────────────────────┤
   │  (Push notification)       │
```

---

## 🧩 Component Interaction

### Creating a Carpool Request

```
FeedPage Component (Frontend)
        │
        │ User fills form
        ▼
    onClick handler
        │
        ├─> Validates input
        │
        ├─> Calls API client
        │   carpoolAPI.createRequest()
        │
        ▼
API Client (/utils/api/client.ts)
        │
        ├─> Gets JWT token from localStorage
        │
        ├─> Makes POST request
        │   fetch('http://localhost:3001/api/carpool-requests', {
        │     headers: { 'Authorization': 'Bearer <token>' },
        │     body: JSON.stringify(requestData)
        │   })
        │
        ▼
Express Backend (server.js)
        │
        ├─> CORS check ✓
        ├─> Parse JSON ✓
        ├─> Log request ✓
        ├─> Verify JWT ✓
        │
        ├─> Route: POST /api/carpool-requests
        │   │
        │   ├─> Validate data
        │   ├─> Add userId from token
        │   ├─> Add timestamp
        │   │
        │   ▼
        │   dataStore.createCarpoolRequest()
        │   │
        │   ├─> Generate ID
        │   ├─> Store in Map
        │   ├─> Return ID
        │   │
        │   ▼
        │   Return response
        │
        ▼
Response flows back to Frontend
        │
        ├─> API client receives response
        │
        ├─> Returns to FeedPage
        │
        ▼
FeedPage updates UI
        │
        ├─> Shows success message
        ├─> Refreshes feed
        └─> Closes form
```

---

## 📈 Performance Considerations

### Current Performance

```
Bottlenecks:
- In-memory storage (limited by RAM)
- Single server (no load balancing)
- No caching
- Polling for real-time updates

Good for: 1-100 concurrent users
```

### Optimization Strategies

```
1. Add Caching
   ┌─────────────────────────┐
   │ Redis Cache             │
   │ - User profiles         │
   │ - Recent requests       │
   │ - Session data          │
   └─────────────────────────┘

2. Add CDN
   ┌─────────────────────────┐
   │ Cloudflare / AWS         │
   │ - Static assets         │
   │ - API responses         │
   └─────────────────────────┘

3. Database Indexing
   CREATE INDEX idx_user_email ON users(email);
   CREATE INDEX idx_request_date ON carpool_requests(date);

4. Connection Pooling
   const pool = new Pool({
     max: 20,
     idleTimeoutMillis: 30000
   });

5. WebSocket for Real-Time
   Replace polling with Socket.IO
```

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────┐
│ 1. HTTPS (Transport Layer)              │
│    Encrypts all data in transit         │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│ 2. CORS (Cross-Origin Protection)       │
│    Only allows requests from frontend   │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│ 3. JWT Authentication                   │
│    Verifies user identity               │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│ 4. Authorization Checks                 │
│    Verifies user permissions            │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│ 5. Input Validation                     │
│    Sanitizes user input                 │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│ 6. Rate Limiting                        │
│    Prevents abuse                       │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│ 7. Error Handling                       │
│    No sensitive data in errors          │
└─────────────────────────────────────────┘
```

---

## 📚 Architecture Best Practices

### Followed ✅
- ✅ Separation of concerns (routes, data layer, auth)
- ✅ Middleware pattern
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Error handling
- ✅ Environment variables
- ✅ Logging

### Future Improvements 🔄
- 🔄 Input validation library (express-validator)
- 🔄 Rate limiting (express-rate-limit)
- 🔄 API versioning (/api/v1/)
- 🔄 Request ID tracking
- 🔄 Structured logging (Winston)
- 🔄 Health checks endpoint improvements
- 🔄 Monitoring and metrics
- 🔄 WebSocket for real-time

---

This architecture is designed to be simple yet scalable, allowing you to start quickly while having clear upgrade paths as your app grows! 🚀
