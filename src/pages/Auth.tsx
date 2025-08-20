import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import CloudShader from '@/components/CloudShader';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  
  const { user, signIn, signUp, resetPassword, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === 'true') {
      setIsReset(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isReset) {
      const { error } = await resetPassword(formData.email);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Check your email for the reset link.",
        });
        setIsReset(false);
      }
      return;
    }

    if (isLogin) {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      if (!formData.fullName.trim()) {
        toast({
          title: "Full name required",
          description: "Please enter your full name.",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <CloudShader />
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="glass-card p-4 rounded-2xl">
              <img src="/lovable-uploads/d35c1ea8-0548-4b9b-a567-8c365d98d96e.png" alt="Hyperelational" className="h-8 w-8 animate-glow" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Hyperelational
          </h1>
          <p className="text-muted-foreground">
            {isReset 
              ? 'Reset your password' 
              : isLogin 
                ? 'Sign in to your dashboard' 
                : 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <GlassCard variant="hover" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && !isReset && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="bg-input/50 backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="bg-input/50 backdrop-blur-sm"
                placeholder="Enter your email"
              />
            </div>
            
            {!isReset && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-input/50 backdrop-blur-sm pr-12"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-auto p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full gradient-primary hover:opacity-90 transition-smooth"
              size="lg"
            >
              {isReset 
                ? 'Send Reset Email' 
                : isLogin 
                  ? 'Sign In' 
                  : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            {!isReset && (
              <>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:text-primary-light transition-smooth text-sm"
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"}
                  </button>
                </div>
                
                {isLogin && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsReset(true)}
                      className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </>
            )}
            
            {isReset && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsReset(false)}
                  className="text-primary hover:text-primary-light transition-smooth text-sm"
                >
                  Back to sign in
                </button>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Auth;