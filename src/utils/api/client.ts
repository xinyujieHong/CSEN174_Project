/**
 * Generic API Client for CampusPool
 * Works with any backend that implements the API contract
 */

import { config } from '../config';

// Configuration
// Get API URL from config or window object (for dynamic configuration)
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && (window as any).CAMPUSPOOL_API_URL) {
    return (window as any).CAMPUSPOOL_API_URL;
  }
  return config.apiUrl;
};

const API_BASE_URL = getApiBaseUrl();

// Storage keys
const TOKEN_KEY = 'campuspool_auth_token';
const USER_KEY = 'campuspool_user';

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  college: string;
  hasCar: boolean;
  carModel?: string;
  carColor?: string;
  bio?: string;
  profilePicture?: string;
  updatedAt?: string;
}

export interface CarpoolRequest {
  id: string;
  userId: string;
  userName?: string;
  userPicture?: string;
  destination: string;
  date: string;
  time: string;
  seats?: number;
  notes?: string;
  type?: 'offer' | 'request';
  createdAt: string;
  responses?: Array<string | { userId: string; message: string; timestamp: string }>;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  status: 'pending' | 'accepted' | 'denied';
  createdAt: string;
  lastMessage?: Message;
  otherUser: {
    id: string;
    name: string;
    profilePicture?: string;
  };
}

// ============================================================================
// AUTH UTILITIES
// ============================================================================

export const authUtils = {
  getToken: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  getUser: (): User | null => {
    const userStr = sessionStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser: (user: User): void => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    sessionStorage.removeItem(USER_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },
};

// ============================================================================
// HTTP CLIENT
// ============================================================================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = authUtils.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const client = new ApiClient(API_BASE_URL);

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  signUp: async (email: string, password: string, name: string): Promise<User> => {
    const response = await client.post<AuthResponse>('/auth/signup', {
      email,
      password,
      name,
    });

    authUtils.setToken(response.token);
    authUtils.setUser(response.user);

    return response.user;
  },

  signIn: async (email: string, password: string): Promise<User> => {
    const response = await client.post<AuthResponse>('/auth/signin', {
      email,
      password,
    });

    authUtils.setToken(response.token);
    authUtils.setUser(response.user);

    return response.user;
  },

  signOut: async (): Promise<void> => {
    try {
      await client.post('/auth/signout');
    } finally {
      authUtils.removeToken();
      authUtils.removeUser();
    }
  },

  getSession: async (): Promise<User | null> => {
    if (!authUtils.isAuthenticated()) {
      return null;
    }

    try {
      const response = await client.get<{ user: User }>('/auth/session');
      authUtils.setUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Session validation failed:', error);
      authUtils.removeToken();
      authUtils.removeUser();
      return null;
    }
  },
};

// ============================================================================
// USER PROFILE API
// ============================================================================

export const profileAPI = {
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      return await client.get<UserProfile>(`/users/${userId}`);
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
  },

  updateProfile: async (userId: string, profileData: Partial<UserProfile>): Promise<void> => {
    await client.post(`/users/${userId}`, profileData);
  },
};

// ============================================================================
// CARPOOL REQUEST API
// ============================================================================

export const carpoolAPI = {
  getRequests: async (): Promise<CarpoolRequest[]> => {
    return await client.get<CarpoolRequest[]>('/carpool-requests');
  },

  createRequest: async (requestData: Omit<CarpoolRequest, 'id' | 'userId' | 'createdAt'>): Promise<CarpoolRequest> => {
    const response = await client.post<{ request: CarpoolRequest }>('/carpool-requests', requestData);
    return response.request;
  },

  updateRequest: async (requestId: string, updates: Partial<CarpoolRequest>): Promise<void> => {
    await client.put(`/carpool-requests/${requestId}`, updates);
  },

  deleteRequest: async (requestId: string): Promise<void> => {
    await client.delete(`/carpool-requests/${requestId}`);
  },

  respondToRequest: async (requestId: string, message?: string): Promise<void> => {
    await client.post(`/carpool-requests/${requestId}/respond`, { message });
  },
};

// ============================================================================
// MESSAGING API
// ============================================================================

export const messagingAPI = {
  getConversations: async (): Promise<Conversation[]> => {
    return await client.get<Conversation[]>('/conversations');
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    return await client.get<Message[]>(`/conversations/${conversationId}/messages`);
  },

  sendMessage: async (conversationId: string, content: string, otherUserId?: string): Promise<Message> => {
    const payload: any = { content };
    if (otherUserId) {
      payload.otherUserId = otherUserId;
    }

    const response = await client.post<{ data: Message }>(`/conversations/${conversationId}/messages`, payload);
    return response.data;
  },

  updateConversationStatus: async (conversationId: string, status: 'accepted' | 'denied'): Promise<void> => {
    await client.put(`/conversations/${conversationId}`, { status });
  },
};

// ============================================================================
// REAL-TIME UPDATES (Polling Implementation)
// ============================================================================

/**
 * Since this is a generic backend without WebSocket support,
 * we use polling for real-time updates. This can be replaced with
 * WebSocket, SSE, or other real-time solutions.
 */

export class RealtimeSubscription {
  private intervalId: number | null = null;

  constructor(
    private callback: () => Promise<void>,
    private interval: number = config.pollingInterval
  ) { }

  start(): void {
    if (this.intervalId !== null) return;

    // Call immediately
    this.callback();

    // Then poll at interval
    this.intervalId = window.setInterval(() => {
      this.callback();
    }, this.interval);
  }

  stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const realtimeAPI = {
  subscribeToConversations: (callback: (conversations: Conversation[]) => void): RealtimeSubscription => {
    return new RealtimeSubscription(async () => {
      try {
        const conversations = await messagingAPI.getConversations();
        callback(conversations);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    });
  },

  subscribeToMessages: (conversationId: string, callback: (messages: Message[]) => void): RealtimeSubscription => {
    return new RealtimeSubscription(async () => {
      try {
        const messages = await messagingAPI.getMessages(conversationId);
        callback(messages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    });
  },

  subscribeToCarpoolRequests: (callback: (requests: CarpoolRequest[]) => void): RealtimeSubscription => {
    return new RealtimeSubscription(async () => {
      try {
        const requests = await carpoolAPI.getRequests();
        callback(requests);
      } catch (error) {
        console.error('Failed to fetch carpool requests:', error);
      }
    });
  },
};
