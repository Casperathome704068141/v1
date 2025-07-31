'use client';
import { AppLayout } from '@/components/app-layout';
import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Post { id: string; author: string; content: string; timestamp: any; likes?: number; }

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'forum'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, []);

  const submitPost = async () => {
    if (!newPost.trim() || !user) return;
    await addDoc(collection(db, 'forum'), {
      author: user.displayName || user.email,
      content: newPost.trim(),
      timestamp: serverTimestamp(),
      likes: 0,
    });
    setNewPost('');
  };

  const likePost = async (id: string) => {
    await updateDoc(doc(db, 'forum', id), { likes: increment(1) });
  };

  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        <div className="flex gap-2">
          <Input value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share something..." className="flex-1" />
          <Button onClick={submitPost}>Post</Button>
        </div>
        <div className="space-y-4">
          {posts.map(p => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="text-sm">{p.author}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{p.content}</p>
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-xs text-muted-foreground">{p.timestamp?.toDate?.().toLocaleString?.()}</span>
                <Button variant="ghost" size="sm" onClick={() => likePost(p.id)}>
                  👍 {p.likes ?? 0}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
