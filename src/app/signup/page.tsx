
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
import { ArrowLeft, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const GoogleIcon = (props) => <svg role="img" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.98-4.66 1.98-3.55 0-6.43-2.91-6.43-6.48s2.88-6.48 6.43-6.48c2.05 0 3.32.83 4.1 1.62l2.5-2.5C18.16 3.73 15.66 2.53 12.48 2.53c-5.47 0-9.9 4.43-9.9 9.9s4.43 9.9 9.9 9.9c2.78 0 5.03-1.02 6.7-2.72 1.7-1.7 2.37-4.1 2.37-6.52 0-.65-.07-1.25-.16-1.82z"/></svg>;

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
      router.push('/dashboard');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: 'This email may already be in use.' });
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
        <Link href="/" className="absolute top-4 left-4 inline-flex items-center text-foreground/80 hover:text-foreground transition-colors z-10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
        </Link>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md z-10"
        >
            <Card className="border-border/50 shadow-xl">
                <CardHeader className="text-center">
                    <Link href="/" className="inline-block mx-auto mb-4">
                        <Image src="/logo.svg" alt="Maple Leafs Education Logo" width={48} height={48} />
                    </Link>
                    <CardTitle className="text-3xl font-black tracking-tighter">Create an Account</CardTitle>
                    <CardDescription className="text-lg">Begin your journey to studying in Canada.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Button variant="outline" className="w-full font-semibold text-lg py-6" onClick={signInWithGoogle}>
                            <GoogleIcon className="mr-3 h-6 w-6" /> Continue with Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or create with email</span></div>
                        </div>
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" type="text" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} className="py-6"/>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="py-6"/>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="py-6"/>
                            </div>
                            <Button type="submit" className="w-full font-semibold text-lg py-6 bg-electric-violet hover:bg-electric-violet/90" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'} <UserPlus className="ml-2 h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Log in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    </div>
  );
}
