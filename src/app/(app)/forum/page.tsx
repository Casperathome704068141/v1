
'use client';
import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit, startAfter, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageSquare, ThumbsUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Post { 
  id: string; 
  author: string; 
  avatar?: string; 
  content: string; 
  createdAt: Timestamp; 
}

const PostSkeleton = () => (
    <Card className="bg-surface1 border-white/10">
        <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
            </div>
        </CardHeader>
        <CardContent>
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </CardContent>
    </Card>
)

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'), limit(10));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      setLastDoc(snap.docs[snap.docs.length - 1]);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
    });
    return () => unsub();
  }, []);

  const loadMore = () => {
    if (!lastDoc) return;
    setLoadingMore(true);
    const q = query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(10));
    onSnapshot(q, snap => {
      setPosts(prev => [...prev, ...snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))]);
      setLastDoc(snap.docs[snap.docs.length - 1]);
      setLoadingMore(false);
    });
  };

  const submitPost = async () => {
    if (!newPost.trim() || !user) return;
    setIsPosting(true);
    await addDoc(collection(db, 'forumPosts'), {
      author: user.displayName || user.email,
      content: newPost.trim(),
      createdAt: serverTimestamp(),
    });
    setNewPost('');
    setIsPosting(false);
  };

  return (
      <main className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="mb-8">
            <h1 className="text-4xl font-display tracking-tight flex items-center gap-3">
                <MessageSquare className="h-10 w-10 text-blue" />
                Community Forum
            </h1>
            <p className="text-slateMuted text-lg">Ask questions, share experiences, and connect with other students.</p>
        </div>
        <Card className="mb-8 shadow-lg bg-surface1 border-white/10">
            <CardContent className="p-4 flex flex-col gap-4">
              <Textarea 
                placeholder="Share something with the community..." 
                className="bg-surface2 border-white/10 focus-visible:ring-1 focus-visible:ring-blue min-h-[80px]" 
                value={newPost} 
                onChange={e => setNewPost(e.target.value)}
                disabled={isPosting} 
               />
              <Button onClick={submitPost} disabled={!newPost.trim() || isPosting} className="self-end bg-blue hover:bg-blue/90">
                <Send className="mr-2 h-4 w-4" />
                {isPosting ? 'Posting...' : 'Post'}
              </Button>
            </CardContent>
        </Card>

        <div className="space-y-6">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
          ) : posts.map(p => (
            <Card key={p.id} className="bg-surface1 border-white/10">
              <CardHeader className="flex flex-row items-center gap-4">
                 <Avatar className="h-10 w-10">
                  <AvatarFallback>{p.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-white">{p.author}</div>
                  <div className="text-sm text-slateMuted">{p.createdAt?.toDate ? formatDistanceToNow(p.createdAt.toDate(), { addSuffix: true }) : 'just now'}</div>
                </div>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none text-slateMuted">
                <ReactMarkdown>{p.content}</ReactMarkdown>
              </CardContent>
              <CardContent className="flex gap-2 py-3 border-t border-white/10">
                 <Button size="sm" variant="ghost">
                    <ThumbsUp className="mr-2 h-4 w-4" /> Like
                </Button>
                <Button size="sm" variant="ghost">
                    <MessageSquare className="mr-2 h-4 w-4" /> Reply
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {lastDoc && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load More Posts'}
            </Button>
          </div>
        )}
      </main>
  );
}
