
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: 'Please double-check your email address and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4"
        style={{
            backgroundImage: `url('/login-background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-lg shadow-2xl">
          <CardHeader className="text-center space-y-2">
            {!submitted ? (
              <>
                <Mail className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="text-2xl font-bold font-headline">Forgot Your Password?</CardTitle>
                <CardDescription>No problem. Enter your email below and we'll send you a link to reset it.</CardDescription>
              </>
            ) : (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-success" />
                <CardTitle className="text-2xl font-bold font-headline">Check Your Email</CardTitle>
                <CardDescription>A password reset link has been sent to <span className="font-semibold text-primary">{email}</span>. Please check your inbox and spam folder.</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="sr-only">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full font-semibold" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : (
                <Button onClick={() => window.open('mailto:', '_blank')} className="w-full">
                    Open Email Client
                </Button>
            )}
            <div className="mt-6 text-center text-sm">
              <Link href="/login" className="inline-flex items-center font-semibold text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
