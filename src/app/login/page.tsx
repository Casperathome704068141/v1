
'use client';

export const dynamic = 'force-dynamic';
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
import { Briefcase, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.98-4.66 1.98-3.55 0-6.43-2.91-6.43-6.48s2.88-6.48 6.43-6.48c2.05 0 3.32.83 4.1 1.62l2.5-2.5C18.16 3.73 15.66 2.53 12.48 2.53c-5.47 0-9.9 4.43-9.9 9.9s4.43 9.9 9.9 9.9c2.78 0 5.03-1.02 6.7-2.72 1.7-1.7 2.37-4.1 2.37-6.52 0-.65-.07-1.25-.16-1.82z"
    />
  </svg>
);

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
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-full bg-background">
       <div className="relative flex flex-col justify-end w-full lg:h-auto lg:w-1/2 p-8 lg:p-12 text-primary-foreground min-h-[300px] sm:min-h-[400px]">
         <Image 
            src="/login-background.jpg"
            alt="Students studying in Canada"
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="university students"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
         <div className="relative z-10">
            <h1 className="text-3xl lg:text-5xl font-black font-headline tracking-tighter">Your Journey to Canadian Education Starts Here.</h1>
            <p className="mt-4 text-base lg:text-lg max-w-lg">Access our AI-powered platform to find the perfect college and streamline your application.</p>
         </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-8 md:p-12">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-lg animate-fade-in">
          <Link href="/admin/login" className="absolute top-2 right-2">
              <Button variant="ghost" size="icon" aria-label="Admin Login">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
              </Button>
          </Link>
          <CardHeader className="text-center items-center">
            <Image src="/logo.svg" alt="Maple Leafs Education Logo" width={72} height={72} className="text-primary"/>
            <CardTitle className="font-headline text-3xl font-black text-foreground">
              Maple Leafs Education
            </CardTitle>
            <CardDescription>Welcome back! Please enter your details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="student@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary/90 hover:text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full font-bold" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Button variant="outline" onClick={signInWithGoogle}><GoogleIcon className="mr-2 h-4 w-4" /> Google</Button>
            </div>
            <div className="mt-6 text-center text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary/90 hover:text-primary hover:underline">
                Sign up
              </Link>
            </div>
            <div className="mt-4 text-center text-sm">
                 <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
