# CampusPool Backend - Quick Start Guide

This guide will help you get the CampusPool backend up and running in **less than 5 minutes**.

## 🎯 What You're Getting

A complete, standalone Express.js backend with:
- ✅ **Zero external dependencies** (no Supabase, no database setup required)
- ✅ **JWT authentication** (signup, signin, sessions)
- ✅ **In-memory data storage** (perfect for prototyping)
- ✅ **RESTful API** for all CampusPool features
- ✅ **CORS enabled** (works with your React frontend)
- ✅ **Easy to deploy** (Heroku, Railway, Render, Docker, etc.)

## 🚀 Method 1: Automatic Setup (Recommended)

**Time: 2 minutes**

```bash
cd backend
chmod +x setup.sh
./setup.sh
npm start
```

✅ Done! Your backend is running at `http://localhost:3001`

Test it:
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","timestamp":"..."}
```

---

## 🛠️ Method 2: Manual Setup

**Time: 3 minutes**

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Create Environment File
```bash
cp .env.example .env
```

Edit `.env` and set your JWT secret:
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and paste into .env:
JWT_SECRET=your-generated-secret-here
```

### Step 3: Start the Server
```bash
npm start
```

✅ Server running at `http://localhost:3001`

---

## 🧪 Test the Backend

Run the automated test suite:
```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

This tests:
- Health check
- User signup/signin
- Profile creation
- Carpool requests
- Messaging system

---

## 🔌 Connect Frontend to Backend

### Update Frontend Configuration

Edit `/utils/config.ts`:
```typescript
export const config = {
  apiUrl: 'http://localhost:3001/api',  // ← Your backend URL
  pollingInterval: 5000,
};
```

### Start the Full App

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
# From project root
npm run dev
```

🎉 **Open** `http://localhost:3000` in your browser!

---

## 📁 Backend File Structure

```
backend/
├── server.js           # Main Express server
├── dataStore.js        # In-memory data storage
├── package.json        # Dependencies
├── .env               # Environment variables (create from .env.example)
├── .env.example       # Template
├── README.md          # Full documentation
├── SETUP.md           # Detailed setup guide
├── API.md             # Complete API reference
├── setup.sh           # Automated setup script
├── test-api.sh        # API testing script
├── Dockerfile         # Docker deployment
└── docker-compose.yml # Docker Compose config
```

---

## 🌐 Deploy to Production

### Option 1: Heroku
```bash
cd backend
heroku create campuspool-api
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
git subtree push --prefix backend heroku main
```

### Option 2: Railway
```bash
cd backend
railway init
railway up
```
Then add `JWT_SECRET` in Railway dashboard.

### Option 3: Render
1. Create new Web Service
2. Connect your repo
3. Build Command: `cd backend && npm install`
4. Start Command: `cd backend && npm start`
5. Add environment variable: `JWT_SECRET`

### Option 4: Docker
```bash
cd backend
docker build -t campuspool-backend .
docker run -p 3001:3001 -e JWT_SECRET=your-secret campuspool-backend
```

Or use Docker Compose:
```bash
cd backend
docker-compose up -d
```

**After deploying**, update your frontend config:
```typescript
export const config = {
  apiUrl: 'https://your-backend-url.com/api',  // ← Your production URL
};
```

---

## 📖 API Endpoints Overview

All endpoints prefixed with `/api`:

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/session` - Get current user
- `POST /api/auth/signout` - Sign out

### Profiles
- `GET /api/users/:userId` - Get profile
- `POST /api/users/:userId` - Update profile

### Carpool Requests
- `GET /api/carpool-requests` - List all requests
- `POST /api/carpool-requests` - Create request
- `PUT /api/carpool-requests/:id` - Update request
- `DELETE /api/carpool-requests/:id` - Delete request

### Messaging
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/conversations/:id/messages` - Send message
- `PUT /api/conversations/:id` - Update conversation status

**Full API documentation:** See `backend/API.md`

---

## 🔒 Important Notes

### Data Persistence
⚠️ The backend uses **in-memory storage** by default. Data is **lost when the server restarts**.

This is perfect for:
- ✅ Development
- ✅ Testing
- ✅ Prototyping
- ✅ Demos

For production, replace `DataStore` in `dataStore.js` with:
- PostgreSQL
- MongoDB
- MySQL
- Firebase
- Supabase

Examples are provided in `dataStore.js`.

### Security
For production deployments:
- ✅ Set a strong `JWT_SECRET`
- ✅ Enable HTTPS
- ✅ Configure CORS for your domain only
- ✅ Add rate limiting
- ✅ Use a real database with backups

---

## 🐛 Troubleshooting

### "Port 3001 already in use"
```bash
# Find and kill the process
lsof -i :3001
kill -9 <PID>

# Or use a different port
PORT=3002 npm start
```

### "CORS error" from frontend
Make sure your backend CORS is configured correctly in `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000'  // Your frontend URL
}));
```

### "Unauthorized" errors
- Check that you're including the token: `Authorization: Bearer <token>`
- Verify the token is valid (not expired)
- Make sure `JWT_SECRET` is set correctly

### Backend not starting
```bash
# Check Node.js version (need 16+)
node -v

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 💡 Next Steps

1. **Run the backend**: `cd backend && npm start`
2. **Test the API**: `./test-api.sh`
3. **Start the frontend**: `npm run dev` (from project root)
4. **Read the docs**:
   - `backend/README.md` - General info
   - `backend/SETUP.md` - Detailed setup
   - `backend/API.md` - API reference

---

## 🤝 Need Help?

1. Check backend logs in the terminal
2. Test health endpoint: `curl http://localhost:3001/health`
3. Run test suite: `./test-api.sh`
4. Review API docs: `backend/API.md`

---

## ✨ You're All Set!

Your CampusPool backend is ready to go. Start building amazing carpool features! 🚗💨
