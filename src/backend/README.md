# CampusPool Backend

A database-agnostic backend server for the CampusPool carpooling application.

## Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **RESTful API** - Clean API endpoints for all features
- ✅ **Database Agnostic** - Easy to swap data stores
- ✅ **CORS Enabled** - Ready for frontend integration
- ✅ **Error Handling** - Comprehensive error logging

## Quick Start

### 1. Install Dependencies

```bash
cd src/backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and set your JWT_SECRET
```

### 3. Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in with email/password
- `GET /api/auth/session` - Get current user session
- `POST /api/auth/signout` - Sign out

### User Profiles

- `GET /api/users/:userId` - Get user profile
- `POST /api/users/:userId` - Create/update user profile

### Carpool Requests

- `GET /api/carpool-requests` - Get all carpool requests
- `POST /api/carpool-requests` - Create a new request
- `PUT /api/carpool-requests/:requestId` - Update a request
- `DELETE /api/carpool-requests/:requestId` - Delete a request

### Messaging

- `GET /api/conversations` - Get user's conversations
- `GET /api/conversations/:conversationId/messages` - Get messages
- `POST /api/conversations/:conversationId/messages` - Send a message
- `PUT /api/conversations/:conversationId` - Update conversation status

### Health Check

- `GET /health` - Server health check

## Data Storage

By default, the server uses **in-memory storage** (data is lost on restart). This is perfect for prototyping but should be replaced for production.

### Switching to a Real Database

The `DataStore` class in `dataStore.js` can be easily replaced:

#### PostgreSQL Example

```bash
npm install pg
```

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
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id',
      [email, password, name]
    );
    return result.rows[0].id;
  }
  // Implement other methods...
}
```

#### MongoDB Example

```bash
npm install mongodb
```

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

## Deployment

### Deploy to Heroku

```bash
heroku create campuspool-backend
heroku config:set JWT_SECRET=your-secret-key
git push heroku main
```

### Deploy to Railway

```bash
railway init
railway up
```

### Deploy to Render

1. Create a new Web Service
2. Connect your repository
3. Set environment variables
4. Deploy

### Deploy to AWS/GCP/Azure

Use Docker or deploy directly:

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Security Considerations

- ⚠️ **Change JWT_SECRET** in production
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for auth endpoints
- ⚠️ Use a real database with backups
- ⚠️ Add input validation and sanitization
- ⚠️ Implement token refresh mechanism
- ⚠️ Add request size limits

## License

MIT
