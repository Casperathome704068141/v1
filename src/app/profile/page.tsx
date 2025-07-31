
'use client';

import { AppLayout } from '@/components/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon, Lock, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProfileSkeleton = () => (
    <AppLayout>
        <main className="flex-1 space-y-8 p-4 md:p-8">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="md:col-span-2">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </main>
    </AppLayout>
);

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || displayName === user.displayName) return;
    setIsSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      await updateDoc(doc(db, 'users', user.uid), { name: displayName });
      toast({ title: 'Profile Updated', description: 'Your name has been successfully updated.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update your profile.' });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) return <ProfileSkeleton />;

  return (
    <AppLayout>
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Account</h1>
          <p className="text-muted-foreground">Manage your personal information and account settings.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                 <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={user?.photoURL || ''} alt={profile?.name}/>
                            <AvatarFallback className="text-3xl">{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-semibold">{profile?.name}</h2>
                        <p className="text-sm text-muted-foreground">{profile?.email}</p>
                        <Badge className="mt-4" variant={profile?.plan ? 'default' : 'secondary'}>{profile?.plan || 'Free'} Plan</Badge>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                  <CardHeader><CardTitle>Profile Settings</CardTitle><CardDescription>This information is used across the platform.</CardDescription></CardHeader>
                  <form onSubmit={handleProfileUpdate}>
                      <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="displayName">Full Name</Label>
                            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                            <FormDescription>Your legal name, as it appears on your passport.</FormDescription>
                          </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user?.email || ''} disabled />
                             <FormDescription>Email address cannot be changed.</FormDescription>
                          </div>
                      </CardContent>
                       <CardFooter className="border-t px-6 py-4">
                            <Button type="submit" disabled={isSaving || displayName === user?.displayName}>
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                      </CardFooter>
                  </form>
                  <Separator />
                   <CardHeader><CardTitle>Security</CardTitle><CardDescription>Manage your password.</CardDescription></CardHeader>
                   <CardContent>
                       <Button variant="outline" onClick={() => router.push('/forgot-password')}>
                            <Lock className="mr-2 h-4 w-4" />
                            Send Password Reset Email
                        </Button>
                   </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </AppLayout>
  );
}
