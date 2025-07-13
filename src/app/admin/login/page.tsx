
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

    // IMPORTANT: This is a temporary security check for demonstration purposes.
    // In a production app, this check should be moved to a secure backend.
    // The backend would verify the user's ID token and check for a custom claim like `{ admin: true }`.
    if (email !== 'admin@test.com') {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'This email address is not authorized for admin access.',
      });
      setLoading(false);
      return;
    }

    try {
      // Step 1: Sign in with Firebase Auth on the client.
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Step 2 (Production): Get the ID token from the signed-in user.
      // const idToken = await userCredential.user.getIdToken();

      // Step 3 (Production): Send this token to your backend API endpoint.
      // The backend would then verify the token and check for the `admin: true` custom claim.
      // If the claim exists, the backend would set a secure, httpOnly session cookie.
      // For now, we will just redirect.

      toast({
        title: 'Login Successful',
        description: 'Redirecting to the admin dashboard.',
      });
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
                placeholder="admin@test.com" 
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
