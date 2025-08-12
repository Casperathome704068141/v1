
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
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-navy">
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
        >
            <Card className="bg-surface2 border-white/10 shadow-card">
              <CardHeader className="text-center space-y-2">
                {!submitted ? (
                  <>
                    <div className="inline-block p-3 bg-blue/10 rounded-full mx-auto">
                        <Mail className="h-8 w-8 text-blue" />
                    </div>
                    <CardTitle className="text-3xl font-display">Forgot Your Password?</CardTitle>
                    <CardDescription className="text-slateMuted">Enter your email and we'll send a reset link.</CardDescription>
                  </>
                ) : (
                  <>
                    <div className="inline-block p-3 bg-green/10 rounded-full mx-auto">
                        <CheckCircle className="h-8 w-8 text-green" />
                    </div>
                    <CardTitle className="text-3xl font-display">Check Your Email</CardTitle>
                    <CardDescription className="text-slateMuted">A password reset link has been sent to <span className="font-semibold text-white">{email}</span>.</CardDescription>
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
                        className="h-12 bg-surface1 border-white/10"
                      />
                    </div>
                    <Button type="submit" className="w-full h-12 bg-red text-lg font-bold hover:bg-red/90" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </form>
                ) : (
                    <Button onClick={() => window.open('mailto:', '_blank')} className="w-full h-12 bg-blue text-lg">
                        Open Email Client
                    </Button>
                )}
                <div className="mt-6 text-center text-sm">
                  <Link href="/login" className="inline-flex items-center font-medium text-slateMuted hover:text-white transition-colors">
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
