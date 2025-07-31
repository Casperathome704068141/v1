'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './auth-context';

export interface Notification {
  id: string;
  message: string;
  link?: string;
  read: boolean;
  timestamp: any;
}

interface NotificationsContextValue {
  notifications: Notification[];
  markAsRead: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  markAsRead: () => {},
});

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'users', user.uid, 'notifications'),
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, [user?.uid]);

  const markAsRead = async (id: string) => {
    if (!user?.uid) return;
    await updateDoc(doc(db, 'users', user.uid, 'notifications', id), { read: true });
  };

  return (
    <NotificationsContext.Provider value={{ notifications, markAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
