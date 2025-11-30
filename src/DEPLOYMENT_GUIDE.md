# CampusPool Deployment Guide

This document explains the backend architecture and how to deploy CampusPool with different backend options.

## Table of Contents

1. [Backend Options](#backend-options)
2. [Using the Generic Backend](#using-the-generic-backend)
3. [Using Supabase Backend](#using-supabase-backend)
4. [Downloading/Zipping Your Code](#downloadingzipping-your-code)
5. [Deployment Options](#deployment-options)

## Backend Options

CampusPool now supports **two backend implementations**:

### 1. **Generic Backend** (New - Database Agnostic)
- **Location**: `/backend/` directory
- **Technology**: Express.js + JWT Authentication
- **Database**: In-memory (easily swappable to PostgreSQL, MongoDB, etc.)
- **Portability**: Works with any hosting platform
- **Best for**: Complete control, custom deployments, any database

### 2. **Supabase Backend** (Original)
- **Location**: `/supabase/functions/server/` directory
- **Technology**: Deno Edge Functions + Supabase Auth
- **Database**: Supabase PostgreSQL + KV Store
- **Portability**: Tied to Supabase platform
- **Best for**: Rapid prototyping, built-in auth, real-time features

---

## Using the Generic Backend

The generic backend is completely independent and works with any frontend or database.

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-me-in-production
NODE_ENV=development
```

### Step 3: Run the Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3001`

### Step 4: Configure Frontend

Create a `.env` file in your frontend root:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Step 5: Start Frontend

```bash
npm start
```

### Switching Database

The generic backend uses an in-memory data store by default. To use a real database:

#### For PostgreSQL:

```bash
cd backend
npm install pg
```

Edit `dataStore.js`:

```javascript
import pg from 'pg';

export class DataStore {
  constructor() {
    this.pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async createUser({ email, password, name }) {
    const result = await this.pool.query(
      'INSERT INTO users (email, password, name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
      [email, password, name]
    );
    return result.rows[0].id;
  }
  
  // Implement other methods...
}
```

#### For MongoDB:

```bash
cd backend
npm install mongodb
```

Edit `dataStore.js`:

```javascript
import { MongoClient } from 'mongodb';

export class DataStore {
  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI);
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db('campuspool');
  }

  async createUser({ email, password, name }) {
    const result = await this.db.collection('users').insertOne({
      email, password, name, createdAt: new Date()
    });
    return result.insertedId.toString();
  }
  
  // Implement other methods...
}
```

---

## Using Supabase Backend

### Prerequisites

- Supabase account (https://supabase.com)
- Supabase CLI installed

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Note your project URL and anon key

### Step 2: Configure Environment

Create `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

### Step 3: Deploy Functions

```bash
supabase login
supabase link --project-ref your-project-id
supabase functions deploy server
```

### Step 4: Run Frontend

The frontend will automatically connect to your Supabase backend.

---

## Downloading/Zipping Your Code

Unfortunately, there's no automated tool to create a zip file directly from this interface. Here are your options:

### Option A: Manual Copy

If running locally, use terminal:

```bash
# Navigate to project directory
cd /path/to/campuspool

# Create zip file (Mac/Linux)
zip -r campuspool.zip . -x "node_modules/*" -x ".git/*" -x "build/*"

# Or use tar
tar -czf campuspool.tar.gz --exclude=node_modules --exclude=.git --exclude=build .

# Windows (PowerShell)
Compress-Archive -Path . -DestinationPath campuspool.zip -Exclude node_modules,@{.git,build}
```

### Option B: Git Repository

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Push to GitHub/GitLab:
```bash
git remote add origin https://github.com/yourusername/campuspool.git
git push -u origin main
```

3. Download as ZIP from repository

### Option C: Figma Make Export

Check if Figma Make has a "Download" or "Export Project" button in the interface.

### What to Include

When creating a backup, include:

✅ **Required Files/Folders:**
- `/components/` - All React components
- `/utils/` - API client and utilities
- `/backend/` - Generic backend (if using)
- `/supabase/` - Supabase functions (if using)
- `/styles/` - CSS files
- `App.tsx` - Main app component
- `package.json` - Dependencies
- `.env.example` - Environment template

❌ **Exclude:**
- `node_modules/` - Too large, reinstall with `npm install`
- `.git/` - Version control history
- `build/` or `dist/` - Build artifacts
- `.env` - Contains secrets

---

## Deployment Options

### Deploy Generic Backend

#### **Heroku**

```bash
cd backend
git init
heroku create campuspool-backend
heroku config:set JWT_SECRET=your-secret-key
git add .
git commit -m "Deploy backend"
git push heroku main
```

#### **Railway**

```bash
cd backend
railway init
railway up
```

In Railway dashboard, set environment variables:
- `JWT_SECRET`
- `PORT` (automatically set by Railway)

#### **Render**

1. Create account at https://render.com
2. New Web Service → Connect repository
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables in dashboard

#### **DigitalOcean App Platform**

1. Create account at https://digitalocean.com
2. Apps → Create App
3. Connect GitHub repository
4. Select `/backend` directory
5. Configure environment variables

#### **Docker Deployment**

Create `backend/Dockerfile`:

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t campuspool-backend .
docker run -p 3001:3001 -e JWT_SECRET=your-secret campuspool-backend
```

### Deploy Frontend

#### **Vercel**

```bash
npm install -g vercel
vercel --prod
```

Set environment variable:
- `REACT_APP_API_URL=https://your-backend-url.com/api`

#### **Netlify**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### **GitHub Pages**

```bash
npm install --save-dev gh-pages

# Add to package.json
{
  "homepage": "https://yourusername.github.io/campuspool",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}

npm run deploy
```

---

## Migration Path: Supabase → Generic Backend

If you want to migrate from Supabase to the generic backend:

### 1. Export Data

```bash
# Export from Supabase
supabase db dump -f dump.sql
```

### 2. Switch to Generic Backend

Follow "Using the Generic Backend" instructions above.

### 3. Import Data

Adapt the SQL dump to your new database schema.

### 4. Update Frontend Config

Change API URL from Supabase to your new backend:

```env
REACT_APP_API_URL=https://your-new-backend.com/api
```

---

## Comparison Table

| Feature | Generic Backend | Supabase Backend |
|---------|----------------|------------------|
| **Setup Time** | 5 minutes | 10-15 minutes |
| **Database Options** | Any (PostgreSQL, MongoDB, etc.) | Supabase PostgreSQL only |
| **Auth Provider** | JWT (custom) | Supabase Auth |
| **Hosting** | Any platform | Supabase Edge Functions |
| **Real-time** | Polling (3s) | Supabase Realtime |
| **Cost** | Depends on hosting | Supabase free tier |
| **Scalability** | Depends on hosting | Auto-scales |
| **Portability** | Very high | Low (vendor lock-in) |
| **Customization** | Complete control | Limited by Supabase |
| **Learning Curve** | Moderate | Low |

---

## Troubleshooting

### Generic Backend Issues

**Problem**: "Cannot connect to backend"
```
Solution: Ensure backend is running on correct port and CORS is configured
Check: .env file has correct PORT
Verify: Frontend REACT_APP_API_URL matches backend URL
```

**Problem**: "JWT token expired"
```
Solution: Token expires after 7 days, user needs to log in again
Increase expiry in server.js: jwt.sign({...}, JWT_SECRET, { expiresIn: '30d' })
```

### Supabase Backend Issues

**Problem**: "Provider is not enabled"
```
Solution: Enable OAuth provider in Supabase dashboard
Go to: Authentication → Providers → Enable desired provider
```

**Problem**: "Row Level Security policy violation"
```
Solution: Ensure RLS policies are set correctly in Supabase dashboard
```

---

## Support

For issues or questions:
1. Check backend logs: `console.log` statements in server code
2. Check frontend console: Browser DevTools → Console
3. Verify environment variables are set correctly
4. Test API endpoints with Postman/curl

---

## License

MIT
