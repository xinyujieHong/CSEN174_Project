import React, { useState, type FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Car, UserPlus } from 'lucide-react';

interface SignupPageProps {
  onSignup: (email: string, password: string, name: string) => void;
  onNavigateToLogin: () => void;
}

export function SignupPage({ onSignup, onNavigateToLogin }: SignupPageProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const ALLOWED_EDU_DOMAIN: string = '';

  const isEduEmail = (value: string) => {
    if (ALLOWED_EDU_DOMAIN && ALLOWED_EDU_DOMAIN.includes('.')) {
      const escaped = ALLOWED_EDU_DOMAIN.replace('.', '\\.');
      const re = new RegExp(`^[A-Za-z0-9._%+-]+@${escaped}$`, 'i');
      return re.test(value);
    }
    const re = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+edu$/i;
    return re.test(value);
  };

  const isStrongPassword = (value: string) => {
    const hasMinLen = value.length >= 8;
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasDigit = /\d/.test(value);
    return hasMinLen && hasLower && hasUpper && hasDigit;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const emailOk = isEduEmail(email);
    const passOk = isStrongPassword(password);
    const confirmOk = password === confirmPassword;

    setEmailError(emailOk ? null : (ALLOWED_EDU_DOMAIN ? `Email must be @${ALLOWED_EDU_DOMAIN}` : 'Email must end with .edu'));
    setPasswordError(passOk ? null : 'Password must be ≥8 chars, with upper, lower, and a number');
    setConfirmError(confirmOk ? null : 'Passwords do not match');

    if (email && name && password && emailOk && passOk && confirmOk) {
      onSignup(email, password, name);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-red-600">
        <CardHeader className="space-y-4 text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <div className="flex justify-center mb-2">
            <div className="bg-white p-5 rounded-full shadow-2xl">
              <UserPlus className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Join CampusPool</CardTitle>
          <CardDescription className="text-red-100">Create your account and start carpooling</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">College Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@college.edu"
                value={email}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmail(v);
                  if (!v) {
                    setEmailError(null);
                  } else {
                    setEmailError(isEduEmail(v) ? null : (ALLOWED_EDU_DOMAIN ? `Email must be @${ALLOWED_EDU_DOMAIN}` : 'Email must end with .edu'));
                  }
                }}
                required
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
              {emailError && <p className="text-sm text-red-600">{emailError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  const v = e.target.value;
                  setPassword(v);
                  if (!v) {
                    setPasswordError(null);
                  } else {
                    setPasswordError(isStrongPassword(v) ? null : 'Password must be ≥8 chars, with upper, lower, and a number');
                  }
                  setConfirmError(v === confirmPassword ? null : (confirmPassword ? 'Passwords do not match' : null));
                }}
                required
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
              <p className="text-xs text-gray-500">
                At least 8 characters, include uppercase, lowercase, and a number.
              </p>
              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  const v = e.target.value;
                  setConfirmPassword(v);
                  setConfirmError(v === password ? null : (v ? 'Passwords do not match' : null));
                }}
                required
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
              {confirmError && <p className="text-sm text-red-600">{confirmError}</p>}
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg">
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
            <button
              onClick={onNavigateToLogin}
              className="text-red-600 hover:text-red-700 font-semibold hover:underline"
            >
              Login Here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
