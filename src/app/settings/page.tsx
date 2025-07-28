
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Lock, Bell, ShieldAlert, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSendingReset, setIsSendingReset] = useState(false);
    const [notifications, setNotifications] = useState({ applicationUpdates: true, promotions: false });

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        setIsSendingReset(true);
        try {
            await sendPasswordResetEmail(auth, user.email);
            toast({ title: 'Password Reset Email Sent', description: `A link has been sent to ${user.email}.` });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not send password reset email.' });
        } finally {
            setIsSendingReset(false);
        }
    };

    const handleDeleteAccount = () => {
        toast({ title: 'Action Required', description: 'Account deletion is not yet implemented.' });
    }

    return (
        <AppLayout>
            <main className="flex-1 space-y-8 p-4 md:p-8">
                 <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences and security.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notifications</CardTitle>
                        <CardDescription>Manage how we contact you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="application-updates">Application Updates</Label>
                                <p className="text-sm text-muted-foreground">Receive email notifications for status changes on your application.</p>
                            </div>
                            <Switch id="application-updates" checked={notifications.applicationUpdates} onCheckedChange={(c) => setNotifications(p => ({...p, applicationUpdates: c}))} />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="promotions">Promotions & News</Label>
                                <p className="text-sm text-muted-foreground">Receive occasional updates about new features and offers.</p>
                            </div>
                            <Switch id="promotions" checked={notifications.promotions} onCheckedChange={(c) => setNotifications(p => ({...p, promotions: c}))} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />Password</CardTitle>
                        <CardDescription>Change your password by sending a reset link to your email.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handlePasswordReset} disabled={isSendingReset}>
                            {isSendingReset ? 'Sending...' : 'Send Password Reset Link'}
                        </Button>
                    </CardContent>
                </Card>

                 <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5" />Danger Zone</CardTitle>
                        <CardDescription>This action is permanent and cannot be undone.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Delete Account</Button></AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete your account and remove all your data from our servers.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAccount}>Yes, delete my account</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </main>
        </AppLayout>
    )
}
