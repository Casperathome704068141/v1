
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';
import { motion } from 'framer-motion';

const GoogleIcon = (props: any) => <svg role="img" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.98-4.66 1.98-3.55 0-6.43-2.91-6.43-6.48s2.88-6.48 6.43-6.48c2.05 0 3.32.83 4.1 1.62l2.5-2.5C18.16 3.73 15.66 2.53 12.48 2.53c-5.47 0-9.9 4.43-9.9 9.9s4.43 9.9 9.9 9.9c2.78 0 5.03-1.02 6.7-2.72 1.7-1.7 2.37-4.1 2.37-6.52 0-.65-.07-1.25-.16-1.82z"/></svg>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signInWithGoogle } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.push('/dashboard');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password.' });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
        const user = await signInWithGoogle();
        if (user) {
            const idToken = await user.getIdToken();
            await fetch('/api/auth/session', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            router.push('/dashboard');
        } else {
             // This case handles when the user closes the popup.
            setLoading(false);
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Could not sign in with Google.' });
        setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-surface1">
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
        >
            <Card className="bg-surface2 border-white/10 shadow-card">
                <CardHeader className="text-center">
                    <motion.div variants={itemVariants}>
                        <Link href="/" className="inline-block mx-auto mb-4">
                            <Image src="/logo.svg" alt="Maple Leafs Education" width={48} height={48} />
                        </Link>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <CardTitle className="font-display text-3xl">Welcome Back</CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <CardDescription className="text-slateMuted">Sign in to access your dashboard.</CardDescription>
                    </motion.div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <motion.div variants={itemVariants}>
                        <Button variant="outline" className="w-full h-12 text-base hover:bg-white/10" onClick={handleGoogleSignIn} disabled={loading}>
                            <GoogleIcon className="mr-3 h-5 w-5" /> Continue with Google
                        </Button>
                    </motion.div>
                    <motion.div variants={itemVariants} className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface2 px-2 text-slateMuted">Or continue with</span></div>
                    </motion.div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="student@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="h-12 bg-surface1 border-white/10"/>
                        </motion.div>
                        <motion.div variants={itemVariants} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" className="text-sm font-medium text-blue hover:underline">Forgot?</Link>
                            </div>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="h-12 bg-surface1 border-white/10"/>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-blue hover:bg-blue/90" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </motion.div>
                    </form>
                    <motion.div variants={itemVariants} className="mt-4 text-center text-sm text-slateMuted">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-semibold text-blue hover:underline">
                            Sign up now
                        </Link>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    </div>
  );
}
