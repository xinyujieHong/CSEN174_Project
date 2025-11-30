/**
 * Data Store - MySQL Implementation
 * 
 * Implements the data store interface using MySQL.
 */

import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export class MySQLDataStore {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
            queueLimit: 0
        });

        console.log('MySQLDataStore initialized');
    }

    // ============================================================================
    // HELPERS
    // ============================================================================

    _mapUser(row) {
        if (!row) return null;
        return {
            id: row.id,
            email: row.email,
            password: row.password,
            name: row.name,
            createdAt: row.created_at ? row.created_at.toISOString() : null
        };
    }

    _mapProfile(row) {
        if (!row) return null;
        return {
            userId: row.user_id,
            name: row.name,
            college: row.college,
            major: row.major,
            year: row.year,
            phoneNumber: row.phone_number,
            hasCar: Boolean(row.has_car),
            carModel: row.car_model,
            carColor: row.car_color,
            carYear: row.car_year,
            carLicense: row.car_license,
            carCapacity: row.car_capacity,
            bio: row.bio,
            profilePicture: row.profile_picture,
            updatedAt: row.updated_at ? row.updated_at.toISOString() : null
        };
    }

    _mapCarpoolRequest(row) {
        if (!row) return null;
        return {
            id: row.id,
            userId: row.user_id,
            userName: row.user_name,
            userPicture: row.user_picture,
            type: row.type,
            destination: row.destination,
            date: row.date, // MySQL driver returns Date object or string depending on config
            time: row.time,
            seats: row.seats,
            notes: row.notes,
            responses: row.responses, // MySQL JSON type is automatically parsed by mysql2
            createdAt: row.created_at ? row.created_at.toISOString() : null,
            updatedAt: row.updated_at ? row.updated_at.toISOString() : null
        };
    }

    // ============================================================================
    // USER METHODS
    // ============================================================================

    async createUser({ email, password, name }) {
        const id = randomUUID();

        await this.pool.execute(
            'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
            [id, email, password, name]
        );

        console.log(`User created (MySQL): ${id} (${email})`);
        return id;
    }

    async getUser(userId) {
        const [rows] = await this.pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );
        return this._mapUser(rows[0]);
    }

    async getUserByEmail(email) {
        const [rows] = await this.pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return this._mapUser(rows[0]);
    }

    // ============================================================================
    // PROFILE METHODS
    // ============================================================================

    async getUserProfile(userId) {
        const [rows] = await this.pool.execute(
            'SELECT * FROM user_profiles WHERE user_id = ?',
            [userId]
        );
        return this._mapProfile(rows[0]);
    }

    async setUserProfile(userId, profileData) {
        const {
            name,
            college,
            major,
            year,
            phoneNumber,
            hasCar,
            carModel,
            carColor,
            carYear,
            carLicense,
            carCapacity,
            bio,
            profilePicture
        } = profileData;

        const query = `
      INSERT INTO user_profiles 
      (user_id, name, college, major, year, phone_number, has_car, car_model, car_color, car_year, car_license, car_capacity, bio, profile_picture)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      college = VALUES(college),
      major = VALUES(major),
      year = VALUES(year),
      phone_number = VALUES(phone_number),
      has_car = VALUES(has_car),
      car_model = VALUES(car_model),
      car_color = VALUES(car_color),
      car_year = VALUES(car_year),
      car_license = VALUES(car_license),
      car_capacity = VALUES(car_capacity),
      bio = VALUES(bio),
      profile_picture = VALUES(profile_picture)
    `;

        await this.pool.execute(query, [
            userId,
            name,
            college || null,
            major || null,
            year || null,
            phoneNumber || null,
            hasCar || false,
            carModel || null,
            carColor || null,
            carYear || null,
            carLicense || null,
            carCapacity || null,
            bio || null,
            profilePicture || null
        ]);

        console.log(`Profile updated (MySQL) for user: ${userId}`);

        return {
            userId,
            ...profileData,
            updatedAt: new Date().toISOString()
        };
    }

    // ============================================================================
    // CARPOOL REQUEST METHODS
    // ============================================================================

    async createCarpoolRequest(requestData) {
        const id = randomUUID();
        const {
            userId,
            userName,
            userPicture,
            type,
            destination,
            date,
            time,
            seats,
            notes,
            responses = []
        } = requestData;

        const query = `
      INSERT INTO carpool_requests 
      (id, user_id, user_name, user_picture, type, destination, date, time, seats, notes, responses)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        await this.pool.execute(query, [
            id,
            userId,
            userName,
            userPicture || null,
            type || 'request',
            destination,
            date,
            time,
            seats,
            notes || null,
            JSON.stringify(responses)
        ]);

        console.log(`Carpool request created (MySQL): ${id}`);
        return id;
    }

    async getCarpoolRequest(requestId) {
        const [rows] = await this.pool.execute(
            'SELECT * FROM carpool_requests WHERE id = ?',
            [requestId]
        );
        return this._mapCarpoolRequest(rows[0]);
    }

    async getCarpoolRequests() {
        // Return all requests sorted by creation date (newest first)
        const [rows] = await this.pool.execute(
            'SELECT * FROM carpool_requests ORDER BY created_at DESC'
        );
        return rows.map(row => this._mapCarpoolRequest(row));
    }

    async updateCarpoolRequest(requestId, updates) {
        // First check if exists
        const current = await this.getCarpoolRequest(requestId);
        if (!current) {
            throw new Error('Request not found');
        }

        // Build dynamic update query
        const fields = [];
        const values = [];

        if (updates.type !== undefined) { fields.push('type = ?'); values.push(updates.type); }
        if (updates.destination !== undefined) { fields.push('destination = ?'); values.push(updates.destination); }
        if (updates.date !== undefined) { fields.push('date = ?'); values.push(updates.date); }
        if (updates.time !== undefined) { fields.push('time = ?'); values.push(updates.time); }
        if (updates.seats !== undefined) { fields.push('seats = ?'); values.push(updates.seats); }
        if (updates.notes !== undefined) { fields.push('notes = ?'); values.push(updates.notes); }
        if (updates.responses !== undefined) { fields.push('responses = ?'); values.push(JSON.stringify(updates.responses)); }

        if (fields.length === 0) return current;

        values.push(requestId);
        const query = `UPDATE carpool_requests SET ${fields.join(', ')} WHERE id = ?`;

        await this.pool.execute(query, values);
        console.log(`Carpool request updated (MySQL): ${requestId}`);

        // Return updated object
        return this.getCarpoolRequest(requestId);
    }

    async deleteCarpoolRequest(requestId) {
        await this.pool.execute(
            'DELETE FROM carpool_requests WHERE id = ?',
            [requestId]
        );
        console.log(`Carpool request deleted (MySQL): ${requestId}`);
    }

    // ============================================================================
    // CONVERSATION METHODS
    // ============================================================================

    async createConversation(conversationData) {
        const {
            id,
            participants,
            status = 'pending',
            createdAt
        } = conversationData;

        const query = `
      INSERT INTO conversations (id, participants, status, created_at)
      VALUES (?, ?, ?, ?)
    `;

        await this.pool.execute(query, [
            id,
            JSON.stringify(participants),
            status,
            createdAt ? new Date(createdAt) : new Date()
        ]);

        console.log(`Conversation created (MySQL): ${id}`);
        return conversationData;
    }

    async getConversation(conversationId) {
        const [rows] = await this.pool.execute(
            'SELECT * FROM conversations WHERE id = ?',
            [conversationId]
        );

        if (!rows[0]) return null;

        return {
            id: rows[0].id,
            participants: rows[0].participants, // Auto-parsed JSON
            status: rows[0].status,
            createdAt: rows[0].created_at.toISOString(),
            updatedAt: rows[0].updated_at ? rows[0].updated_at.toISOString() : null
        };
    }

    async getConversations(userId) {
        // MySQL 5.7+ supports JSON_CONTAINS. 
        // Check if userId is in the participants JSON array.
        // Note: participants is stored as ["user1", "user2"]
        // JSON_CONTAINS(target, candidate[, path])

        const query = `
      SELECT * FROM conversations 
      WHERE JSON_CONTAINS(participants, JSON_QUOTE(?))
    `;

        const [rows] = await this.pool.execute(query, [userId]);

        const conversationsWithDetails = await Promise.all(
            rows.map(async (row) => {
                const conv = {
                    id: row.id,
                    participants: row.participants,
                    status: row.status,
                    createdAt: row.created_at.toISOString(),
                    updatedAt: row.updated_at ? row.updated_at.toISOString() : null
                };

                const messages = await this.getMessages(conv.id);
                const lastMessage = messages[messages.length - 1];

                // Get other participant's profile
                const otherUserId = conv.participants.find(id => id !== userId);
                let otherUserObj = { id: otherUserId, name: 'Unknown', profilePicture: null };

                if (otherUserId) {
                    const otherProfile = await this.getUserProfile(otherUserId);
                    const otherUser = await this.getUser(otherUserId);

                    otherUserObj = {
                        id: otherUserId,
                        name: otherProfile?.name || otherUser?.name || 'Unknown',
                        profilePicture: otherProfile?.profilePicture,
                    };
                }

                return {
                    ...conv,
                    lastMessage: lastMessage || null,
                    otherUser: otherUserObj,
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
        const fields = [];
        const values = [];

        if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }

        if (fields.length === 0) return this.getConversation(conversationId);

        values.push(conversationId);
        const query = `UPDATE conversations SET ${fields.join(', ')} WHERE id = ?`;

        await this.pool.execute(query, values);
        console.log(`Conversation updated (MySQL): ${conversationId}`);

        return this.getConversation(conversationId);
    }

    // ============================================================================
    // MESSAGE METHODS
    // ============================================================================

    async createMessage(messageData) {
        const id = randomUUID();
        const {
            conversationId,
            senderId,
            content,
            createdAt
        } = messageData;

        const query = `
      INSERT INTO messages (id, conversation_id, sender_id, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;

        await this.pool.execute(query, [
            id,
            conversationId,
            senderId,
            content,
            createdAt ? new Date(createdAt) : new Date()
        ]);

        console.log(`Message created (MySQL) in conversation: ${conversationId}`);
        return id;
    }

    async getMessages(conversationId) {
        const [rows] = await this.pool.execute(
            'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
            [conversationId]
        );

        return rows.map(row => ({
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            content: row.content,
            createdAt: row.created_at.toISOString()
        }));
    }

    async clearAll() {
        // For testing/debug only
        await this.pool.execute('DELETE FROM messages');
        await this.pool.execute('DELETE FROM conversations');
        await this.pool.execute('DELETE FROM carpool_requests');
        await this.pool.execute('DELETE FROM user_profiles');
        await this.pool.execute('DELETE FROM users');
        console.log('MySQL DataStore cleared');
    }

    async getStats() {
        const [userRows] = await this.pool.execute('SELECT COUNT(*) as count FROM users');
        const [profileRows] = await this.pool.execute('SELECT COUNT(*) as count FROM user_profiles');
        const [requestRows] = await this.pool.execute('SELECT COUNT(*) as count FROM carpool_requests');
        const [convRows] = await this.pool.execute('SELECT COUNT(*) as count FROM conversations');
        const [msgRows] = await this.pool.execute('SELECT COUNT(*) as count FROM messages');

        return {
            users: userRows[0].count,
            profiles: profileRows[0].count,
            carpoolRequests: requestRows[0].count,
            conversations: convRows[0].count,
            totalMessages: msgRows[0].count,
        };
    }
}
