
import React from 'react';
import { Link } from 'react-router-dom';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="max-w-md w-full space-y-8 bg-card rounded-lg shadow-lg p-8 border border-border/50 animate-scale-in">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold tracking-tight text-primary">NB Institution</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-medium tracking-tight">{title}</h2>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
