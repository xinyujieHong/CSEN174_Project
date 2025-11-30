# CampusPool Backend - Deployment Options

Complete guide for deploying your CampusPool backend to various platforms.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `JWT_SECRET` is set to a secure random value
- [ ] Environment variables are configured
- [ ] CORS is configured for your frontend domain
- [ ] Error logging is enabled
- [ ] Health check endpoint works
- [ ] API endpoints are tested

---

## 🚀 Deployment Platforms

### 1. Heroku (Free Tier Available)

**Pros:** Simple, free tier, easy database add-ons  
**Cons:** Sleeps after 30 min inactivity on free tier

#### Steps:

```bash
# Install Heroku CLI
brew install heroku/brew/heroku  # macOS
# or download from https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
cd backend
heroku create campuspool-backend

# Set environment variables
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
heroku config:set NODE_ENV=production

# Deploy
git init  # if not already a git repo
git add .
git commit -m "Initial commit"
git push heroku main

# View logs
heroku logs --tail

# Your API is now at: https://campuspool-backend.herokuapp.com
```

#### Add PostgreSQL (Optional):
```bash
heroku addons:create heroku-postgresql:hobby-dev
# Connection string available in DATABASE_URL env var
```

---

### 2. Railway (Recommended - Very Easy)

**Pros:** Generous free tier, automatic deployments, built-in PostgreSQL  
**Cons:** Newer platform

#### Steps:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up

# Set environment variables via dashboard or CLI
railway variables set JWT_SECRET=your-secret-here
railway variables set NODE_ENV=production

# Get URL
railway domain

# Your API is now at: https://your-project.railway.app
```

#### Via Web UI (Easier):
1. Visit [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set root directory to `/backend`
6. Add environment variables
7. Deploy!

---

### 3. Render (Free Tier Available)

**Pros:** Free tier, auto-deploy from Git, native PostgreSQL support  
**Cons:** Free tier may be slower

#### Steps:

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** campuspool-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. Add environment variables:
   - `JWT_SECRET`: (generate with crypto)
   - `NODE_ENV`: production
6. Click "Create Web Service"

Your API will be at: `https://campuspool-backend.onrender.com`

#### Add PostgreSQL:
1. Create a new PostgreSQL database on Render
2. Copy the internal database URL
3. Add as environment variable: `DATABASE_URL`
4. Update `dataStore.js` to use PostgreSQL

---

### 4. Vercel (Serverless)

**Pros:** Free tier, automatic deployments, fast global CDN  
**Cons:** Serverless (need to handle stateless architecture)

#### Steps:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd backend
vercel

# Set environment variables
vercel env add JWT_SECRET
vercel env add NODE_ENV production

# Deploy to production
vercel --prod
```

#### Configuration (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

**Note:** Vercel is serverless, so in-memory storage won't persist. Use a database.

---

### 5. AWS (EC2 or Elastic Beanstalk)

**Pros:** Enterprise-grade, highly scalable  
**Cons:** More complex, not free

#### Option A: EC2 (Manual)

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone your repo
git clone https://github.com/yourname/campuspool.git
cd campuspool/backend

# Install dependencies
npm install --production

# Set environment variables
export JWT_SECRET="your-secret"
export NODE_ENV="production"

# Install PM2 for process management
sudo npm install -g pm2

# Start the app
pm2 start server.js --name campuspool-backend

# Make it start on boot
pm2 startup
pm2 save

# Configure Nginx as reverse proxy
sudo yum install -y nginx
# Configure nginx to proxy to localhost:3001
```

#### Option B: Elastic Beanstalk (Easier)

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p node.js-18 campuspool-backend

# Create environment
eb create campuspool-backend-env

# Set environment variables
eb setenv JWT_SECRET=your-secret NODE_ENV=production

# Deploy
eb deploy

# Open in browser
eb open
```

---

### 6. Google Cloud Platform (Cloud Run)

**Pros:** Pay-per-use, auto-scaling, easy Docker deployment  
**Cons:** Requires Google Cloud account

#### Steps:

```bash
# Install gcloud CLI
# Visit: https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Build container
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/campuspool-backend

# Deploy to Cloud Run
gcloud run deploy campuspool-backend \
  --image gcr.io/YOUR_PROJECT_ID/campuspool-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars JWT_SECRET=your-secret,NODE_ENV=production

# Your API is now at: https://campuspool-backend-xxx.run.app
```

---

### 7. DigitalOcean App Platform

**Pros:** Simple, affordable, good documentation  
**Cons:** Paid only (but cheap)

#### Steps:

1. Go to [digitalocean.com](https://www.digitalocean.com/)
2. Click "App Platform"
3. Connect your GitHub repository
4. Configure:
   - **Source Directory:** `/backend`
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`
   - **HTTP Port:** 3001
5. Add environment variables
6. Deploy

Pricing: ~$5/month for basic plan

---

### 8. Docker (Self-Hosted)

**Pros:** Run anywhere, consistent environment  
**Cons:** Need to manage your own server

#### Build and Run:

```bash
cd backend

# Build image
docker build -t campuspool-backend .

# Run container
docker run -d \
  -p 3001:3001 \
  -e JWT_SECRET=your-secret \
  -e NODE_ENV=production \
  --name campuspool-backend \
  campuspool-backend

# View logs
docker logs -f campuspool-backend
```

#### Using Docker Compose:

```bash
# Edit docker-compose.yml with your settings
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Push to Docker Hub:

```bash
docker tag campuspool-backend yourusername/campuspool-backend
docker push yourusername/campuspool-backend

# Now anyone can run:
# docker run -d -p 3001:3001 -e JWT_SECRET=secret yourusername/campuspool-backend
```

---

### 9. Netlify Functions (Serverless)

**Pros:** Free tier, integrated with Netlify frontend hosting  
**Cons:** Serverless limitations

#### Steps:

Create `netlify/functions/server.js`:
```javascript
const serverless = require('serverless-http');
const app = require('../../server');

module.exports.handler = serverless(app);
```

Configure `netlify.toml`:
```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server/:splat"
  status = 200
```

**Note:** Serverless, so use external database.

---

### 10. Fly.io (Recommended for Global Edge)

**Pros:** Free tier, global edge network, PostgreSQL included  
**Cons:** Newer platform

#### Steps:

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
cd backend
fly launch

# Set secrets
fly secrets set JWT_SECRET=your-secret

# Deploy
fly deploy

# Your API is at: https://campuspool-backend.fly.dev
```

---

## 🗄️ Database Options

### PostgreSQL (Recommended)

**Hosting Options:**
- **Heroku Postgres** - Free tier available
- **Railway PostgreSQL** - Free tier
- **Render PostgreSQL** - Free tier
- **Supabase** - Free tier with generous limits
- **Neon** - Serverless Postgres, free tier
- **ElephantSQL** - Free tier available

### MongoDB

**Hosting Options:**
- **MongoDB Atlas** - Free tier (512MB)
- **Railway MongoDB** - Easy setup
- **DigitalOcean MongoDB** - Managed service

### Redis (for sessions/cache)

**Hosting Options:**
- **Upstash** - Serverless Redis, free tier
- **Redis Labs** - Free 30MB
- **Railway Redis** - Easy setup

---

## 🔧 Post-Deployment Configuration

### 1. Update Frontend Config

Edit `/utils/config.ts`:
```typescript
export const config = {
  apiUrl: 'https://your-backend-url.com/api',
  pollingInterval: 5000,
};
```

### 2. Enable CORS for Your Domain

Edit `backend/server.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-url.com',
  credentials: true
}));
```

### 3. Set Up Monitoring

**Options:**
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **DataDog** - Full observability
- **New Relic** - APM

### 4. Add Rate Limiting

Install express-rate-limit:
```bash
npm install express-rate-limit
```

Add to `server.js`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 Monitoring & Logging

### Health Checks

Set up monitoring to ping your `/health` endpoint:
- **UptimeRobot** - Free
- **Pingdom** - Paid
- **StatusCake** - Free tier

### Log Management

**Options:**
- **Papertrail** - Free tier
- **Loggly** - Free tier
- **CloudWatch** (AWS)
- **Stackdriver** (GCP)

---

## 🔒 Security Hardening

### 1. Environment Variables
```bash
# NEVER commit these
JWT_SECRET=
DATABASE_URL=
NODE_ENV=production
```

### 2. Helmet.js (Security Headers)
```bash
npm install helmet
```

```javascript
import helmet from 'helmet';
app.use(helmet());
```

### 3. Rate Limiting
See section above.

### 4. Input Validation
```bash
npm install express-validator
```

### 5. HTTPS Only
Most platforms (Heroku, Render, etc.) provide free SSL.

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Tier | Database |
|----------|-----------|-----------|----------|
| Heroku | ✅ (sleeps) | $7/mo | Free PostgreSQL |
| Railway | ✅ $5 credit | $5+/mo | Free PostgreSQL |
| Render | ✅ | $7/mo | Free PostgreSQL |
| Vercel | ✅ | $20/mo | Separate |
| Fly.io | ✅ | $5+/mo | Free PostgreSQL |
| DigitalOcean | ❌ | $5+/mo | $15+/mo |
| AWS | 12mo free | Varies | Varies |
| GCP | $300 credit | Varies | Varies |

---

## 🎯 Recommendation

**For Prototyping:** Railway or Render (free tier)  
**For Production:** Railway, Render, or Fly.io  
**For Enterprise:** AWS or GCP  
**For Simplicity:** Heroku  
**For Global Edge:** Fly.io  

---

## 📚 Additional Resources

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js Production Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [JWT Best Practices](https://github.com/dwyl/learn-json-web-tokens)

---

## 🆘 Troubleshooting Deployments

### Build Fails
- Check Node.js version (should be 16+)
- Ensure `package.json` is valid
- Check build logs for errors

### App Crashes
- Check environment variables are set
- Review application logs
- Verify `PORT` is correctly set

### Can't Connect
- Check firewall rules
- Verify CORS settings
- Test health endpoint

---

Choose the platform that best fits your needs and budget. Good luck! 🚀
