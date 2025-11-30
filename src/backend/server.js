/**
 * CampusPool Backend Server
 * A database-agnostic backend using Express.js and JWT authentication
 * 
 * To run: node backend/server.js
 * Requires: npm install express jsonwebtoken bcrypt cors dotenv
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import factory from './dataStoreFactory.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize data store
const db = factory.getDataStore();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden', message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// ============================================================================
// AUTH ROUTES
// ============================================================================

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = await db.createUser({
      email,
      password: hashedPassword,
      name,
    });

    // Generate token
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: { id: userId, email, name },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed', message: error.message });
  }
});

// Sign in
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Get user
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Signin failed', message: error.message });
  }
});

// Get current user session
app.get('/api/auth/session', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUser(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ error: 'Failed to get session', message: error.message });
  }
});

// Sign out (client-side token removal, but we can add token blacklisting if needed)
app.post('/api/auth/signout', authenticateToken, (req, res) => {
  res.json({ message: 'Signed out successfully' });
});

// ============================================================================
// USER PROFILE ROUTES
// ============================================================================

// Get user profile
app.get('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const profile = await db.getUserProfile(req.params.userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile', message: error.message });
  }
});

// Create/Update user profile
app.post('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user is updating their own profile
    if (userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden', message: 'Cannot update another user\'s profile' });
    }

    const profileData = req.body;
    const savedProfile = await db.setUserProfile(userId, profileData);

    res.json({ message: 'Profile updated successfully', profile: savedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile', message: error.message });
  }
});

// ============================================================================
// CARPOOL REQUEST ROUTES
// ============================================================================

// Get all carpool requests
app.get('/api/carpool-requests', authenticateToken, async (req, res) => {
  try {
    const requests = await db.getCarpoolRequests();
    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        const user = await db.getUser(request.userId);
        const profile = await db.getUserProfile(request.userId);

        // Enrich responses with user information
        const enrichedResponses = await Promise.all(
          (request.responses || []).map(async (response) => {
            // Handle old format (string) and new format (object)
            const userId = typeof response === 'string' ? response : response.userId;
            const responderUser = await db.getUser(userId);
            const responderProfile = await db.getUserProfile(userId);

            return {
              userId: userId,
              userName: responderUser?.name || responderProfile?.name || 'User',
              userCollege: responderProfile?.college || '',
              message: typeof response === 'object' ? response.message : "I'm available for this carpool!",
              timestamp: typeof response === 'object' ? response.timestamp : new Date().toISOString(),
              hasCar: responderProfile?.hasCar || false,
            };
          })
        );

        return {
          ...request,
          userName: user?.name || profile?.name || 'Unknown User',
          responses: enrichedResponses,
        };
      })
    );
    res.json(enrichedRequests);
  } catch (error) {
    console.error('Get carpool requests error:', error);
    res.status(500).json({ error: 'Failed to get carpool requests', message: error.message });
  }
});

// Create carpool request
app.post('/api/carpool-requests', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUser(req.user.userId);
    const profile = await db.getUserProfile(req.user.userId);

    const requestData = {
      ...req.body,
      userId: req.user.userId,
      userName: user?.name || profile?.name || 'Unknown User',
      createdAt: new Date().toISOString(),
    };

    const requestId = await db.createCarpoolRequest(requestData);

    const createdRequest = await db.getCarpoolRequest(requestId);

    res.status(201).json({
      message: 'Carpool request created successfully',
      request: createdRequest,
    });
  } catch (error) {
    console.error('Create carpool request error:', error);
    res.status(500).json({ error: 'Failed to create carpool request', message: error.message });
  }
});

// Update carpool request
app.put('/api/carpool-requests/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await db.getCarpoolRequest(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Verify user owns the request
    if (request.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden', message: 'Cannot update another user\'s request' });
    }

    await db.updateCarpoolRequest(requestId, req.body);

    res.json({ message: 'Request updated successfully' });
  } catch (error) {
    console.error('Update carpool request error:', error);
    res.status(500).json({ error: 'Failed to update request', message: error.message });
  }
});

app.post('/api/carpool-requests/:requestId/respond', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { message } = req.body;
    const request = await db.getCarpoolRequest(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const responderId = req.user.userId;
    const existingResponses = Array.isArray(request.responses) ? request.responses : [];

    // Allow multiple responses from the same user (duplicate check removed)

    // Create response object with userId, message, and timestamp
    const responseObject = {
      userId: responderId,
      message: message || "I'm available for this carpool!",
      timestamp: new Date().toISOString()
    };

    const updatedResponses = [...existingResponses, responseObject];
    await db.updateCarpoolRequest(requestId, { responses: updatedResponses });

    res.status(201).json({ message: 'Responded successfully', response: responseObject });
  } catch (error) {
    console.error('Respond to request error:', error);
    res.status(500).json({ error: 'Failed to respond to request', message: error.message });
  }
});

// Delete carpool request
app.delete('/api/carpool-requests/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await db.getCarpoolRequest(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Verify user owns the request
    if (request.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden', message: 'Cannot delete another user\'s request' });
    }

    await db.deleteCarpoolRequest(requestId);

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete carpool request error:', error);
    res.status(500).json({ error: 'Failed to delete request', message: error.message });
  }
});

// ============================================================================
// MESSAGING ROUTES
// ============================================================================

// Get conversations for current user
app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await db.getConversations(req.user.userId);
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations', message: error.message });
  }
});

// Get messages for a conversation
app.get('/api/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Verify user is part of the conversation
    const conversation = await db.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Forbidden', message: 'Not part of this conversation' });
    }

    const messages = await db.getMessages(conversationId);
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages', message: error.message });
  }
});

// Send a message
app.post('/api/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Get or create conversation
    let conversation = await db.getConversation(conversationId);

    if (!conversation) {
      // Create new conversation if it doesn't exist
      const { otherUserId } = req.body;
      if (!otherUserId) {
        return res.status(400).json({ error: 'otherUserId required for new conversation' });
      }

      conversation = await db.createConversation({
        id: conversationId,
        participants: [req.user.userId, otherUserId],
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }

    // Verify user is part of the conversation
    if (!conversation.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Forbidden', message: 'Not part of this conversation' });
    }

    const messageData = {
      conversationId,
      senderId: req.user.userId,
      content,
      createdAt: new Date().toISOString(),
    };

    const messageId = await db.createMessage(messageData);

    res.status(201).json({
      message: 'Message sent successfully',
      data: { id: messageId, ...messageData },
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message', message: error.message });
  }
});

// Update conversation status (accept/deny)
app.put('/api/conversations/:conversationId', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { status } = req.body;

    const conversation = await db.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Verify user is part of the conversation
    if (!conversation.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Forbidden', message: 'Not part of this conversation' });
    }

    await db.updateConversation(conversationId, { status });

    res.json({ message: 'Conversation updated successfully' });
  } catch (error) {
    console.error('Update conversation error:', error);
    res.status(500).json({ error: 'Failed to update conversation', message: error.message });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`CampusPool backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
