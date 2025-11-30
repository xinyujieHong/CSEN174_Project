import { MessageHandler, Message } from '../MessageHandler';

describe('MessageHandler', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: 'user1',
      receiverId: 'user2',
      content: 'Hello!',
      timestamp: new Date('2025-01-01T10:00:00'),
      status: 'pending',
    },
    {
      id: '2',
      senderId: 'user2',
      receiverId: 'user1',
      content: 'Hi there!',
      timestamp: new Date('2025-01-01T11:00:00'),
      status: 'accepted',
    },
    {
      id: '3',
      senderId: 'user3',
      receiverId: 'user2',
      content: 'Need a ride?',
      timestamp: new Date('2025-01-01T12:00:00'),
      status: 'read',
    },
  ];

  describe('isValidMessageContent', () => {
    test('should validate correct message content', () => {
      expect(MessageHandler.isValidMessageContent('Hello!')).toBe(true);
      expect(MessageHandler.isValidMessageContent('Can you give me a ride?')).toBe(true);
      expect(MessageHandler.isValidMessageContent('a'.repeat(1000))).toBe(true);
    });

    test('should reject invalid message content', () => {
      expect(MessageHandler.isValidMessageContent('')).toBe(false);
      expect(MessageHandler.isValidMessageContent('   ')).toBe(false); // Only whitespace
      expect(MessageHandler.isValidMessageContent('a'.repeat(1001))).toBe(false); // Too long
    });

    test('should handle edge cases', () => {
      expect(MessageHandler.isValidMessageContent('a')).toBe(true); // Minimum
      expect(MessageHandler.isValidMessageContent('a'.repeat(1000))).toBe(true); // Maximum
    });

    test('should handle invalid input types', () => {
      expect(MessageHandler.isValidMessageContent(null as any)).toBe(false);
      expect(MessageHandler.isValidMessageContent(undefined as any)).toBe(false);
      expect(MessageHandler.isValidMessageContent(123 as any)).toBe(false);
    });

    test('should trim whitespace before validation', () => {
      expect(MessageHandler.isValidMessageContent('  message  ')).toBe(true);
    });
  });

  describe('isValidMessageStatus', () => {
    test('should validate correct statuses', () => {
      expect(MessageHandler.isValidMessageStatus('pending')).toBe(true);
      expect(MessageHandler.isValidMessageStatus('accepted')).toBe(true);
      expect(MessageHandler.isValidMessageStatus('denied')).toBe(true);
      expect(MessageHandler.isValidMessageStatus('read')).toBe(true);
    });

    test('should reject invalid statuses', () => {
      expect(MessageHandler.isValidMessageStatus('invalid')).toBe(false);
      expect(MessageHandler.isValidMessageStatus('PENDING')).toBe(false); // Case sensitive
      expect(MessageHandler.isValidMessageStatus('')).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(MessageHandler.isValidMessageStatus(' pending ')).toBe(false); // No trim
    });

    test('should handle invalid input types', () => {
      expect(MessageHandler.isValidMessageStatus(null as any)).toBe(false);
      expect(MessageHandler.isValidMessageStatus(undefined as any)).toBe(false);
      expect(MessageHandler.isValidMessageStatus(123 as any)).toBe(false);
    });

    test('should only accept exact matches', () => {
      expect(MessageHandler.isValidMessageStatus('pendings')).toBe(false);
    });
  });

  describe('filterMessagesByStatus', () => {
    test('should filter messages by status correctly', () => {
      const pending = MessageHandler.filterMessagesByStatus(mockMessages, 'pending');
      expect(pending).toHaveLength(1);
      expect(pending[0].id).toBe('1');

      const accepted = MessageHandler.filterMessagesByStatus(mockMessages, 'accepted');
      expect(accepted).toHaveLength(1);
      expect(accepted[0].id).toBe('2');
    });

    test('should return empty array for non-existent status', () => {
      const denied = MessageHandler.filterMessagesByStatus(mockMessages, 'denied');
      expect(denied).toHaveLength(0);
    });

    test('should handle edge cases', () => {
      expect(MessageHandler.filterMessagesByStatus([], 'pending')).toHaveLength(0);
      expect(MessageHandler.filterMessagesByStatus([mockMessages[0]], 'pending')).toHaveLength(1);
    });

    test('should handle invalid input types', () => {
      expect(MessageHandler.filterMessagesByStatus(null as any, 'pending')).toEqual([]);
      expect(MessageHandler.filterMessagesByStatus(undefined as any, 'pending')).toEqual([]);
      expect(MessageHandler.filterMessagesByStatus('invalid' as any, 'pending')).toEqual([]);
    });

    test('should not modify original array', () => {
      const original = [...mockMessages];
      MessageHandler.filterMessagesByStatus(mockMessages, 'pending');
      expect(mockMessages).toEqual(original);
    });
  });

  describe('getPendingRequests', () => {
    test('should get pending requests for a user', () => {
      const pending = MessageHandler.getPendingRequests(mockMessages, 'user2');
      expect(pending).toHaveLength(1);
      expect(pending[0].id).toBe('1');
      expect(pending[0].receiverId).toBe('user2');
    });

    test('should return empty array when no pending requests', () => {
      const pending = MessageHandler.getPendingRequests(mockMessages, 'user3');
      expect(pending).toHaveLength(0);
    });

    test('should handle edge cases', () => {
      expect(MessageHandler.getPendingRequests([], 'user1')).toHaveLength(0);
      expect(MessageHandler.getPendingRequests(mockMessages, '')).toHaveLength(0);
    });

    test('should handle invalid input types', () => {
      expect(MessageHandler.getPendingRequests(null as any, 'user1')).toEqual([]);
      expect(MessageHandler.getPendingRequests(mockMessages, null as any)).toEqual([]);
    });

    test('should only return messages where user is receiver', () => {
      const pending = MessageHandler.getPendingRequests(mockMessages, 'user1');
      expect(pending).toHaveLength(0); // user1 sent pending message, didn't receive
    });
  });

  describe('sortMessagesByTimestamp', () => {
    test('should sort messages by timestamp (newest first)', () => {
      const sorted = MessageHandler.sortMessagesByTimestamp(mockMessages);
      expect(sorted[0].id).toBe('3'); // Latest
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('1'); // Oldest
    });

    test('should handle edge cases', () => {
      expect(MessageHandler.sortMessagesByTimestamp([])).toHaveLength(0);
      expect(MessageHandler.sortMessagesByTimestamp([mockMessages[0]])).toHaveLength(1);
    });

    test('should handle invalid input types', () => {
      expect(MessageHandler.sortMessagesByTimestamp(null as any)).toEqual([]);
      expect(MessageHandler.sortMessagesByTimestamp(undefined as any)).toEqual([]);
    });

    test('should not modify original array', () => {
      const original = [...mockMessages];
      MessageHandler.sortMessagesByTimestamp(mockMessages);
      expect(mockMessages[0].id).toBe(original[0].id); // Order unchanged
    });

    test('should handle messages with same timestamp', () => {
      const sameTime = [
        { ...mockMessages[0], timestamp: new Date('2025-01-01T10:00:00') },
        { ...mockMessages[1], timestamp: new Date('2025-01-01T10:00:00') },
      ];
      const sorted = MessageHandler.sortMessagesByTimestamp(sameTime);
      expect(sorted).toHaveLength(2);
    });
  });

  describe('groupMessagesByConversation', () => {
    test('should group messages by conversation', () => {
      const conversations = MessageHandler.groupMessagesByConversation(mockMessages, 'user2');
      expect(conversations.size).toBe(2);
      expect(conversations.get('user1')).toHaveLength(2); // Messages between user1 and user2
      expect(conversations.get('user3')).toHaveLength(1); // Message from user3
    });

    test('should handle edge cases', () => {
      const empty = MessageHandler.groupMessagesByConversation([], 'user1');
      expect(empty.size).toBe(0);

      const single = MessageHandler.groupMessagesByConversation([mockMessages[0]], 'user1');
      expect(single.size).toBe(1);
    });

    test('should handle invalid input types', () => {
      expect(MessageHandler.groupMessagesByConversation(null as any, 'user1').size).toBe(0);
      expect(MessageHandler.groupMessagesByConversation(mockMessages, null as any).size).toBe(0);
    });

    test('should correctly identify other user in conversation', () => {
      const conversations = MessageHandler.groupMessagesByConversation(mockMessages, 'user1');
      expect(conversations.has('user2')).toBe(true);
      expect(conversations.has('user1')).toBe(false); // Shouldn't group with self
    });

    test('should handle multiple messages in same conversation', () => {
      const multiMessages: Message[] = [
        { ...mockMessages[0], id: '1', senderId: 'user1', receiverId: 'user2' },
        { ...mockMessages[0], id: '2', senderId: 'user2', receiverId: 'user1' },
        { ...mockMessages[0], id: '3', senderId: 'user1', receiverId: 'user2' },
      ];
      const conversations = MessageHandler.groupMessagesByConversation(multiMessages, 'user1');
      expect(conversations.get('user2')).toHaveLength(3);
    });
  });

  describe('countUnreadMessages', () => {
    test('should count unread messages for a user', () => {
      const count = MessageHandler.countUnreadMessages(mockMessages, 'user2');
      expect(count).toBe(1); // One pending message for user2
    });

    test('should not count read messages', () => {
      const count = MessageHandler.countUnreadMessages(mockMessages, 'user1');
      expect(count).toBe(0); // Accepted message is not counted as unread
    });

    test('should handle edge cases', () => {
      expect(MessageHandler.countUnreadMessages([], 'user1')).toBe(0);
      expect(MessageHandler.countUnreadMessages(mockMessages, '')).toBe(0);
    });

    test('should handle invalid input types', () => {
      expect(MessageHandler.countUnreadMessages(null as any, 'user1')).toBe(0);
      expect(MessageHandler.countUnreadMessages(mockMessages, null as any)).toBe(0);
    });

    test('should only count messages where user is receiver', () => {
      const allUnread: Message[] = mockMessages.map(m => ({ ...m, status: 'pending' as const }));
      const count = MessageHandler.countUnreadMessages(allUnread, 'user2');
      expect(count).toBe(2); // user2 receives messages 1 and 3
    });
  });

  describe('sanitizeMessageContent', () => {
    test('should trim whitespace', () => {
      expect(MessageHandler.sanitizeMessageContent('  hello  ')).toBe('hello');
      expect(MessageHandler.sanitizeMessageContent('test\n')).toBe('test');
    });

    test('should limit length to 1000 characters', () => {
      const longMessage = 'a'.repeat(1500);
      expect(MessageHandler.sanitizeMessageContent(longMessage)).toBe('a'.repeat(1000));
    });

    test('should handle edge cases', () => {
      expect(MessageHandler.sanitizeMessageContent('')).toBe('');
      expect(MessageHandler.sanitizeMessageContent('a')).toBe('a');
    });

    test('should handle invalid input types', () => {
      expect(MessageHandler.sanitizeMessageContent(null as any)).toBe('');
      expect(MessageHandler.sanitizeMessageContent(undefined as any)).toBe('');
      expect(MessageHandler.sanitizeMessageContent(123 as any)).toBe('');
    });

    test('should preserve content within limit', () => {
      const message = 'Hello, can I get a ride?';
      expect(MessageHandler.sanitizeMessageContent(message)).toBe(message);
    });
  });

  describe('canSendMessage', () => {
    test('should allow valid sender-receiver pairs', () => {
      expect(MessageHandler.canSendMessage('user1', 'user2')).toBe(true);
      expect(MessageHandler.canSendMessage('user2', 'user3')).toBe(true);
    });

    test('should not allow sending to self', () => {
      expect(MessageHandler.canSendMessage('user1', 'user1')).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(MessageHandler.canSendMessage('', 'user1')).toBe(false);
      expect(MessageHandler.canSendMessage('user1', '')).toBe(false);
      expect(MessageHandler.canSendMessage('', '')).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(MessageHandler.canSendMessage(null as any, 'user1')).toBe(false);
      expect(MessageHandler.canSendMessage('user1', null as any)).toBe(false);
      expect(MessageHandler.canSendMessage(123 as any, 'user1')).toBe(false);
      expect(MessageHandler.canSendMessage('user1', 456 as any)).toBe(false);
    });

    test('should handle whitespace-only IDs', () => {
      expect(MessageHandler.canSendMessage('   ', 'user1')).toBe(true); // Doesn't trim
      expect(MessageHandler.canSendMessage('user1', '   ')).toBe(true);
    });
  });
});
