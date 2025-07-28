
'use client';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Shield, Mail, Save } from 'lucide-react';

type GeneralSettings = {
  maintenanceMode: boolean;
  supportEmail: string;
};

const SettingsSkeleton = () => (
  <AdminLayout>
    <main className="flex-1 space-y-8 p-4 md:p-8">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </main>
  </AdminLayout>
);

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GeneralSettings>({ maintenanceMode: false, supportEmail: '' });
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      setInitialLoading(true);
      try {
        const settingsRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(settingsRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as GeneralSettings);
        } else {
          setSettings({ maintenanceMode: false, supportEmail: 'support@example.com' });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error Loading Settings',
          description: 'Could not load settings from the database.',
        });
      } finally {
        setInitialLoading(false);
      }
    };
    fetchSettings();
  }, [toast]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const settingsRef = doc(db, 'settings', 'general');
      await setDoc(settingsRef, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
      toast({
        title: 'Settings Saved',
        description: 'Your changes have been successfully saved.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save your settings. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (initialLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <AdminLayout>
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage platform-wide configurations and preferences.</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Adjust core settings for the entire application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center"><Shield className="mr-2 h-5 w-5" />Security & Access</h3>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="maintenance-mode" className="text-base">Maintenance Mode</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                                Temporarily disable student portal access for updates. Admins are unaffected.
                            </p>
                        </div>
                        <Switch 
                          id="maintenance-mode" 
                          checked={settings.maintenanceMode}
                          onCheckedChange={(checked) => setSettings(s => ({...s, maintenanceMode: checked}))}
                          disabled={isSaving}
                        />
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center"><Mail className="mr-2 h-5 w-5" />Communication</h3>
                    <div className="space-y-2">
                        <Label htmlFor="support-email">Support Email</Label>
                        <p className="text-sm text-muted-foreground">The primary email address for user support inquiries.</p>
                        <Input 
                          id="support-email" 
                          value={settings.supportEmail}
                          onChange={(e) => setSettings(s => ({...s, supportEmail: e.target.value}))}
                          disabled={isSaving}
                          placeholder="e.g., support@mapleleafs.com"
                        />
                    </div>
                </div>
                
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
}
