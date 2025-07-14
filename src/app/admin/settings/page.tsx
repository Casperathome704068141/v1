
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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type GeneralSettings = {
  maintenanceMode: boolean;
  supportEmail: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GeneralSettings>({ maintenanceMode: false, supportEmail: '' });
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSettings() {
      setInitialLoading(true);
      try {
        const settingsRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(settingsRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as GeneralSettings);
        } else {
          // Set default values if no settings doc exists yet
          setSettings({ maintenanceMode: false, supportEmail: 'support@mapleleafs.edu' });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load settings from the database.',
        });
      } finally {
        setInitialLoading(false);
      }
    }
    fetchSettings();
  }, [toast]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const settingsRef = doc(db, 'settings', 'general');
      await setDoc(settingsRef, settings, { merge: true });
      toast({
        title: 'Settings Saved',
        description: 'Your changes have been successfully saved.',
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
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
      return (
          <AdminLayout>
              <main className="flex-1 space-y-6 p-4 md:p-8">
                  <Skeleton className="h-8 w-32 mb-6" />
                  <Card>
                      <CardHeader>
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-4 w-2/3" />
                      </CardHeader>
                      <CardContent className="space-y-8">
                           <Skeleton className="h-16 w-full" />
                           <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                           </div>
                           <Skeleton className="h-10 w-28" />
                      </CardContent>
                  </Card>
              </main>
          </AdminLayout>
      )
  }

  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Settings</h1>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage platform-wide configurations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="maintenance-mode" className="font-medium">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                            Temporarily disable access to the student portal for updates.
                        </p>
                    </div>
                    <Switch 
                      id="maintenance-mode" 
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => setSettings(s => ({...s, maintenanceMode: checked}))}
                      disabled={isSaving}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input 
                      id="support-email" 
                      value={settings.supportEmail}
                      onChange={(e) => setSettings(s => ({...s, supportEmail: e.target.value}))}
                      disabled={isSaving}
                    />
                </div>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardContent>
        </Card>

      </main>
    </AdminLayout>
  );
}
