import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Check, X, Car } from 'lucide-react';
import { UserProfile } from './ProfileSetupPage';
import { Conversation, Message, messagingAPI, realtimeAPI } from '../utils/api/client';

interface MessagesPageProps {
  currentUser: UserProfile & { id: string; email: string };
  messages: any[];
  onBack: () => void;
  onSendMessage: (toUserId: string, message: string) => void;
  onAcceptDM: (userId: string) => void;
  onDenyDM: (userId: string) => void;
}

export function MessagesPage({ currentUser, messages, onBack, onSendMessage, onAcceptDM, onDenyDM }: MessagesPageProps) {
  const [selectedThread, setSelectedThread] = useState(null as string | null);
  const [newMessage, setNewMessage] = useState('');

  const [conversations, setConversations] = useState([] as Conversation[]);
  const [threadMessages, setThreadMessages] = useState([] as Message[]);

  const [acceptedThreads, setAcceptedThreads] = useState(new Set() as Set<string>);
  const [deniedThreads, setDeniedThreads] = useState(new Set() as Set<string>);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedThread) {
      const messageContent = newMessage.trim();
      const tempId = `temp-${Date.now()}`;

      // 乐观更新：立即显示消息
      const optimisticMessage = {
        id: tempId,
        conversationId: selectedThread,
        senderId: currentUser.id,
        content: messageContent,
        createdAt: new Date().toISOString(),
      };

      setThreadMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');

      try {
        // 发送消息到服务器
        const sentMessage = await messagingAPI.sendMessage(selectedThread, messageContent);

        // 替换临时消息为服务器返回的真实消息
        setThreadMessages(prev =>
          prev.map(msg => msg.id === tempId ? sentMessage : msg)
        );

        // 立即刷新消息列表（不等待轮询）
        const messages = await messagingAPI.getMessages(selectedThread);
        setThreadMessages(messages);
      } catch (e) {
        console.error('Failed to send message', e);
        // 发送失败，移除乐观更新的消息
        setThreadMessages(prev => prev.filter(msg => msg.id !== tempId));
        setNewMessage(messageContent); // 恢复消息内容
      }
    }
  };

  const handleAccept = (userId: string) => {
    setAcceptedThreads(new Set([...acceptedThreads, userId]));
    onAcceptDM(userId);
  };

  const handleDeny = (userId: string) => {
    setDeniedThreads(new Set([...deniedThreads, userId]));
    onDenyDM(userId);
  };

  useEffect(() => {
    const sub = realtimeAPI.subscribeToConversations((convs) => {
      setConversations(convs);
      if (!selectedThread && convs.length > 0) {
        setSelectedThread(convs[0].id);
      }
    });
    sub.start();
    return () => sub.stop();
  }, [selectedThread]);

  useEffect(() => {
    if (!selectedThread) {
      setThreadMessages([]);
      return;
    }
    const sub = realtimeAPI.subscribeToMessages(selectedThread, (msgs) => {
      setThreadMessages(msgs);
    });
    sub.start();
    return () => sub.stop();
  }, [selectedThread]);

  const threads = useMemo(() => {
    return conversations
      .filter(c => !deniedThreads.has(c.id))
      .map((c) => {
        const last = c.lastMessage;
        return {
          id: c.id,
          userId: c.otherUser?.id || '',
          userName: c.otherUser?.name || 'Unknown User',
          userCollege: currentUser.college || '',
          hasCar: !!currentUser.hasCar,
          lastMessage: last?.content || '',
          timestamp: last?.createdAt ? new Date(last.createdAt).toLocaleString() : '',
          unread: false,
          isPending: c.status === 'pending',
          userProfile: undefined as UserProfile | undefined,
        };
      });
  }, [conversations, deniedThreads, currentUser]);

  const selectedThreadData = useMemo(() => threads.find(t => t.id === selectedThread), [threads, selectedThread]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-red-600 sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Feed
          </Button>
          <h1 className="font-semibold">Messages</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto h-[calc(100vh-73px)] flex">
        {/* Thread List */}
        <div className="w-80 border-r bg-white overflow-y-auto">
          {threads.map((thread) => {
            const isPending = thread.isPending && !acceptedThreads.has(thread.id);
            return (
              <div
                key={thread.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedThread === thread.id ? 'bg-blue-50' : ''
                  }`}
                onClick={() => setSelectedThread(thread.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(thread.userName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate">{thread.userName}</span>
                      {thread.unread && (
                        <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{thread.userCollege}</p>
                    <div className="flex items-center gap-1 mb-1 flex-wrap">
                      {thread.hasCar && (
                        <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 border-red-300">
                          <Car className="h-3 w-3 mr-1" />
                          Has car
                        </Badge>
                      )}
                      {isPending && (
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{thread.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">{thread.timestamp}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message View */}
        <div className="flex-1 flex flex-col">
          {selectedThread && selectedThreadData ? (
            <>
              {/* Pending Request Alert */}
              {selectedThreadData.isPending && !acceptedThreads.has(selectedThread) && selectedThreadData.userProfile && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border-b-2 border-red-200 p-4">
                  <Card className="p-4 shadow-md border-2 border-red-300">
                    <h3 className="font-medium mb-3 text-gray-900">Message Request</h3>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{getInitials(selectedThreadData.userName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedThreadData.userProfile.name}</p>
                          <p className="text-sm text-gray-600">
                            {selectedThreadData.userProfile.major} • {selectedThreadData.userProfile.year}
                          </p>
                        </div>
                      </div>
                      {selectedThreadData.userProfile.hasCar && (
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-3 rounded-lg border-2 border-red-300">
                          <p className="text-sm font-medium mb-1 text-red-900">Car Information</p>
                          <p className="text-sm text-gray-700">
                            {selectedThreadData.userProfile.carColor} {selectedThreadData.userProfile.carModel}
                          </p>
                          <p className="text-sm text-gray-600">
                            Seats: {selectedThreadData.userProfile.carCapacity}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium mb-1">Bio</p>
                        <p className="text-sm text-gray-600">{selectedThreadData.userProfile.bio}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Contact</p>
                        <p className="text-sm text-gray-600">{selectedThreadData.userProfile.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                        onClick={() => handleAccept(selectedThread)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-2 border-red-600 text-red-600 hover:bg-red-50"
                        onClick={() => handleDeny(selectedThread)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Deny
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {threadMessages.map((m) => {
                    const isOwn =
                      (selectedThreadData?.userId ? m.senderId !== selectedThreadData.userId : false) ||
                      m.senderId === currentUser.id ||
                      m.senderId === currentUser.email;
                    return (
                      <div
                        key={m.id}
                        className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'}`}
                        style={isOwn ? { flexDirection: 'row-reverse' } : undefined}
                      >
                        <div className={`max-w-xs rounded-lg p-3 shadow-sm ${isOwn ? 'ml-auto bg-red-600 text-white' : 'bg-white'}`}>
                          <p className="text-sm">{m.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-red-100' : 'text-gray-400'}`}>
                            {new Date(m.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border-t p-4">
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={2}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">Send</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

