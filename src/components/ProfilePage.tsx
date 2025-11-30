import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Car, Mail, Phone, GraduationCap, Building2, Edit } from 'lucide-react';
import { UserProfile } from './ProfileSetupPage';

interface ProfilePageProps {
  user: UserProfile & { email: string; userId?: string };
  isCurrentUser: boolean;
  onBack: () => void;
  onSendMessage?: (userId: string) => void;
  onEditProfile?: () => void;
}

export function ProfilePage({ user, isCurrentUser, onBack, onSendMessage, onEditProfile }: ProfilePageProps) {
  const getInitials = (name: string | undefined) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-red-600 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <h1 className="font-semibold">{isCurrentUser ? 'My Profile' : 'Profile'}</h1>
          </div>
          {isCurrentUser && onEditProfile && (
            <Button variant="outline" onClick={onEditProfile} className="border-2 border-red-600 text-red-600 hover:bg-red-50">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-2xl border-2 border-red-600">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarFallback className="text-2xl bg-white text-red-600">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2 text-white">{user.name}</CardTitle>
                <div className="flex items-center gap-2 text-red-100 mb-2">
                  <Building2 className="h-4 w-4" />
                  <span>{user.college}</span>
                </div>
                <div className="flex items-center gap-2 text-red-100 mb-3">
                  <GraduationCap className="h-4 w-4" />
                  <span>{user.major || 'N/A'} • {user.year ? user.year.charAt(0).toUpperCase() + user.year.slice(1) : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {user.hasCar && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white text-red-600 hover:bg-gray-100 border-2 border-white"
                    >
                      <Car className="h-3 w-3 mr-1" />
                      Has a car
                    </Button>
                  )}
                  {!isCurrentUser && onSendMessage && (
                    <Button
                      size="sm"
                      onClick={() => onSendMessage(user.userId || user.email)}
                      className="bg-white text-red-600 hover:bg-gray-100"
                    >
                      Send Message
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {user.bio && (
              <div>
                <h3 className="font-medium mb-2">Bio</h3>
                <p className="text-gray-600">{user.bio}</p>
              </div>
            )}

            {user.hasCar && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border-2 border-red-300">
                <h3 className="font-medium mb-3 text-red-900">Car Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-red-600" />
                    <span className="text-gray-700">
                      {user.carColor} {user.carModel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Passenger Capacity:</span>
                    <span className="text-gray-700">{user.carCapacity} seats</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{user.phoneNumber}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
