
'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  sentAt: any;
}

const LoadingSkeleton = () => (
  <Card className="w-full max-w-2xl mx-auto bg-surface1 border-white/10">
    <CardHeader>
      <Skeleton className="h-6 w-1/3" />
    </CardHeader>
    <CardContent className="h-96 space-y-4">
      <div className="flex justify-end"><Skeleton className="h-10 w-2/3" /></div>
      <div className="flex justify-start"><Skeleton className="h-10 w-2/3" /></div>
      <div className="flex justify-end"><Skeleton className="h-10 w-1/2" /></div>
    </CardContent>
    <CardFooter>
      <div className="flex w-full gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>
    </CardFooter>
  </Card>
);

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'users', user.uid, 'messages'),
      orderBy('sentAt')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;
    await addDoc(collection(db, 'users', user.uid, 'messages'), {
      text: newMessage,
      sender: 'user',
      sentAt: serverTimestamp(),
    });
    setNewMessage('');
  };

  if (loading) {
    return (
      <main className="p-4 md:p-8">
        <LoadingSkeleton />
      </main>
    );
  }

  return (
      <main className="p-4 md:p-8 flex flex-col h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-2xl mx-auto bg-surface1 border-white/10 flex flex-col flex-1">
          <CardHeader>
            <CardTitle className="font-display">Secure Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex items-end gap-2', msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                   {msg.sender === 'admin' && <div className="h-8 w-8 rounded-full bg-blue flex items-center justify-center flex-shrink-0"><Shield className="h-4 w-4 text-white" /></div>}
                  <div>
                    <div className={cn('rounded-lg px-4 py-2 max-w-xs md:max-w-md', msg.sender === 'user' ? 'bg-blue text-white' : 'bg-surface2 text-white')}>
                      <p>{msg.text}</p>
                    </div>
                    <p className={cn('text-xs text-slateMuted mt-1', msg.sender === 'user' ? 'text-right' : 'text-left')}>
                      {msg.sentAt ? format(msg.sentAt.toDate(), 'p') : ''}
                    </p>
                  </div>
                  {msg.sender === 'user' && <div className="h-8 w-8 rounded-full bg-red flex items-center justify-center flex-shrink-0"><User className="h-4 w-4 text-white" /></div>}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t border-white/10">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="bg-surface2 border-white/20"
              />
              <Button type="submit" className="bg-blue hover:bg-blue/90">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </main>
  );
}

