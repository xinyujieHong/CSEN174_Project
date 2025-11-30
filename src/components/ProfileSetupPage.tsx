import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';

interface ProfileSetupPageProps {
  userName: string;
  existingProfile?: UserProfile;
  isEditing?: boolean;
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export interface UserProfile {
  name: string;
  college: string;
  major: string;
  year: string;
  bio: string;
  hasCar: boolean;
  carModel?: string;
  carColor?: string;
  carCapacity?: number;
  phoneNumber: string;
}

export function ProfileSetupPage({ userName, existingProfile, isEditing = false, onComplete, onCancel }: ProfileSetupPageProps) {
  const [hasCar, setHasCar] = useState(existingProfile?.hasCar || false);
  const [name, setName] = useState(existingProfile?.name || userName);
  const [college, setCollege] = useState(existingProfile?.college || '');
  const [major, setMajor] = useState(existingProfile?.major || '');
  const [year, setYear] = useState(existingProfile?.year || 'freshman');
  const [bio, setBio] = useState(existingProfile?.bio || '');
  const [carModel, setCarModel] = useState(existingProfile?.carModel || '');
  const [carColor, setCarColor] = useState(existingProfile?.carColor || '');
  const [carCapacity, setCarCapacity] = useState(existingProfile?.carCapacity?.toString() || '4');
  const [phoneNumber, setPhoneNumber] = useState(existingProfile?.phoneNumber || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: UserProfile = {
      name,
      college,
      major,
      year,
      bio,
      hasCar,
      phoneNumber,
      ...(hasCar && {
        carModel,
        carColor,
        carCapacity: parseInt(carCapacity),
      }),
    };
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-white p-4 py-8">
      <Card className="max-w-2xl mx-auto shadow-2xl border-2 border-red-600">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <CardTitle className="text-white">{isEditing ? 'Edit Your Profile' : 'Set Up Your Profile'}</CardTitle>
          <CardDescription className="text-red-100">
            {isEditing ? 'Update your information' : 'Tell us about yourself so others can connect with you'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">College/University</Label>
              <Input
                id="college"
                type="text"
                placeholder="State University"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Input
                id="major"
                type="text"
                placeholder="Computer Science"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Year</Label>
              <RadioGroup value={year} onValueChange={setYear}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="freshman" id="freshman" />
                  <Label htmlFor="freshman">Freshman</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sophomore" id="sophomore" />
                  <Label htmlFor="sophomore">Sophomore</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="junior" id="junior" />
                  <Label htmlFor="junior">Junior</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="senior" id="senior" />
                  <Label htmlFor="senior">Senior</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="(555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a bit about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between p-4 border-2 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
              <div className="space-y-0.5">
                <Label htmlFor="hasCar" className="font-medium">I have a car</Label>
                <p className="text-sm text-gray-500">
                  Enable this if you can offer rides
                </p>
              </div>
              <Switch
                id="hasCar"
                checked={hasCar}
                onCheckedChange={setHasCar}
              />
            </div>

            {hasCar && (
              <div className="space-y-4 p-4 border-2 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border-red-300">
                <h3 className="font-medium text-red-900">Car Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="carModel">Car Model</Label>
                  <Input
                    id="carModel"
                    type="text"
                    placeholder="Honda Civic"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    required={hasCar}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carColor">Car Color</Label>
                  <Input
                    id="carColor"
                    type="text"
                    placeholder="Blue"
                    value={carColor}
                    onChange={(e) => setCarColor(e.target.value)}
                    required={hasCar}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carCapacity">Passenger Capacity</Label>
                  <Input
                    id="carCapacity"
                    type="number"
                    min="1"
                    max="7"
                    value={carCapacity}
                    onChange={(e) => setCarCapacity(e.target.value)}
                    required={hasCar}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {isEditing && onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-2 border-gray-300">
                  Cancel
                </Button>
              )}
              <Button type="submit" className={`${isEditing ? 'flex-1' : 'w-full'} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg`}>
                {isEditing ? 'Save Changes' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
