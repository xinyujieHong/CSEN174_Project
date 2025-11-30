# CampusPool Backend - Complete Setup Guide

This is a **standalone Express.js backend** with no external dependencies like Supabase. All you need is Node.js!

## 🚀 Quick Setup (3 steps)

### Option A: Automated Setup (Recommended)

```bash
cd backend
chmod +x setup.sh
./setup.sh
npm start
```

### Option B: Manual Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit and set your JWT_SECRET
   ```
   
   Generate a secure JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Start the Server**
   ```bash
   # Production
   npm start
   
   # Development (auto-reload on file changes)
   npm run dev
   ```

## ✅ Verify Installation

Open your browser or use curl:

```bash
# Health check
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","timestamp":"2025-10-27T..."}
```

## 🔌 Connect Frontend to Backend

1. **Update Frontend Config**
   
   Edit `/utils/config.ts`:
   ```typescript
   export const config = {
     apiUrl: 'http://localhost:3001/api',  // Local development
     // apiUrl: 'https://your-backend.com/api',  // Production
     pollingInterval: 5000,
   };
   ```

2. **Start Frontend**
   ```bash
   npm run dev  # From root directory
   ```

## 📊 Data Storage

By default, the backend uses **in-memory storage**:
- ✅ Zero configuration
- ✅ Perfect for prototyping
- ⚠️ Data is lost when server restarts

### Upgrade to Persistent Database

The `DataStore` class is designed to be easily replaced. See examples in `dataStore.js` for:
- PostgreSQL
- MongoDB
- MySQL
- SQLite

## 🛠️ API Endpoints

All endpoints are prefixed with `/api`:

### Authentication (No auth required)
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in

### Authenticated Routes (Require Bearer token)
- `GET /api/auth/session` - Get current user
- `POST /api/auth/signout` - Sign out
- `GET /api/users/:userId` - Get user profile
- `POST /api/users/:userId` - Update profile
- `GET /api/carpool-requests` - List all requests
- `POST /api/carpool-requests` - Create request
- `PUT /api/carpool-requests/:id` - Update request
- `DELETE /api/carpool-requests/:id` - Delete request
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/conversations/:id/messages` - Send message
- `PUT /api/conversations/:id` - Update conversation

## 🧪 Testing the API

### Sign Up
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "password": "secure123",
    "name": "John Doe"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "password": "secure123"
  }'
```

Save the token from the response!

### Create Profile
```bash
curl -X POST http://localhost:3001/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "John Doe",
    "college": "State University",
    "hasCar": true,
    "carModel": "Honda Civic",
    "carColor": "Blue"
  }'
```

## 🚢 Deployment

### Heroku
```bash
# Install Heroku CLI, then:
heroku create campuspool-api
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
git subtree push --prefix backend heroku main
```

### Render
1. Create new Web Service
2. Build Command: `cd backend && npm install`
3. Start Command: `cd backend && npm start`
4. Add environment variable: `JWT_SECRET`

### Railway
```bash
railway init
railway up
railway variables set JWT_SECRET=your-secret-here
```

### Docker
```bash
cd backend
docker build -t campuspool-backend .
docker run -p 3001:3001 -e JWT_SECRET=your-secret campuspool-backend
```

Create `Dockerfile` in `/backend`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔒 Production Checklist

- [ ] Change JWT_SECRET to a secure random value
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for your frontend domain only
- [ ] Add rate limiting (see comments in server.js)
- [ ] Use a persistent database (PostgreSQL, MongoDB, etc.)
- [ ] Set up database backups
- [ ] Add monitoring and error tracking (Sentry, LogRocket, etc.)
- [ ] Implement token refresh mechanism
- [ ] Add input validation middleware

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001
# Kill it
kill -9 PID
# Or use a different port
PORT=3002 npm start
```

### CORS Errors
Add your frontend URL to CORS configuration in `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000'  // Your frontend URL
}));
```

### Authentication Errors
- Make sure you're including the token in the Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN`
- Check that JWT_SECRET matches between requests

## 📚 Architecture

```
Frontend (React) 
    ↓ HTTP/REST
Backend (Express.js)
    ↓
DataStore (In-Memory → can be replaced with any DB)
```

## 🤝 Support

For issues or questions:
1. Check server logs: `npm start` (watch console output)
2. Test health endpoint: `curl http://localhost:3001/health`
3. Review API documentation in README.md

## 📄 License

MIT
