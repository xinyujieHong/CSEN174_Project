# CampusPool Backend API Documentation

Base URL: `http://localhost:3001` (development)

All API endpoints are prefixed with `/api` except for the health check.

## Authentication

All endpoints except signup, signin, and health check require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Health Check

#### `GET /health`

Check if the server is running.

**Auth Required:** No

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-27T10:30:00.000Z"
}
```

---

## Authentication Endpoints

### Sign Up

#### `POST /api/auth/signup`

Create a new user account.

**Auth Required:** No

**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "SecurePassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid-v4-string",
    "email": "student@college.edu",
    "name": "John Doe"
  },
  "token": "jwt-token-string"
}
```

**Errors:**
- `400` - Missing required fields or user already exists
- `500` - Server error

---

### Sign In

#### `POST /api/auth/signin`

Sign in with email and password.

**Auth Required:** No

**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid-v4-string",
    "email": "student@college.edu",
    "name": "John Doe"
  },
  "token": "jwt-token-string"
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

---

### Get Session

#### `GET /api/auth/session`

Get the current authenticated user.

**Auth Required:** Yes

**Response (200):**
```json
{
  "user": {
    "id": "uuid-v4-string",
    "email": "student@college.edu",
    "name": "John Doe"
  }
}
```

**Errors:**
- `401` - Not authenticated
- `404` - User not found
- `500` - Server error

---

### Sign Out

#### `POST /api/auth/signout`

Sign out (client should remove token).

**Auth Required:** Yes

**Response (200):**
```json
{
  "message": "Signed out successfully"
}
```

---

## User Profile Endpoints

### Get User Profile

#### `GET /api/users/:userId`

Get a user's profile.

**Auth Required:** Yes

**Parameters:**
- `userId` (path) - The user's ID

**Response (200):**
```json
{
  "userId": "uuid-v4-string",
  "name": "John Doe",
  "college": "State University",
  "hasCar": true,
  "carModel": "Honda Civic",
  "carColor": "Blue",
  "bio": "Looking to carpool to campus daily!",
  "profilePicture": "https://...",
  "updatedAt": "2025-10-27T10:30:00.000Z"
}
```

**Errors:**
- `401` - Not authenticated
- `404` - Profile not found
- `500` - Server error

---

### Create/Update User Profile

#### `POST /api/users/:userId`

Create or update a user profile.

**Auth Required:** Yes (can only update own profile)

**Parameters:**
- `userId` (path) - The user's ID

**Request Body (User with car):**
```json
{
  "name": "John Doe",
  "college": "State University",
  "hasCar": true,
  "carModel": "Honda Civic",
  "carColor": "Blue",
  "carYear": "2020",
  "carLicense": "ABC123",
  "bio": "Happy to give rides!",
  "profilePicture": "https://..."
}
```

**Request Body (User without car):**
```json
{
  "name": "Jane Smith",
  "college": "State University",
  "hasCar": false,
  "bio": "Looking for rides to campus!",
  "profilePicture": "https://..."
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "profile": { ... }
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Cannot update another user's profile
- `500` - Server error

---

## Carpool Request Endpoints

### Get All Carpool Requests

#### `GET /api/carpool-requests`

Get all carpool requests (sorted by newest first).

**Auth Required:** Yes

**Response (200):**
```json
[
  {
    "id": "uuid-v4-string",
    "userId": "user-uuid",
    "userName": "John Doe",
    "userPicture": "https://...",
    "destination": "Downtown Campus",
    "date": "2025-11-01",
    "time": "09:00",
    "seats": 3,
    "notes": "Leaving from North Side",
    "createdAt": "2025-10-27T10:00:00.000Z",
    "responses": ["user-id-1", "user-id-2"]
  }
]
```

**Errors:**
- `401` - Not authenticated
- `500` - Server error

---

### Create Carpool Request

#### `POST /api/carpool-requests`

Create a new carpool request.

**Auth Required:** Yes

**Request Body:**
```json
{
  "userName": "John Doe",
  "userPicture": "https://...",
  "destination": "Downtown Campus",
  "date": "2025-11-01",
  "time": "09:00",
  "seats": 3,
  "notes": "Leaving from North Side"
}
```

**Response (201):**
```json
{
  "message": "Carpool request created successfully",
  "request": {
    "id": "uuid-v4-string",
    "userId": "user-uuid",
    ...
  }
}
```

**Errors:**
- `401` - Not authenticated
- `400` - Missing required fields
- `500` - Server error

---

### Update Carpool Request

#### `PUT /api/carpool-requests/:requestId`

Update a carpool request.

**Auth Required:** Yes (must be request owner)

**Parameters:**
- `requestId` (path) - The request ID

**Request Body:**
```json
{
  "destination": "Updated destination",
  "notes": "Updated notes",
  "responses": ["user-id-1", "user-id-2", "user-id-3"]
}
```

**Response (200):**
```json
{
  "message": "Request updated successfully"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Cannot update another user's request
- `404` - Request not found
- `500` - Server error

---

### Delete Carpool Request

#### `DELETE /api/carpool-requests/:requestId`

Delete a carpool request.

**Auth Required:** Yes (must be request owner)

**Parameters:**
- `requestId` (path) - The request ID

**Response (200):**
```json
{
  "message": "Request deleted successfully"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Cannot delete another user's request
- `404` - Request not found
- `500` - Server error

---

## Messaging Endpoints

### Get Conversations

#### `GET /api/conversations`

Get all conversations for the current user.

**Auth Required:** Yes

**Response (200):**
```json
[
  {
    "id": "conversation-id",
    "participants": ["user-id-1", "user-id-2"],
    "status": "accepted",
    "createdAt": "2025-10-27T10:00:00.000Z",
    "lastMessage": {
      "id": "message-id",
      "content": "See you tomorrow!",
      "createdAt": "2025-10-27T11:30:00.000Z"
    },
    "otherUser": {
      "id": "user-id-2",
      "name": "Jane Smith",
      "profilePicture": "https://..."
    }
  }
]
```

**Errors:**
- `401` - Not authenticated
- `500` - Server error

---

### Get Messages

#### `GET /api/conversations/:conversationId/messages`

Get all messages in a conversation.

**Auth Required:** Yes (must be participant)

**Parameters:**
- `conversationId` (path) - The conversation ID

**Response (200):**
```json
[
  {
    "id": "message-id-1",
    "conversationId": "conversation-id",
    "senderId": "user-id-1",
    "content": "Hi! Can I get a ride tomorrow?",
    "createdAt": "2025-10-27T10:00:00.000Z"
  },
  {
    "id": "message-id-2",
    "conversationId": "conversation-id",
    "senderId": "user-id-2",
    "content": "Sure! What time?",
    "createdAt": "2025-10-27T10:05:00.000Z"
  }
]
```

**Errors:**
- `401` - Not authenticated
- `403` - Not part of this conversation
- `404` - Conversation not found
- `500` - Server error

---

### Send Message

#### `POST /api/conversations/:conversationId/messages`

Send a message in a conversation.

**Auth Required:** Yes

**Parameters:**
- `conversationId` (path) - The conversation ID (will be created if doesn't exist)

**Request Body (existing conversation):**
```json
{
  "content": "See you at 9 AM!"
}
```

**Request Body (new conversation):**
```json
{
  "content": "Hi! Can I get a ride?",
  "otherUserId": "user-id-of-recipient"
}
```

**Response (201):**
```json
{
  "message": "Message sent successfully",
  "data": {
    "id": "message-id",
    "conversationId": "conversation-id",
    "senderId": "your-user-id",
    "content": "Hi! Can I get a ride?",
    "createdAt": "2025-10-27T10:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Missing content or otherUserId (for new conversations)
- `401` - Not authenticated
- `403` - Not part of this conversation
- `500` - Server error

---

### Update Conversation Status

#### `PUT /api/conversations/:conversationId`

Update conversation status (accept or deny message request).

**Auth Required:** Yes (must be participant)

**Parameters:**
- `conversationId` (path) - The conversation ID

**Request Body:**
```json
{
  "status": "accepted"
}
```

Valid status values:
- `pending` - Awaiting acceptance
- `accepted` - Conversation accepted
- `denied` - Conversation denied

**Response (200):**
```json
{
  "message": "Conversation updated successfully"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Not part of this conversation
- `404` - Conversation not found
- `500` - Server error

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized for this action)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently not implemented, but recommended for production:
- Sign up: 5 requests per hour per IP
- Sign in: 10 requests per 15 minutes per IP
- Other endpoints: 100 requests per 15 minutes per user

---

## Versioning

Current version: `1.0.0`

API versioning can be added in the future:
- `/api/v1/...`
- `/api/v2/...`

---

## WebSocket Support

Not currently implemented. Real-time updates use polling.

For WebSocket support in the future:
- Use Socket.IO or native WebSocket
- Events: `new_message`, `new_request`, `conversation_update`

---

## Example Usage (JavaScript)

```javascript
// Sign up
const signupResponse = await fetch('http://localhost:3001/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'student@college.edu',
    password: 'SecurePassword123',
    name: 'John Doe'
  })
});
const { token, user } = await signupResponse.json();

// Make authenticated request
const profileResponse = await fetch(`http://localhost:3001/api/users/${user.id}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const profile = await profileResponse.json();
```

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Store tokens securely** (httpOnly cookies recommended)
3. **Implement token refresh** for long-lived sessions
4. **Validate all inputs** on the server
5. **Use rate limiting** to prevent abuse
6. **Log security events** (failed logins, etc.)
7. **Keep JWT_SECRET secure** and rotate regularly
8. **Set appropriate CORS policies**

---

## Support

For issues or questions, check the server logs or review the README.md file.
