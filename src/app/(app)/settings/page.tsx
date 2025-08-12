
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/context/ui/label';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Lock, Bell, ShieldAlert, Trash2 } from 'lucide-react';
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
        <main className="flex-1 space-y-8 p-4 md:p-8">
             <div>
                <h1 className="text-3xl font-display tracking-tight">Settings</h1>
                <p className="text-slateMuted">Manage your account preferences and security.</p>
            </div>

            <Card className="bg-surface1 border-white/10">
                <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2"><Bell className="h-5 w-5" />Notifications</CardTitle>
                    <CardDescription className="text-slateMuted">Manage how we contact you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border border-white/10 p-4">
                        <div>
                            <Label htmlFor="application-updates">Application Updates</Label>
                            <p className="text-sm text-slateMuted">Receive email notifications for status changes on your application.</p>
                        </div>
                        <Switch id="application-updates" checked={notifications.applicationUpdates} onCheckedChange={(c) => setNotifications(p => ({...p, applicationUpdates: c}))} />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border border-white/10 p-4">
                        <div>
                            <Label htmlFor="promotions">Promotions & News</Label>
                            <p className="text-sm text-slateMuted">Receive occasional updates about new features and offers.</p>
                        </div>
                        <Switch id="promotions" checked={notifications.promotions} onCheckedChange={(c) => setNotifications(p => ({...p, promotions: c}))} />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-surface1 border-white/10">
                <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2"><Lock className="h-5 w-5" />Password</CardTitle>
                    <CardDescription className="text-slateMuted">Change your password by sending a reset link to your email.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handlePasswordReset} disabled={isSendingReset} variant="outline">
                        {isSendingReset ? 'Sending...' : 'Send Password Reset Link'}
                    </Button>
                </CardContent>
            </Card>

             <Card className="border-red">
                <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2 text-red"><ShieldAlert className="h-5 w-5" />Danger Zone</CardTitle>
                    <CardDescription className="text-red/80">This action is permanent and cannot be undone.</CardDescription>
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
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red hover:bg-red/90">Yes, delete my account</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </main>
    )
}
