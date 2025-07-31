'use client';
import { AppLayout } from '@/components/app-layout';
import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Post { id: string; author: string; authorRep: number; content: string; timestamp: any; }

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [reputation, setReputation] = useState(0);

  useEffect(() => {
    if (!db) return;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef).then(snap => setReputation(snap.data()?.reputation || 0));
    }
    const q = query(collection(db, 'forum'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setPosts(
        snap.docs.map(d => ({
          id: d.id,
          author: d.data().author,
          authorRep: d.data().authorRep || 0,
          content: d.data().content,
          timestamp: d.data().timestamp,
        }))
      );
    });
    return () => unsub();
  }, [user]);

  const submitPost = async () => {
    if (!newPost.trim() || !user) return;
    const userDoc = doc(db, 'users', user.uid);
    const repSnap = await getDoc(userDoc);
    const rep = repSnap.data()?.reputation || 0;
    await addDoc(collection(db, 'forum'), {
      author: user.displayName || user.email,
      authorId: user.uid,
      authorRep: rep + 1,
      content: newPost.trim(),
      timestamp: serverTimestamp(),
    });
    await updateDoc(doc(db, 'users', user.uid), { reputation: increment(1) });
    setNewPost('');
  };

  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        <div className="flex gap-2 items-end">
          <Input value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share something..." className="flex-1" />
          <Button onClick={submitPost}>Post</Button>
        </div>
        {user && <p className="text-sm text-muted-foreground">You have {reputation} points</p>}
        <div className="space-y-4">
          {posts.map(p => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="text-sm">
                  {p.author}
                  <span className="ml-2 text-xs text-primary font-semibold">{p.authorRep} pts</span>
                  <span className="ml-2 text-xs text-muted-foreground">{p.timestamp?.toDate?.().toLocaleString?.()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{p.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
