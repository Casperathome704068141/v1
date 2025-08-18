
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';
import { motion } from 'framer-motion';

const GoogleIcon = (props) => <svg role="img" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.98-4.66 1.98-3.55 0-6.43-2.91-6.43-6.48s2.88-6.48 6.43-6.48c2.05 0 3.32.83 4.1 1.62l2.5-2.5C18.16 3.73 15.66 2.53 12.48 2.53c-5.47 0-9.9 4.43-9.9 9.9s4.43 9.9 9.9 9.9c2.78 0 5.03-1.02 6.7-2.72 1.7-1.7 2.37-4.1 2.37-6.52 0-.65-.07-1.25-.16-1.82z"/></svg>;

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

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signInWithGoogle } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: 'Password must be at least 6 characters.' });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });

      const idToken = await userCredential.user.getIdToken();
      await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${idToken}`,
          },
      });

      router.push('/dashboard');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: 'This email may already be in use.' });
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
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Could not sign in with Google.' });
        setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
        >
            <Card>
                <CardHeader className="text-center">
                    <motion.div variants={itemVariants}>
                        <Link href="/" className="inline-block mx-auto mb-4">
                            <Image src="/logo.svg" alt="Maple Leafs Education" width={48} height={48} />
                        </Link>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <CardTitle className="font-display text-3xl">Create an Account</CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <CardDescription>Begin your journey to studying in Canada.</CardDescription>
                    </motion.div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <motion.div variants={itemVariants}>
                        <Button variant="outline" className="w-full h-12 text-base" onClick={handleGoogleSignIn} disabled={loading}>
                            <GoogleIcon className="mr-3 h-5 w-5" /> Continue with Google
                        </Button>
                    </motion.div>
                    <motion.div variants={itemVariants} className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or create with email</span></div>
                    </motion.div>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" type="text" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} className="h-12"/>
                        </motion.div>
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="h-12"/>
                        </motion.div>
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="h-12"/>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </motion.div>
                    </form>
                    <motion.div variants={itemVariants} className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Log in
                        </Link>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    </div>
  );
}
