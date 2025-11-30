/**
 * Data Store - In-Memory Implementation
 * 
 * This is an in-memory data store for prototyping.
 * Replace this with a real database adapter for production:
 * - PostgreSQL: Use pg or Prisma
 * - MongoDB: Use mongoose
 * - MySQL: Use mysql2 or Sequelize
 * - Firebase: Use firebase-admin
 */

import { randomUUID } from 'crypto';

export class MemoryDataStore {
  constructor() {
    // In-memory storage (lost on server restart)
    this.users = new Map();
    this.profiles = new Map();
    this.carpoolRequests = new Map();
    this.conversations = new Map();
    this.messages = new Map();

    console.log('MemoryDataStore initialized');
  }

  // ============================================================================
  // USER METHODS
  // ============================================================================

  async createUser({ email, password, name }) {
    const userId = randomUUID();
    const user = {
      id: userId,
      email,
      password, // Already hashed by the server
      name,
      createdAt: new Date().toISOString(),
    };

    this.users.set(userId, user);
    console.log(`User created: ${userId} (${email})`);
    return userId;
  }

  async getUser(userId) {
    return this.users.get(userId);
  }

  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  // ============================================================================
  // PROFILE METHODS
  // ============================================================================

  async getUserProfile(userId) {
    return this.profiles.get(userId);
  }

  async setUserProfile(userId, profileData) {
    const profile = {
      userId,
      ...profileData,
      updatedAt: new Date().toISOString(),
    };

    this.profiles.set(userId, profile);
    console.log(`Profile updated for user: ${userId}`);
    return profile;
  }

  // ============================================================================
  // CARPOOL REQUEST METHODS
  // ============================================================================

  async createCarpoolRequest(requestData) {
    const requestId = randomUUID();
    const request = {
      id: requestId,
      ...requestData,
    };

    this.carpoolRequests.set(requestId, request);
    console.log(`Carpool request created: ${requestId}`);
    return requestId;
  }

  async getCarpoolRequest(requestId) {
    return this.carpoolRequests.get(requestId);
  }

  async getCarpoolRequests() {
    // Return all requests sorted by creation date (newest first)
    return Array.from(this.carpoolRequests.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async updateCarpoolRequest(requestId, updates) {
    const request = this.carpoolRequests.get(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    const updatedRequest = {
      ...request,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.carpoolRequests.set(requestId, updatedRequest);
    console.log(`Carpool request updated: ${requestId}`);
    return updatedRequest;
  }

  async deleteCarpoolRequest(requestId) {
    this.carpoolRequests.delete(requestId);
    console.log(`Carpool request deleted: ${requestId}`);
  }

  // ============================================================================
  // CONVERSATION METHODS
  // ============================================================================

  async createConversation(conversationData) {
    const conversation = {
      ...conversationData,
      createdAt: conversationData.createdAt || new Date().toISOString(),
    };

    this.conversations.set(conversation.id, conversation);
    console.log(`Conversation created: ${conversation.id}`);
    return conversation;
  }

  async getConversation(conversationId) {
    return this.conversations.get(conversationId);
  }

  async getConversations(userId) {
    // Get all conversations where user is a participant
    const userConversations = Array.from(this.conversations.values())
      .filter(conv => conv.participants.includes(userId));

    // For each conversation, get the latest message and other participant info
    const conversationsWithDetails = await Promise.all(
      userConversations.map(async (conv) => {
        const messages = await this.getMessages(conv.id);
        const lastMessage = messages[messages.length - 1];

        // Get other participant's profile
        const otherUserId = conv.participants.find(id => id !== userId);
        const otherProfile = await this.getUserProfile(otherUserId);
        const otherUser = await this.getUser(otherUserId);

        return {
          ...conv,
          lastMessage: lastMessage || null,
          otherUser: {
            id: otherUserId,
            name: otherProfile?.name || otherUser?.name || 'Unknown',
            profilePicture: otherProfile?.profilePicture,
          },
        };
      })
    );

    // Sort by last message time
    return conversationsWithDetails.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.createdAt);
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.createdAt);
      return timeB - timeA;
    });
  }

  async updateConversation(conversationId, updates) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const updated = {
      ...conversation,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.conversations.set(conversationId, updated);
    console.log(`Conversation updated: ${conversationId}`);
    return updated;
  }

  // ============================================================================
  // MESSAGE METHODS
  // ============================================================================

  async createMessage(messageData) {
    const messageId = randomUUID();
    const message = {
      id: messageId,
      ...messageData,
    };

    // Store message
    const conversationId = message.conversationId;
    if (!this.messages.has(conversationId)) {
      this.messages.set(conversationId, []);
    }
    this.messages.get(conversationId).push(message);

    console.log(`Message created in conversation: ${conversationId}`);
    return messageId;
  }

  async getMessages(conversationId) {
    const messages = this.messages.get(conversationId) || [];
    return messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  async clearAll() {
    this.users.clear();
    this.profiles.clear();
    this.carpoolRequests.clear();
    this.conversations.clear();
    this.messages.clear();
    console.log('DataStore cleared');
  }

  async getStats() {
    return {
      users: this.users.size,
      profiles: this.profiles.size,
      carpoolRequests: this.carpoolRequests.size,
      conversations: this.conversations.size,
      totalMessages: Array.from(this.messages.values()).reduce((sum, msgs) => sum + msgs.length, 0),
    };
  }
}
