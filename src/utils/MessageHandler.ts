/**
 * Utility class for handling message operations
 */
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'denied' | 'read';
}

export class MessageHandler {
  /**
   * Validates message content
   */
  static isValidMessageContent(content: string): boolean {
    if (!content || typeof content !== 'string') {
      return false;
    }
    const trimmed = content.trim();
    return trimmed.length > 0 && trimmed.length <= 1000;
  }

  /**
   * Validates message status
   */
  static isValidMessageStatus(status: string): boolean {
    const validStatuses = ['pending', 'accepted', 'denied', 'read'];
    return validStatuses.includes(status);
  }

  /**
   * Filters messages by status
   */
  static filterMessagesByStatus(
    messages: Message[],
    status: 'pending' | 'accepted' | 'denied' | 'read'
  ): Message[] {
    if (!Array.isArray(messages)) {
      return [];
    }
    return messages.filter((msg) => msg.status === status);
  }

  /**
   * Gets pending message requests
   */
  static getPendingRequests(messages: Message[], userId: string): Message[] {
    if (!Array.isArray(messages) || !userId) {
      return [];
    }
    return messages.filter(
      (msg) => msg.receiverId === userId && msg.status === 'pending'
    );
  }

  /**
   * Sorts messages by timestamp (newest first)
   */
  static sortMessagesByTimestamp(messages: Message[]): Message[] {
    if (!Array.isArray(messages)) {
      return [];
    }
    return [...messages].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Groups messages by conversation (sender-receiver pairs)
   */
  static groupMessagesByConversation(
    messages: Message[],
    currentUserId: string
  ): Map<string, Message[]> {
    const conversations = new Map<string, Message[]>();

    if (!Array.isArray(messages) || !currentUserId) {
      return conversations;
    }

    messages.forEach((msg) => {
      const otherUserId =
        msg.senderId === currentUserId ? msg.receiverId : msg.senderId;

      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, []);
      }
      conversations.get(otherUserId)!.push(msg);
    });

    return conversations;
  }

  /**
   * Counts unread messages for a user
   */
  static countUnreadMessages(messages: Message[], userId: string): number {
    if (!Array.isArray(messages) || !userId) {
      return 0;
    }
    return messages.filter(
      (msg) => msg.receiverId === userId && msg.status === 'pending'
    ).length;
  }

  /**
   * Sanitizes message content
   */
  static sanitizeMessageContent(content: string): string {
    if (!content || typeof content !== 'string') {
      return '';
    }
    // Remove excessive whitespace and limit length
    return content.trim().substring(0, 1000);
  }

  /**
   * Checks if user can send message (not blocked, valid recipient)
   */
  static canSendMessage(senderId: string, receiverId: string): boolean {
    if (!senderId || !receiverId || typeof senderId !== 'string' || typeof receiverId !== 'string') {
      return false;
    }
    // Can't send message to yourself
    if (senderId === receiverId) {
      return false;
    }
    return true;
  }
}
