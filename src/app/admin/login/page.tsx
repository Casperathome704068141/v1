
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const idTokenResult = await userCredential.user.getIdTokenResult();
      
      if (!idTokenResult.claims.admin) {
         await auth.signOut();
         toast({
           variant: 'destructive',
           title: 'Authorization Failed',
           description: 'You do not have permission to access this area.',
         });
         setLoading(false);
         return;
      }
      
      toast({
        title: 'Login Successful',
        description: 'Redirecting to the admin dashboard.',
      });
      router.push('/admin/dashboard');

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials or you are not authorized.',
      });
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
        <Link href="/" className="absolute top-4 left-4 inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
        </Link>
        <div className="w-full max-w-md">
            <div className="text-center mb-6 animate-fade-in">
                <Link href="/" aria-label="Maple Leafs Education logo">
                    <Image src="/logo-full.svg" alt="Maple Leafs Education" width={80} height={80} className="text-primary mx-auto"/>
                </Link>
                <h1 className="text-2xl font-bold mt-4">Admin Portal</h1>
                <p className="text-muted-foreground">Please sign in with your staff credentials.</p>
            </div>
            <Card className="w-full animate-fade-in [animation-delay:200ms]">
                <CardContent className="p-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="admin@mapleleafs.edu" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        </div>
                        <Button type="submit" className="w-full font-semibold" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
