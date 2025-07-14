
'use client';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export default function AdminCmsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out both the title and content.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'news'), {
        title,
        content,
        publishedAt: serverTimestamp(),
      });
      toast({
        title: 'Post Published!',
        description: 'The new article has been successfully published.',
      });
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        variant: 'destructive',
        title: 'Publishing Failed',
        description: 'Could not publish the post. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">News & Announcements</h1>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>Write a new article to be published on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="post-title">Post Title</Label>
                        <Input 
                            id="post-title" 
                            placeholder="e.g. Important Update on Visa Processing Times" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                     <div>
                        <Label htmlFor="post-content">Content</Label>
                        <Textarea 
                            id="post-content" 
                            placeholder="Write your article content here... (Markdown is supported)" 
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Publishing...' : 'Publish Post'}
                    </Button>
                </form>
            </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
}
