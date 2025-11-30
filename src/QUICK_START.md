# CampusPool Quick Start Guide

Get your CampusPool app running in minutes!

## Option 1: Run with Generic Backend (Recommended for Development)

### Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:3001`

### Step 2: Start the Frontend

Open a new terminal and run:

```bash
npm install
npm start
```

The frontend will run on `http://localhost:3000` (or your configured port)

### Step 3: Create an Account

1. Go to `http://localhost:3000`
2. Click "Create Account"
3. Fill in your details
4. Set up your profile
5. Start using CampusPool!

**That's it!** The app is configured to connect to `localhost:3001` by default.

---

## Option 2: Configure for Production Backend

### If Your Backend is Deployed

Edit `/utils/config.ts` and change the `apiUrl`:

```typescript
export const config = {
  apiUrl: 'https://your-backend-url.com/api',
  // ... other settings
};
```

### OR Set it Dynamically

Add this to your `index.html` before other scripts:

```html
<script>
  window.CAMPUSPOOL_API_URL = 'https://your-backend-url.com/api';
</script>
```

---

## Option 3: Run with Supabase Backend

### Prerequisites
- Supabase account
- Supabase CLI installed

### Step 1: Setup Supabase

```bash
supabase login
supabase link --project-ref your-project-id
supabase functions deploy server
```

### Step 2: Configure Frontend

Update `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

### Step 3: Update App.tsx

Comment out the generic API imports and uncomment Supabase imports:

```typescript
// import { authAPI, authUtils, profileAPI } from './utils/api/client';
import { createClient, apiRequest } from './utils/supabase/client';
```

Then restore the original Supabase authentication code.

---

## Testing the Connection

### Test Backend Health

Open your browser or use curl:

```bash
curl http://localhost:3001/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-10-27T..."
}
```

### Test Frontend Connection

1. Open browser console (F12)
2. Create a test account
3. Check console for any API errors
4. If you see "Failed to fetch", check:
   - Backend is running
   - API URL is correct
   - No CORS errors

---

## Common Issues

### "Failed to connect to backend"

**Solution:**
- Ensure backend is running on port 3001
- Check `/utils/config.ts` has correct URL
- Verify no firewall blocking

### "CORS error"

**Solution:**
- Backend has CORS enabled by default
- If using custom backend, ensure CORS headers are set

### "Unauthorized" errors

**Solution:**
- Clear browser localStorage
- Sign in again to get new token

### Backend won't start

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## Development vs Production

### Development (Local)
- Backend: `http://localhost:3001/api`
- Frontend: `http://localhost:3000`
- Data: In-memory (resets on restart)

### Production
- Backend: Deploy to Heroku/Railway/Render
- Frontend: Deploy to Vercel/Netlify
- Data: Use PostgreSQL/MongoDB
- Update `config.apiUrl` to production URL

---

## Next Steps

1. ✅ App is running
2. 📖 Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment options
3. 🚀 Deploy to production
4. 🔧 Customize for your college

---

## Quick Commands Reference

```bash
# Start backend (development)
cd backend && npm run dev

# Start backend (production)
cd backend && npm start

# Start frontend
npm start

# Run tests
npm test

# Build for production
npm run build
```

---

## Support

Need help? Check:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Full deployment documentation
- Backend logs: Check terminal where backend is running
- Frontend logs: Browser console (F12)

---

Happy carpooling! 🚗💨
