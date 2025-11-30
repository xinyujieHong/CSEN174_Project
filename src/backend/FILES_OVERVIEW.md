# CampusPool Backend - Files Overview

Complete guide to all backend files and their purposes.

---

## 📁 Core Application Files

### `server.js`
**Purpose:** Main Express.js server application  
**What it does:**
- Sets up Express server with middleware (CORS, JSON parsing)
- Implements JWT authentication
- Defines all API routes (auth, profiles, carpools, messaging)
- Error handling and logging
- Starts the server on specified port

**Key Features:**
- Authentication endpoints (signup, signin, session)
- User profile management
- Carpool request CRUD operations
- Messaging system with conversations
- Protected routes with JWT middleware

**Start server:**
```bash
npm start          # Production
npm run dev        # Development with auto-reload
```

---

### `dataStore.js`
**Purpose:** Data storage layer (currently in-memory)  
**What it does:**
- Provides database-like interface for data operations
- Uses JavaScript Maps for in-memory storage
- Implements CRUD operations for all data types

**Data Collections:**
- `users` - User accounts with credentials
- `profiles` - User profile information
- `carpoolRequests` - Carpool request posts
- `conversations` - Message conversations
- `messages` - Individual messages

**Key Methods:**
```javascript
// Users
createUser({ email, password, name })
getUser(userId)
getUserByEmail(email)

// Profiles
getUserProfile(userId)
setUserProfile(userId, profileData)

// Carpool Requests
createCarpoolRequest(requestData)
getCarpoolRequests()
updateCarpoolRequest(requestId, updates)
deleteCarpoolRequest(requestId)

// Conversations & Messages
createConversation(conversationData)
getConversations(userId)
createMessage(messageData)
getMessages(conversationId)
```

**Replace with real database:**
Examples provided in the file for PostgreSQL, MongoDB, and MySQL

---

## 📋 Configuration Files

### `package.json`
**Purpose:** Node.js project configuration  
**Dependencies:**
- `express` - Web framework
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

**Scripts:**
```bash
npm start    # Start server (production)
npm run dev  # Start with auto-reload (development)
npm test     # Run tests (placeholder)
```

---

### `.env.example`
**Purpose:** Template for environment variables  
**Variables:**
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT tokens (MUST change in production)

**Usage:**
```bash
cp .env.example .env
# Edit .env with your values
```

---

### `.env`
**Purpose:** Actual environment variables (NOT committed to Git)  
**Created by:** Copying `.env.example` or running `setup.sh`  
**Security:** Never commit this file to Git!

---

### `.gitignore`
**Purpose:** Files to exclude from Git  
**Excludes:**
- `node_modules/` - Dependencies
- `.env` - Environment variables
- `*.log` - Log files
- IDE and OS files

---

## 📚 Documentation Files

### `README.md`
**Purpose:** General overview and getting started  
**Contents:**
- Feature list
- Quick start guide
- API endpoints overview
- Database setup instructions
- Deployment examples
- Security considerations

**When to read:** First time setup

---

### `SETUP.md`
**Purpose:** Detailed setup instructions  
**Contents:**
- Automated and manual setup steps
- Connecting frontend to backend
- Data storage explanation
- Database migration guides
- Testing instructions
- Deployment guide
- Troubleshooting

**When to read:** Setting up the backend

---

### `API.md`
**Purpose:** Complete API reference documentation  
**Contents:**
- All endpoint specifications
- Request/response examples
- Authentication requirements
- Error response formats
- Status codes
- Usage examples in JavaScript

**When to read:** Implementing API calls or debugging

---

### `DEPLOYMENT_OPTIONS.md`
**Purpose:** Platform-specific deployment guides  
**Contents:**
- 10+ deployment platforms (Heroku, Railway, Render, etc.)
- Step-by-step instructions for each
- Database hosting options
- Cost comparisons
- Post-deployment configuration
- Security hardening
- Monitoring setup

**When to read:** Ready to deploy to production

---

### `FILES_OVERVIEW.md` (this file)
**Purpose:** Overview of all backend files  
**When to read:** Understanding the backend structure

---

## 🔧 Utility Scripts

### `setup.sh`
**Purpose:** Automated setup script  
**What it does:**
1. Checks Node.js installation
2. Installs npm dependencies
3. Creates `.env` file from template
4. Generates secure JWT secret
5. Provides next steps

**Usage:**
```bash
chmod +x setup.sh
./setup.sh
```

**Output:** Ready-to-run backend with secure configuration

---

### `test-api.sh`
**Purpose:** API testing script  
**What it does:**
1. Tests health endpoint
2. Creates test user (signup)
3. Tests signin
4. Tests session retrieval
5. Creates and updates profile
6. Creates, updates, and deletes carpool request
7. Tests messaging system
8. Displays pass/fail summary

**Usage:**
```bash
chmod +x test-api.sh
./test-api.sh
```

**Output:** 
```
🧪 CampusPool Backend API Tests
✓ PASS Health endpoint
✓ PASS Sign up successful
✓ PASS Sign in successful
...
📊 Test Summary
Tests Passed: 15
Tests Failed: 0
✨ All tests passed!
```

---

## 🐳 Docker Files

### `Dockerfile`
**Purpose:** Docker image definition  
**What it does:**
- Multi-stage build for optimization
- Creates non-root user for security
- Copies application files
- Sets up health check
- Defines startup command

**Build:**
```bash
docker build -t campuspool-backend .
```

**Run:**
```bash
docker run -p 3001:3001 -e JWT_SECRET=your-secret campuspool-backend
```

---

### `docker-compose.yml`
**Purpose:** Multi-container orchestration  
**Services:**
- `backend` - Express.js API
- `db` - PostgreSQL (optional, commented out)
- `redis` - Redis cache (optional, commented out)

**Usage:**
```bash
docker-compose up -d
```

**Benefits:**
- One command to start all services
- Automatic networking between containers
- Environment variable management

---

### `.dockerignore`
**Purpose:** Files to exclude from Docker build  
**Why:** 
- Reduces image size
- Speeds up build process
- Prevents sensitive data in image

---

## 📊 File Dependency Tree

```
package.json
├── server.js (main entry point)
│   ├── dataStore.js (data layer)
│   └── .env (environment config)
│
├── Documentation
│   ├── README.md (overview)
│   ├── SETUP.md (detailed setup)
│   ├── API.md (API reference)
│   ├── DEPLOYMENT_OPTIONS.md (deployment guide)
│   └── FILES_OVERVIEW.md (this file)
│
├── Scripts
│   ├── setup.sh (automated setup)
│   └── test-api.sh (API testing)
│
└── Docker
    ├── Dockerfile (image definition)
    ├── docker-compose.yml (orchestration)
    └── .dockerignore (build exclusions)
```

---

## 🎯 Quick Reference

### Starting the Backend
```bash
cd backend
npm install        # Install dependencies
npm start          # Start server
```

### Testing the Backend
```bash
./test-api.sh      # Run all tests
curl http://localhost:3001/health  # Quick health check
```

### Deploying the Backend
```bash
# See DEPLOYMENT_OPTIONS.md for platform-specific guides
```

### Modifying the Backend

**Add a new endpoint:**
1. Edit `server.js`
2. Add route handler
3. Update `API.md` documentation

**Change data storage:**
1. Edit `dataStore.js`
2. Implement new storage backend
3. Keep the same method signatures

**Add new environment variable:**
1. Add to `.env.example`
2. Add to `.env`
3. Use in `server.js` via `process.env.VARIABLE_NAME`

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Frontend (React)               │
│              http://localhost:3000              │
└───────────────────┬─────────────────────────────┘
                    │ HTTP/REST API
                    │ JWT Authorization
                    ↓
┌─────────────────────────────────────────────────┐
│            Backend (Express.js)                 │
│          http://localhost:3001/api              │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Routes (server.js)                     │   │
│  │  - Authentication (JWT)                 │   │
│  │  - User Profiles                        │   │
│  │  - Carpool Requests                     │   │
│  │  - Messaging                            │   │
│  └──────────────────┬──────────────────────┘   │
│                     │                           │
│  ┌─────────────────↓──────────────────────┐   │
│  │  Data Layer (dataStore.js)             │   │
│  │  - In-Memory Maps (default)            │   │
│  │  - OR PostgreSQL, MongoDB, etc.        │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example

1. **Frontend** makes request:
   ```javascript
   fetch('http://localhost:3001/api/carpool-requests', {
     headers: { 'Authorization': 'Bearer token123...' }
   })
   ```

2. **server.js** receives request:
   - Checks CORS
   - Parses JSON
   - Logs request
   - Validates JWT token
   - Calls route handler

3. **Route handler** processes:
   - Validates request data
   - Calls `dataStore.js` methods
   - Returns response

4. **dataStore.js** handles data:
   - Gets/sets data in storage
   - Returns data to route handler

5. **Response** sent to frontend:
   ```json
   {
     "data": [...],
     "status": "success"
   }
   ```

---

## 🔐 Security Files

### JWT Token Flow

```
Sign Up / Sign In
      ↓
  server.js generates JWT
  (using JWT_SECRET from .env)
      ↓
  Token sent to frontend
      ↓
  Frontend stores token
  (localStorage)
      ↓
  Frontend includes token
  in Authorization header
      ↓
  server.js validates token
  (using JWT_SECRET)
      ↓
  Request processed
```

---

## 🎓 Learning Resources

### For Beginners
1. Start with `README.md`
2. Run `setup.sh`
3. Test with `test-api.sh`
4. Read `API.md` to understand endpoints

### For Developers
1. Study `server.js` - main application logic
2. Study `dataStore.js` - data layer
3. Read `API.md` - endpoint specifications
4. Modify and test

### For DevOps
1. Review `Dockerfile` and `docker-compose.yml`
2. Read `DEPLOYMENT_OPTIONS.md`
3. Choose deployment platform
4. Configure environment variables

---

## 📝 Notes

### In-Memory Storage
- ⚠️ Data lost on server restart
- ✅ Perfect for development/testing
- ❌ Not suitable for production
- 🔄 Replace with real database for production

### JWT Secrets
- ⚠️ MUST be changed from default
- 🔐 Use strong random value
- 🔄 Rotate periodically
- ❌ Never commit to Git

### CORS Configuration
- ⚠️ Currently allows all origins
- 🔒 Restrict to frontend domain in production
- 📝 Edit in `server.js`

---

## ✅ File Checklist

Essential files for backend:
- [x] `server.js` - Main application
- [x] `dataStore.js` - Data layer
- [x] `package.json` - Dependencies
- [x] `.env.example` - Config template
- [x] `.gitignore` - Git exclusions

Documentation:
- [x] `README.md` - Overview
- [x] `SETUP.md` - Setup guide
- [x] `API.md` - API reference
- [x] `DEPLOYMENT_OPTIONS.md` - Deployment
- [x] `FILES_OVERVIEW.md` - This file

Scripts:
- [x] `setup.sh` - Automated setup
- [x] `test-api.sh` - API testing

Docker:
- [x] `Dockerfile` - Image build
- [x] `docker-compose.yml` - Orchestration
- [x] `.dockerignore` - Build exclusions

---

## 🎯 Next Steps

1. **Setup:** Run `./setup.sh` or follow `SETUP.md`
2. **Test:** Run `./test-api.sh`
3. **Develop:** Modify `server.js` and `dataStore.js` as needed
4. **Deploy:** Follow `DEPLOYMENT_OPTIONS.md`
5. **Monitor:** Set up logging and monitoring

---

## 📞 Support

If you have questions:
1. Check relevant documentation file
2. Review `API.md` for endpoint details
3. Test with `test-api.sh`
4. Check server logs in terminal

---

**Happy coding! 🚀**
