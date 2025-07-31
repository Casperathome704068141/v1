'use client';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, orderBy, deleteDoc, doc, query } from 'firebase/firestore';
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

  // learning hub states
  const [hubTitle, setHubTitle] = useState('');
  const [hubSlug, setHubSlug] = useState('');
  const [hubIcon, setHubIcon] = useState('');
  const [hubContent, setHubContent] = useState('');
  const [hubEntries, setHubEntries] = useState<any[]>([]);

  // forum posts moderation
  const [forumPosts, setForumPosts] = useState<any[]>([]);

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

  // fetch existing hub entries
  useEffect(() => {
    const q = query(collection(db, 'learningHub'), orderBy('title'));
    const unsub = onSnapshot(q, snap => {
      setHubEntries(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, []);

  // fetch forum posts for moderation
  useEffect(() => {
    const q = query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setForumPosts(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, []);

  const addHubEntry = async () => {
    if (!hubTitle || !hubSlug) return;
    await addDoc(collection(db, 'learningHub'), {
      title: hubTitle,
      slug: hubSlug,
      icon: hubIcon,
      content: hubContent,
    });
    setHubTitle('');
    setHubSlug('');
    setHubIcon('');
    setHubContent('');
  };

  const deleteHubEntry = async (id: string) => {
    await deleteDoc(doc(db, 'learningHub', id));
  };

  const deleteForumPost = async (id: string) => {
    await deleteDoc(doc(db, 'forumPosts', id));
  };

  return (
    <AdminLayout>
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Content Management</h1>
          <p className="text-muted-foreground">Manage articles, learning hub entries and forum posts.</p>
        </div>
        
        <Tabs defaultValue="articles" className="w-full">
          <TabsList>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="hub">Learning Hub</TabsTrigger>
            <TabsTrigger value="forum">Forum Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
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
                        <Label htmlFor="post-content" className="text-base sr-only">Content</Label>
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
                      <div className="prose prose-stone dark:prose-invert rounded-md border bg-muted/50 p-4 min-h-[288px]">
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
          </TabsContent>

          <TabsContent value="hub">
            <Card>
              <CardHeader>
                <CardTitle>Learning Hub Entry</CardTitle>
                <CardDescription>Create or edit learning resources.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={hubTitle} onChange={e => setHubTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={hubSlug} onChange={e => setHubSlug(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Input value={hubIcon} onChange={e => setHubIcon(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Content (markdown)</Label>
                  <Textarea rows={8} value={hubContent} onChange={e => setHubContent(e.target.value)} />
                </div>
                <Button type="button" onClick={addHubEntry} disabled={!hubTitle || !hubSlug}>Save Entry</Button>

                <div className="pt-4">
                  {hubEntries.map(entry => (
                    <div key={entry.id} className="flex justify-between border-b py-2">
                      <span>{entry.title}</span>
                      <Button size="sm" variant="ghost" onClick={() => deleteHubEntry(entry.id)}>Delete</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forum">
            <Card>
              <CardHeader>
                <CardTitle>Forum Posts</CardTitle>
                <CardDescription>Moderate community posts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {forumPosts.map(p => (
                  <div key={p.id} className="flex justify-between border-b py-2">
                    <span>{p.author}: {p.content.substring(0,40)}...</span>
                    <Button size="sm" variant="ghost" onClick={() => deleteForumPost(p.id)}>Delete</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </AdminLayout>
  );
}
