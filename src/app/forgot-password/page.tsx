
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
    <div className="flex min-h-screen w-full items-center justify-center p-4 relative overflow-hidden">
        <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 opacity-30 dark:opacity-50 animate-background-pan"
            style={{
                backgroundSize: '200% 200%',
            }}
        />
        <div className="absolute inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-lg"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-2">
            {!submitted ? (
              <>
                <div className="inline-block p-3 bg-primary/10 rounded-full mx-auto">
                    <Mail className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-3xl font-black tracking-tighter">Forgot Your Password?</CardTitle>
                <CardDescription className="text-lg">No problem. Enter your email below and we'll send you a link to reset it.</CardDescription>
              </>
            ) : (
              <>
                <div className="inline-block p-3 bg-success/10 rounded-full mx-auto">
                    <CheckCircle className="h-12 w-12 text-success" />
                </div>
                <CardTitle className="text-3xl font-black tracking-tighter">Check Your Email</CardTitle>
                <CardDescription className="text-lg">A password reset link has been sent to <span className="font-semibold text-primary">{email}</span>. Please check your inbox and spam folder.</CardDescription>
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
                    className="py-6 text-lg"
                  />
                </div>
                <Button type="submit" className="w-full font-semibold text-lg py-6 bg-electric-violet hover:bg-[#8A2BE2]/90" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : (
                <Button onClick={() => window.open('mailto:', '_blank')} className="w-full text-lg py-6">
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
