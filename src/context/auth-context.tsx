
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signOut as firebaseSignOut, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { doc, onSnapshot, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ApplicationProvider } from './application-context';

export interface UserProfile {
    uid: string;
    email: string | null;
    name: string | null;
    plan: string;
    signedUp?: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/', '/signup', '/forgot-password', '/admin/login'];

async function createUserDocument(user: User) {
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    try {
        await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            signedUp: serverTimestamp(),
            plan: 'Free', // Default plan
        });
    } catch (error) {
        console.error("Error creating user document:", error);
    }
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
        setLoading(false);
        return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            const userRef = doc(db, 'users', currentUser.uid);
            
            const unsubscribeProfile = onSnapshot(userRef, 
              (docSnap) => {
                if (docSnap.exists()) {
                    setProfile(docSnap.data() as UserProfile);
                } else {
                    // This handles new user creation. The onSnapshot will fire again once the doc is created.
                    createUserDocument(currentUser).catch(console.error);
                }
                setLoading(false); // This is the key fix: always stop loading after the first check.
              }, 
              (error) => {
                console.error("Firestore snapshot error:", error);
                setProfile(null);
                setLoading(false);
            });

            return () => unsubscribeProfile();
        } else {
            setUser(null);
            setProfile(null);
            setLoading(false);
        }
    });

    return () => unsubscribe();
  }, [pathname]);

  useEffect(() => {
    if (!loading && !pathname.startsWith('/admin')) {
      const isPublicRoute = publicRoutes.includes(pathname);
      if (!user && !isPublicRoute) {
        router.push('/');
      } else if (user && isPublicRoute) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
       toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred while signing out. Please try again.',
      });
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
      // The onAuthStateChanged listener will handle redirecting and profile listening.
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
      setLoading(false);
    }
  }

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  const isPublicRoute = publicRoutes.includes(pathname);
  if (loading && !isPublicRoute) {
     return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
     );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, signInWithGoogle }}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
