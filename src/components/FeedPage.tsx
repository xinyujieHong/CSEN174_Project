import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Calendar, Clock, Users, Car, MessageCircle, User, ArrowRight, Send } from 'lucide-react';
import { UserProfile } from './ProfileSetupPage';
import { carpoolAPI, realtimeAPI } from '../utils/api/client';
import type { CarpoolRequest as ApiCarpoolRequest } from '../utils/api/client';
import { toast } from 'sonner@2.0.3';

interface CarpoolRequest {
  id: string;
  userId: string;
  userName?: string;
  userCollege: string;
  type: 'requesting' | 'offering';
  destination: string;
  date: string;
  time: string;
  seats?: number;
  description: string;
  timestamp: string;
  responses: Response[];
}

interface Response {
  id: string;
  userId: string;
  userName: string;
  userCollege: string;
  message: string;
  hasCar: boolean;
}

interface FeedPageProps {
  currentUser: UserProfile & { id: string; email: string };
  onSendMessage: (toUserId: string, message: string) => void;
  onNavigateToProfile: (userId: string) => void;
  onNavigateToMessages: () => void;
  onLogout: () => void;
}

export function FeedPage({ currentUser, onSendMessage, onNavigateToProfile, onNavigateToMessages, onLogout }: FeedPageProps) {
  const [requests, setRequests] = useState<CarpoolRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch carpool requests on mount and subscribe to updates
  useEffect(() => {
    fetchCarpoolRequests();

    // Subscribe to real-time updates (polling every 5 seconds)
    const subscription = realtimeAPI.subscribeToCarpoolRequests((apiRequests) => {
      setRequests((prev) => {
        const prevById = new Map<string, CarpoolRequest>(prev.map(r => [r.id, r]));
        const mapped: CarpoolRequest[] = apiRequests.map(req => {
          const existing: CarpoolRequest | undefined = prevById.get(req.id);
          // Convert API responses to local Response format
          const responses: Response[] = (req.responses || []).map((r: any, idx: number) => ({
            id: `${req.id}-${idx}`,
            userId: r.userId,
            userName: r.userName || 'User',
            userCollege: r.userCollege || '',
            message: r.message,
            hasCar: r.hasCar || false,
          }));
          return {
            id: req.id,
            userId: req.userId,
            userName: req.userName || '',
            userCollege: existing?.userCollege || '',
            type: (req as any).type === 'offer' ? 'offering' as const : 'requesting' as const,
            destination: req.destination,
            date: req.date,
            time: req.time,
            seats: req.seats || 1,
            description: req.notes || '',
            timestamp: new Date(req.createdAt).toLocaleString(),
            responses,
          };
        });
        return mapped;
      });
    });

    subscription.start();

    return () => subscription.stop();
  }, []);

  const fetchCarpoolRequests = async () => {
    try {
      const apiRequests = await carpoolAPI.getRequests();
      setRequests((prev) => {
        const prevById = new Map<string, CarpoolRequest>(prev.map(r => [r.id, r]));
        const mappedRequests: CarpoolRequest[] = apiRequests.map(req => {
          const existing: CarpoolRequest | undefined = prevById.get(req.id);
          // Convert API responses to local Response format
          const responses: Response[] = (req.responses || []).map((r: any, idx: number) => ({
            id: `${req.id}-${idx}`,
            userId: r.userId,
            userName: r.userName || 'User',
            userCollege: r.userCollege || '',
            message: r.message,
            hasCar: r.hasCar || false,
          }));
          return {
            id: req.id,
            userId: req.userId,
            userName: req.userName || 'Unknown User',
            userCollege: existing?.userCollege || '',
            type: (req as any).type === 'offer' ? 'offering' as const : 'requesting' as const,
            destination: req.destination,
            date: req.date,
            time: req.time,
            seats: req.seats || 1,
            description: req.notes || '',
            timestamp: new Date(req.createdAt).toLocaleString(),
            responses,
          };
        });
        return mappedRequests;
      });
    } catch (error) {
      console.error('Error fetching carpool requests:', error);
      toast.error('Failed to load carpool requests');
    } finally {
      setIsLoading(false);
    }
  };

  const [newRequest, setNewRequest] = useState({
    type: 'requesting' as 'requesting' | 'offering',
    destination: '',
    date: '',
    time: '',
    seats: '1',
    description: '',
  });

  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState<{ [key: string]: string }>({});
  const [filterTab, setFilterTab] = useState<'all' | 'requesting' | 'offering'>('all');

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const apiRequest = await carpoolAPI.createRequest({
        destination: newRequest.destination,
        date: newRequest.date,
        time: newRequest.time,
        seats: parseInt(newRequest.seats),
        notes: newRequest.description,
        type: newRequest.type === 'offering' ? 'offer' : 'request',
      });

      // Add to local state
      const localRequest: CarpoolRequest = {
        id: apiRequest.id,
        userId: apiRequest.userId,
        userName: apiRequest.userName || currentUser.name,
        userCollege: currentUser.college,
        type: newRequest.type,
        destination: apiRequest.destination,
        date: apiRequest.date,
        time: apiRequest.time,
        seats: apiRequest.seats || 1,
        description: apiRequest.notes || '',
        timestamp: new Date(apiRequest.createdAt).toLocaleString(),
        responses: [],
      };

      setRequests([localRequest, ...requests]);
      setNewRequest({ type: 'requesting', destination: '', date: '', time: '', seats: '1', description: '' });
      setShowNewRequestDialog(false);
      toast.success('Carpool request posted!');
    } catch (error: any) {
      console.error('Error creating carpool request:', error);
      toast.error('Failed to post request: ' + (error.message || 'Unknown error'));
    }
  };

  const handleRespond = async (requestId: string) => {
    const message = responseMessage[requestId] || "I'm available for this carpool!";
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    try {
      // Persist response with message to backend
      await carpoolAPI.respondToRequest(requestId, message);

      // Update local UI with full response details
      const newResponse: Response = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userCollege: currentUser.college,
        message,
        hasCar: currentUser.hasCar,
      };
      setRequests(requests.map((r: CarpoolRequest) =>
        r.id === requestId
          ? { ...r, responses: [...r.responses, newResponse] }
          : r
      ));
      setResponseMessage({ ...responseMessage, [requestId]: '' });
      toast.success("Response sent!");
    } catch (error: any) {
      console.error('Error responding to request:', error);
      toast.error('Failed to send response: ' + (error.message || 'Unknown error'));
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const filteredRequests = requests.filter(req => {
    if (filterTab === 'all') return true;
    return req.type === filterTab;
  });

  const renderRequestCard = (request: CarpoolRequest) => (
    <Card key={request.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-2 border-gray-200">
      <div className={`h-2 ${request.type === 'offering' ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-red-500 to-pink-500'}`}></div>
      <CardContent className="p-6 space-y-4">
        {/* User Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              className="h-12 w-12 border-2 border-red-200 cursor-pointer hover:ring-2 hover:ring-red-600 transition-all"
              onClick={() => onNavigateToProfile(request.userId)}
            >
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                {getInitials(request.userName || 'User')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateToProfile(request.userId)}
                  className="font-medium text-gray-900 hover:text-red-600 focus:outline-none"
                >
                  {request.userName}
                </button>
                <Badge
                  variant={request.type === 'offering' ? 'default' : 'secondary'}
                  className={request.type === 'offering'
                    ? 'bg-red-100 text-red-700 hover:bg-red-100 border-red-300'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-100 border-pink-300'
                  }
                >
                  {request.type === 'offering' ? (
                    <><Car className="h-3 w-3 mr-1" />Offering</>
                  ) : (
                    <><Users className="h-3 w-3 mr-1" />Requesting</>
                  )}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{request.userCollege} • {request.timestamp}</p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-xl p-4 space-y-3 border border-red-100">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-red-200">
              <MapPin className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Destination</p>
              <p className="font-medium text-gray-900">{request.destination}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-red-200">
                <Calendar className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">{request.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-red-200">
                <Clock className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-medium text-gray-900">{request.time}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-red-200">
              <Users className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {request.type === 'offering' ? 'Available Seats' : 'Seats Needed'}
              </p>
              <p className="text-sm font-medium text-gray-900">{request.seats}</p>
            </div>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed">{request.description}</p>

        {/* Responses */}
        {request.responses.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">Responses ({request.responses.length})</p>
            {request.responses.map((response) => (
              <div key={response.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Avatar
                  className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-red-600 transition-all"
                  onClick={() => onNavigateToProfile(response.userId)}
                >
                  <AvatarFallback className="text-xs bg-gradient-to-br from-red-500 to-red-600 text-white">
                    {getInitials(response.userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onNavigateToProfile(response.userId)}
                      className="font-medium text-sm hover:text-red-600 focus:outline-none transition-colors"
                    >
                      {response.userName}
                    </button>
                    <span className="text-xs text-gray-500">• {response.userCollege}</span>
                    {response.hasCar && (
                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 border-red-300">
                        <Car className="h-3 w-3 mr-1" />
                        Has car
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{response.message}</p>
                  {request.userId === currentUser.id && response.userId !== currentUser.id && (
                    <Button
                      size="sm"
                      variant="link"
                      className="p-0 h-auto mt-1 text-red-600"
                      onClick={() => onSendMessage(response.userId, `Hi! I saw your response to my carpool request.`)}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Send Message
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Response Input */}
        {request.userId !== currentUser.email && (
          <div className="border-t pt-4 space-y-3">
            <Textarea
              placeholder="Type your response..."
              value={responseMessage[request.id] || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResponseMessage({ ...responseMessage, [request.id]: e.target.value })}
              rows={2}
              className="resize-none"
            />
            <Button
              size="sm"
              onClick={() => handleRespond(request.id)}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              {currentUser.hasCar ? "I'm Available (I have a car)" : "I'm Interested"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-red-600 sticky top-0 z-10 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2.5 rounded-xl shadow-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">CampusPool</h1>
                <p className="text-xs text-gray-500">{currentUser.college}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onNavigateToMessages} className="gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onNavigateToProfile(currentUser.id)} className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Create Request Button */}
        <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-r from-red-600 to-red-700 border-0 text-white">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Post a Carpool</h3>
                    <p className="text-sm text-red-100">Request a ride or offer one to others</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5" />
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Carpool Post</DialogTitle>
              <DialogDescription>
                Request a ride or offer one to fellow students
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="space-y-2">
                <Label>I am...</Label>
                <RadioGroup value={newRequest.type} onValueChange={(value) => setNewRequest({ ...newRequest, type: value as 'requesting' | 'offering' })}>
                  <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:bg-red-50 hover:border-red-300">
                    <RadioGroupItem value="requesting" id="requesting" />
                    <Label htmlFor="requesting" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-red-600" />
                        <span>Requesting a ride</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:bg-red-50 hover:border-red-300">
                    <RadioGroupItem value="offering" id="offering" />
                    <Label htmlFor="offering" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-red-600" />
                        <span>Offering a ride</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="Where are you going?"
                  value={newRequest.destination}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRequest({ ...newRequest, destination: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newRequest.date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRequest({ ...newRequest, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newRequest.time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRequest({ ...newRequest, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seats">
                  {newRequest.type === 'offering' ? 'Available Seats' : 'Seats Needed'}
                </Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  max="7"
                  value={newRequest.seats}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRequest({ ...newRequest, seats: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details..."
                  value={newRequest.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewRequest({ ...newRequest, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                Post to Feed
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Filter Tabs */}
        <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border-2 border-red-200">
            <TabsTrigger value="all" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">All Posts</TabsTrigger>
            <TabsTrigger value="requesting" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Requesting</TabsTrigger>
            <TabsTrigger value="offering" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Offering</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {filteredRequests.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No carpool posts yet. Be the first to post!</p>
              </Card>
            )}
            {filteredRequests.map(renderRequestCard)}
          </TabsContent>

          <TabsContent value="requesting" className="space-y-4 mt-6">
            {filteredRequests.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No ride requests at the moment.</p>
              </Card>
            )}
            {filteredRequests.map(renderRequestCard)}
          </TabsContent>

          <TabsContent value="offering" className="space-y-4 mt-6">
            {filteredRequests.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No ride offers at the moment.</p>
              </Card>
            )}
            {filteredRequests.map(renderRequestCard)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
