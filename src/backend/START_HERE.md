# 🚀 START HERE - CampusPool Backend

## 🎯 What is This?

A complete, standalone Express.js backend for your CampusPool app.

**No Supabase. No external database. Just Node.js.**

---

## ⚡ Quick Start (30 seconds)

### Option 1: Automatic (Easiest)
```bash
cd backend
chmod +x setup.sh
./setup.sh
npm start
```

### Option 2: Manual (60 seconds)
```bash
cd backend
npm install
cp .env.example .env
npm start
```

**✅ Done!** Backend running at `http://localhost:3001`

---

## 🧪 Test It Works

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-10-27T..."}
```

Or run full test suite:
```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

---

## 📚 Next Steps

### 1. Connect Frontend
Edit `/utils/config.ts`:
```typescript
export const config = {
  apiUrl: 'http://localhost:3001/api',
};
```

### 2. Start Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
npm run dev  # From project root
```

### 3. Open Browser
```
http://localhost:3000
```

---

## 📖 Documentation

Choose your path:

| I want to... | Read this |
|--------------|-----------|
| **Get started NOW** | `../BACKEND_QUICKSTART.md` |
| **Understand everything** | `SETUP.md` |
| **See all API endpoints** | `API.md` |
| **Deploy to production** | `DEPLOYMENT_OPTIONS.md` |
| **Understand the files** | `FILES_OVERVIEW.md` |
| **General overview** | `README.md` |

---

## 🏗️ What's Included

```
backend/
├── 📄 server.js            ← Main Express server
├── 📄 dataStore.js         ← Data storage (in-memory)
├── 📄 package.json         ← Dependencies
│
├── 📘 README.md            ← Overview
├── 📘 SETUP.md             ← Detailed setup
├── 📘 API.md               ← API documentation
├── 📘 DEPLOYMENT_OPTIONS.md ← Deploy guides
├── 📘 FILES_OVERVIEW.md    ← File guide
├── 📘 START_HERE.md        ← This file!
│
├── 🔧 setup.sh             ← Auto setup script
├── 🔧 test-api.sh          ← API testing
│
├── 🐳 Dockerfile           ← Docker image
└── 🐳 docker-compose.yml   ← Docker compose
```

---

## ✅ Features

✅ **Authentication** - Sign up, sign in, JWT sessions  
✅ **User Profiles** - Create and edit profiles  
✅ **Carpool Requests** - Post and manage ride requests  
✅ **Messaging** - Direct messages with accept/deny  
✅ **Security** - Password hashing, JWT tokens, CORS  
✅ **Testing** - Automated test suite  
✅ **Deployment** - Ready for production  
✅ **Documentation** - Complete guides  

---

## 🎯 The Absolute Basics

### Start Backend
```bash
cd backend
npm start
```

### Test Backend
```bash
curl http://localhost:3001/health
```

### Stop Backend
```
Ctrl + C
```

That's it! 🎉

---

## 🚢 Deploy to Production

### Fastest: Railway
```bash
cd backend
railway login
railway init
railway up
```

### Most Popular: Heroku
```bash
cd backend
heroku create campuspool-api
git push heroku main
```

### See All Options
Read `DEPLOYMENT_OPTIONS.md` for 10+ platforms

---

## 🆘 Having Issues?

### Backend won't start
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Port already in use
```bash
# Use different port
PORT=3002 npm start
```

### CORS errors
Check `server.js` line 26:
```javascript
app.use(cors());  // Should allow your frontend
```

### Still stuck?
1. Check backend logs in terminal
2. Read `SETUP.md` for detailed help
3. Run `./test-api.sh` to diagnose

---

## 💡 Pro Tips

**Development:**
- Use `npm run dev` for auto-reload
- Keep backend logs visible
- Test with `./test-api.sh` often

**Production:**
- Change `JWT_SECRET` in `.env`
- Use real database (PostgreSQL recommended)
- Enable HTTPS
- Set up monitoring

---

## 🎓 Understanding the Code

### Request Flow
```
Frontend makes request
    ↓
server.js receives it
    ↓
Checks authentication (JWT)
    ↓
Processes request
    ↓
dataStore.js handles data
    ↓
Returns response to frontend
```

### Key Files
- `server.js` - All API routes and logic
- `dataStore.js` - Data storage layer
- `.env` - Configuration (JWT secret, port, etc.)

---

## 📊 Quick Reference

### API Base URL
```
http://localhost:3001/api
```

### Common Endpoints
```
POST /api/auth/signup      - Create account
POST /api/auth/signin      - Sign in
GET  /api/users/:id        - Get profile
GET  /api/carpool-requests - List rides
POST /api/carpool-requests - Create ride
```

### Authentication
```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

---

## 🎉 You're Ready!

Your backend is:
- ✅ Complete and working
- ✅ Fully documented
- ✅ Production-ready
- ✅ Easy to deploy

**Now go build something awesome!** 🚗💨

---

## 📞 Quick Links

- **Quick Start**: `../BACKEND_QUICKSTART.md`
- **Full Setup**: `SETUP.md`
- **API Docs**: `API.md`
- **Deploy**: `DEPLOYMENT_OPTIONS.md`
- **Complete Info**: `../BACKEND_COMPLETE.md`

---

**Questions? Check the docs above. Happy coding! 🚀**
