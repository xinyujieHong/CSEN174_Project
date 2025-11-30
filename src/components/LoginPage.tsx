import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Car, Gauge, Fuel, Navigation } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToSignup: () => void;
}

export function LoginPage({ onLogin, onNavigateToSignup }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 p-4 relative overflow-hidden">
      {/* Road lines animation */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute h-full w-2 bg-white left-1/4 animate-pulse"></div>
        <div className="absolute h-full w-2 bg-white right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Decorative dashboard elements */}
      <div className="absolute top-8 left-8 opacity-30">
        <Gauge className="h-16 w-16 text-red-500" />
      </div>
      <div className="absolute bottom-8 right-8 opacity-30">
        <Fuel className="h-16 w-16 text-red-500" />
      </div>

      <Card className="w-full max-w-md shadow-2xl relative z-10 border-2 border-red-600">
        <CardHeader className="space-y-4 text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg pb-8">
          <div className="flex justify-center mb-2">
            {/* Car dashboard style icon */}
            <div className="relative">
              <div className="bg-white p-6 rounded-full shadow-2xl">
                <Car className="h-12 w-12 text-red-600" />
              </div>
              <div className="absolute -top-1 -right-1 bg-red-500 p-2 rounded-full animate-pulse">
                <Navigation className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl text-white">CampusPool</CardTitle>
          <CardDescription className="text-red-100">Your journey starts here</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg">
              Start Your Ride
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">New to CampusPool?</p>
            <button
              onClick={onNavigateToSignup}
              className="text-red-600 hover:text-red-700 font-semibold hover:underline"
            >
              Create Your Account
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
