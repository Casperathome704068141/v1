
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';
import { Send, Eye } from 'lucide-react';

export default function AdminCmsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'A great post needs both a title and content.',
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
        description: 'The new article has been successfully published for all users to see.',
      });
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        variant: 'destructive',
        title: 'Publishing Failed',
        description: 'Could not publish the post due to a server error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News & Announcements</h1>
          <p className="text-muted-foreground">Create and publish articles for your users.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Compose New Post</CardTitle>
                    <CardDescription>Write and preview a new article. Markdown is supported for rich text formatting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="post-title" className="text-base">Title</Label>
                        <Input 
                            id="post-title" 
                            placeholder="e.g. Important Update on Visa Processing Times" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                            className="text-lg"
                        />
                    </div>
                    
                    <Tabs defaultValue="edit" className="w-full">
                        <TabsList>
                            <TabsTrigger value="edit">Edit</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="edit">
                            <div className="space-y-2">
                                <Label htmlFor="post-content" className="text-base">Content</Label>
                                <Textarea 
                                    id="post-content" 
                                    placeholder="Write your article content here... Use markdown for formatting." 
                                    rows={12}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={isLoading}
                                    className="font-mono"
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="preview">
                             <div className="prose prose-stone dark:prose-invert rounded-md border p-4 min-h-[258px]">
                                {content ? <ReactMarkdown>{content}</ReactMarkdown> : <div className="flex flex-col items-center justify-center h-full text-muted-foreground"><Eye className="h-8 w-8 mb-2" /><span>Start typing to see a preview.</span></div>}
                            </div>
                        </TabsContent>
                    </Tabs>
                    
                    <Button type="submit" disabled={isLoading || !title || !content} size="lg">
                        <Send className="mr-2 h-4 w-4" />
                        {isLoading ? 'Publishing...' : 'Publish Post'}
                    </Button>
                </CardContent>
            </Card>
        </form>
      </main>
    </AdminLayout>
  );
}
