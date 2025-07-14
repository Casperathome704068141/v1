
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function SettingsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSendingReset, setIsSendingReset] = useState(false);

    const handlePasswordReset = async () => {
        if (!user?.email) return;

        setIsSendingReset(true);
        try {
            await sendPasswordResetEmail(auth, user.email);
            toast({
                title: 'Password Reset Email Sent',
                description: `A link to reset your password has been sent to ${user.email}.`,
            });
        } catch (error) {
            console.error('Error sending password reset email:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not send password reset email. Please try again later.',
            });
        } finally {
            setIsSendingReset(false);
        }
    };

    const handleDeleteAccount = () => {
        // In a real app, this would involve more complex logic,
        // like re-authenticating the user and then calling a Firebase Function
        // to delete their user data from Auth and Firestore.
        toast({
            title: 'Action Required',
            description: 'Account deletion functionality is not yet implemented.',
        });
    }

    return (
        <AppLayout>
            <main className="flex-1 space-y-6 p-4 md:p-8">
                 <div>
                    <h1 className="font-headline text-3xl font-bold">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences and security.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Password Management</CardTitle>
                        <CardDescription>
                            Change your password by sending a reset link to your email address.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 max-w-lg">
                            <Input value={user?.email || ''} readOnly disabled />
                            <Button onClick={handlePasswordReset} disabled={isSendingReset}>
                                {isSendingReset ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>
                            These actions are permanent and cannot be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button variant="destructive">Delete Account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount}>
                                    Yes, delete my account
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </main>
        </AppLayout>
    )
}
