'use client';
import { AppLayout } from '@/components/app-layout';
import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface Post { id: string; author: string; avatar?: string; content: string; createdAt: any; }

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [lastDoc, setLastDoc] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'), limit(20));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      setLastDoc(snap.docs[snap.docs.length - 1]);
    });
    return () => unsub();
  }, []);

  const loadMore = () => {
    if (!lastDoc) return;
    const q = query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(20));
    onSnapshot(q, snap => {
      setPosts(prev => [...prev, ...snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))]);
      setLastDoc(snap.docs[snap.docs.length - 1]);
    });
  };

  const submitPost = async () => {
    if (!newPost.trim() || !user) return;
    await addDoc(collection(db, 'forumPosts'), {
      author: user.displayName || user.email,
      avatar: user.photoURL || '',
      content: newPost.trim(),
      createdAt: serverTimestamp(),
    });
    setNewPost('');
  };

  return (
    <AppLayout>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Community Forum</h1>
        <div className="mb-6 flex space-x-4">
          <input type="text" placeholder="Share something..." className="flex-1 hub-input" value={newPost} onChange={e => setNewPost(e.target.value)} />
          <button className="btn-primary" onClick={submitPost}>Post</button>
        </div>
        <ul className="space-y-4">
          {posts.map(p => (
            <li key={p.id} className="post-card">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={p.avatar || `https://avatar.vercel.sh/${p.author}.png`} alt={p.author} />
                  <AvatarFallback>{p.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="post-author">{p.author}</div>
                  <div className="post-time">{p.createdAt?.toDate ? formatDistanceToNow(p.createdAt.toDate(), { addSuffix: true }) : ''}</div>
                </div>
              </div>
              <div className="post-body prose dark:prose-invert">
                <ReactMarkdown>{p.content}</ReactMarkdown>
              </div>
              <div className="mt-2 flex space-x-4">
                <Button size="sm" variant="ghost">Like</Button>
                <Button size="sm" variant="ghost">Reply</Button>
              </div>
            </li>
          ))}
        </ul>
        {lastDoc && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={loadMore}>Load More</Button>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
