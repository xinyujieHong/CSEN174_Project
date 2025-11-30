import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ProfileSetupPage, UserProfile } from './components/ProfileSetupPage';
import { FeedPage } from './components/FeedPage';
import { MessagesPage } from './components/MessagesPage';
import { ProfilePage } from './components/ProfilePage';
import { Button } from './components/ui/button';
import { authAPI, authUtils, profileAPI, messagingAPI } from './utils/api/client';
import { toast, Toaster } from 'sonner@2.0.3';

type Page = 'login' | 'signup' | 'profile-setup' | 'profile-edit' | 'feed' | 'messages' | 'profile';

interface Message {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  content: string;
  timestamp: string;
}

interface RegisteredUser {
  email: string;
  profile: UserProfile;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<(UserProfile & { id: string; email: string }) | null>(null);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [viewingUserProfile, setViewingUserProfile] = useState<(UserProfile & { id: string; email: string }) | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingUserEmail, setPendingUserEmail] = useState('');
  const [pendingUserName, setPendingUserName] = useState('');
  const [pendingUserId, setPendingUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const user = await authAPI.getSession();

      if (user) {
        await loadUserData(user.id);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setIsLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const profile = await profileAPI.getProfile(userId);
      const user = authUtils.getUser();

      if (profile && user) {
        setCurrentUser({
          id: userId,
          email: user.email,
          ...profile,
        });
        setCurrentPage('feed');
      } else if (user) {
        // User exists but no profile - redirect to profile setup
        setPendingUserId(userId);
        setPendingUserEmail(user.email);
        setPendingUserName(user.name);
        setCurrentPage('profile-setup');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await authAPI.signIn(email, password);
      await loadUserData(user.id);
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast.error('Login failed: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      const user = await authAPI.signUp(email, password, name);

      // Set pending data and go to profile setup
      setPendingUserId(user.id);
      setPendingUserEmail(email);
      setPendingUserName(name);
      setCurrentPage('profile-setup');
      toast.success('Account created! Please complete your profile.');
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast.error('Signup failed: ' + (error.message || 'Unknown error'));
    }
  };

  const handleProfileComplete = async (profile: UserProfile) => {
    try {
      await profileAPI.updateProfile(pendingUserId, profile);

      setCurrentUser({
        id: pendingUserId,
        email: pendingUserEmail,
        ...profile,
      });
      setCurrentPage('feed');
      toast.success('Profile completed!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile: ' + (error.message || 'Unknown error'));
    }
  };

  const handleProfileUpdate = async (profile: UserProfile) => {
    if (!currentUser) return;

    try {
      await profileAPI.updateProfile(currentUser.id, profile);

      setCurrentUser({
        ...currentUser,
        ...profile,
      });
      setCurrentPage('profile');
      setViewingUserId(currentUser.id);
      toast.success('Profile updated!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEditProfile = () => {
    setCurrentPage('profile-edit');
  };

  const handleSendMessage = async (toUserId: string, content: string) => {
    if (!currentUser) return;
    try {
      const safeContent = (content && content.trim().length > 0) ? content : 'Hi!';
      const a = String(currentUser.id);
      const b = String(toUserId);
      const conversationId = [a, b].sort().join('__');
      await messagingAPI.sendMessage(conversationId, safeContent, toUserId);
      setCurrentPage('messages');
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message: ' + (error.message || 'Unknown error'));
    }
  };

  const handleNavigateToProfile = (userId: string) => {
    setViewingUserId(userId);
    setCurrentPage('profile');
  };

  const handleAcceptDM = (userId: string) => {
    console.log('Accepted DM from:', userId);
  };

  const handleDenyDM = (userId: string) => {
    console.log('Denied DM from:', userId);
  };

  const handleLogout = async () => {
    try {
      await authAPI.signOut();
      setCurrentUser(null);
      setCurrentPage('login');
      setMessages([]);
      setPendingUserEmail('');
      setPendingUserName('');
      setPendingUserId('');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  useEffect(() => {
    const loadViewingUserProfile = async () => {
      if (!viewingUserId || !currentUser) {
        setViewingUserProfile(null);
        return;
      }

      if (viewingUserId === currentUser.id) {
        setViewingUserProfile(currentUser);
        return;
      }

      setIsLoadingProfile(true);
      try {
        const profile = await profileAPI.getProfile(viewingUserId);
        if (profile) {
          setViewingUserProfile({
            id: viewingUserId,
            email: profile.userId || viewingUserId,
            ...profile,
          });
        } else {
          setViewingUserProfile(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setViewingUserProfile(null);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadViewingUserProfile();
  }, [viewingUserId, currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CampusPool...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onNavigateToSignup={() => setCurrentPage('signup')}
        />
      )}

      {currentPage === 'signup' && (
        <SignupPage
          onSignup={handleSignup}
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'profile-setup' && (
        <ProfileSetupPage
          userName={pendingUserName}
          onComplete={handleProfileComplete}
        />
      )}

      {currentPage === 'profile-edit' && currentUser && (
        <ProfileSetupPage
          userName={currentUser.name}
          existingProfile={currentUser}
          isEditing={true}
          onComplete={handleProfileUpdate}
          onCancel={() => {
            setCurrentPage('profile');
            setViewingUserId(currentUser.id);
          }}
        />
      )}

      {currentPage === 'feed' && currentUser && (
        <FeedPage
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToMessages={() => setCurrentPage('messages')}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'messages' && currentUser && (
        <MessagesPage
          currentUser={currentUser}
          messages={messages}
          onBack={() => setCurrentPage('feed')}
          onSendMessage={handleSendMessage}
          onAcceptDM={handleAcceptDM}
          onDenyDM={handleDenyDM}
        />
      )}

      {currentPage === 'profile' && currentUser && viewingUserId && (
        <>
          {isLoadingProfile ? (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-white flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          ) : viewingUserProfile ? (
            <ProfilePage
              user={viewingUserProfile}
              isCurrentUser={viewingUserId === currentUser.id}
              onBack={() => setCurrentPage('feed')}
              onSendMessage={viewingUserProfile ? (userId: string) => {
                handleSendMessage(userId, '');
                setCurrentPage('messages');
              } : undefined}
              onEditProfile={viewingUserId === currentUser.id ? handleEditProfile : undefined}
            />
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-white flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Profile not found</p>
                <Button onClick={() => setCurrentPage('feed')}>Back to Feed</Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
