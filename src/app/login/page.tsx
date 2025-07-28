
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ArrowLeft, LogIn, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const GoogleIcon = (props) => <svg role="img" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.98-4.66 1.98-3.55 0-6.43-2.91-6.43-6.48s2.88-6.48 6.43-6.48c2.05 0 3.32.83 4.1 1.62l2.5-2.5C18.16 3.73 15.66 2.53 12.48 2.53c-5.47 0-9.9 4.43-9.9 9.9s4.43 9.9 9.9 9.9c2.78 0 5.03-1.02 6.7-2.72 1.7-1.7 2.37-4.1 2.37-6.52 0-.65-.07-1.25-.16-1.82z"/></svg>;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signInWithGoogle } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4" 
        style={{
            backgroundImage: `url('/login-background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
         <div className="absolute inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-sm"></div>
        <Link href="/" className="absolute top-4 left-4 inline-flex items-center text-foreground/80 hover:text-foreground transition-colors z-10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
        </Link>
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md z-10"
        >
            <Card>
                <CardHeader className="text-center">
                    <Link href="/" className="inline-block mx-auto">
                        <Image src="/logo.svg" alt="Maple Leafs Education Logo" width={48} height={48} />
                    </Link>
                    <CardTitle className="text-2xl font-bold font-headline">Welcome Back</CardTitle>
                    <CardDescription>Sign in to access your student dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
                            <GoogleIcon className="mr-2 h-5 w-5" /> Continue with Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="student@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot?</Link>
                                </div>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                            </div>
                            <Button type="submit" className="w-full font-semibold" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'} <LogIn className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-semibold text-primary hover:underline">
                            Sign up now
                        </Link>
                    </div>
                </CardContent>
                <CardFooter className="justify-center pt-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href="/admin/login" aria-label="Admin Login">
                                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Admin Portal</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardFooter>
            </Card>
        </motion.div>
    </div>
  );
}
