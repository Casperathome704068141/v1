
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { useState, FormEvent } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon, Lock, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProfileSkeleton = () => (
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
);

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !auth.currentUser || displayName === user.displayName) return;
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

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: "Password Reset Email Sent",
        description: `An email has been sent to ${user.email} with instructions.`
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: 'Could not send the password reset email.'
      })
    }
  }
  
  if (loading) return <ProfileSkeleton />;

  return (
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-display tracking-tight">Your Account</h1>
          <p className="text-slateMuted">Manage your personal information and account settings.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                 <Card className="bg-surface1 border-white/10">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-blue">
                            <AvatarFallback className="text-3xl bg-surface2">{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-semibold">{profile?.name}</h2>
                        <p className="text-sm text-slateMuted">{profile?.email}</p>
                        <Badge className="mt-4" variant={profile?.plan ? 'default' : 'secondary'}>{profile?.plan || 'Free'} Plan</Badge>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card className="bg-surface1 border-white/10">
                  <CardHeader><CardTitle className="font-display">Profile Settings</CardTitle><CardDescription className="text-slateMuted">This information is used across the platform.</CardDescription></CardHeader>
                  <form onSubmit={handleProfileUpdate}>
                      <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="displayName">Full Name</Label>
                            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                            <p className="text-sm text-slateMuted">Your legal name, as it appears on your passport.</p>
                          </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user?.email || ''} disabled />
                            <p className="text-sm text-slateMuted">Email address cannot be changed.</p>
                          </div>
                      </CardContent>
                       <CardFooter className="border-t border-white/10 px-6 py-4">
                            <Button type="submit" disabled={isSaving || displayName === user?.displayName} className="bg-blue hover:bg-blue/90">
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                      </CardFooter>
                  </form>
                  <Separator className="border-white/10" />
                   <CardHeader><CardTitle className="font-display">Security</CardTitle><CardDescription className="text-slateMuted">Manage your password.</CardDescription></CardHeader>
                   <CardContent>
                       <Button variant="outline" onClick={handlePasswordReset}>
                            <Lock className="mr-2 h-4 w-4" />
                            Send Password Reset Email
                        </Button>
                   </CardContent>
                </Card>
            </div>
        </div>
      </main>
  );
}
