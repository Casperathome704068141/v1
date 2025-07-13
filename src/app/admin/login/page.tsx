
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // IMPORTANT: This is a temporary security check.
    // In a production app, you should use Firebase Custom Claims to verify admin status.
    // This check only allows a specific email to attempt a sign-in here.
    if (email !== 'admin@yourapp.com') {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'This email address is not authorized for admin access.',
      });
      setLoading(false);
      return;
    }

    try {
      // Attempt to sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: 'Login Successful',
        description: 'Redirecting to the admin dashboard.',
      });
      // In a real app with custom claims, you'd set a session cookie here.
      router.push('/admin/dashboard');

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials for admin access.',
      });
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4">
                <Shield className="h-8 w-8" />
            </div>
          <CardTitle className="font-headline text-3xl font-black text-foreground">
            Staff Portal
          </CardTitle>
          <CardDescription>Please enter your administrator credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@yourapp.com" 
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
            <Button type="submit" className="w-full font-bold" disabled={loading}>
              {loading ? 'Authenticating...' : 'Log In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
