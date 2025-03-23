
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      // Error is handled in the auth context
      console.error('Login error:', error);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account to continue learning"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              autoComplete="email"
              className="mt-1"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/90"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/90"
            >
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="border-t border-border pt-4">
          <p className="text-xs text-center text-muted-foreground">
            Demo Accounts:
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEmail('admin@nbinstitution.com');
                setPassword('admin123');
                toast.info('Admin credentials filled. Click Sign in to continue.');
              }}
            >
              Admin User
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEmail('user@example.com');
                setPassword('user123');
                toast.info('Demo user credentials filled. Click Sign in to continue.');
              }}
            >
              Demo User
            </Button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
