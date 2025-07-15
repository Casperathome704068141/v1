
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signOut as firebaseSignOut, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { googleProvider, db, isFirebaseConfigured, auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { doc, onSnapshot, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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

// Routes that are only for unauthenticated users
const authRoutes = ['/login', '/signup', '/forgot-password'];
// Routes that are public and accessible to everyone
const publicRoutes = ['/', '/about', '/privacy', '/terms', '/pricing', '/support'];


async function createUserDocument(user: User) {
  if (!db) return; // Do nothing if firebase is not configured
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

  if (!isFirebaseConfigured && !pathname.startsWith('/admin')) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
            <div className="max-w-lg rounded-lg border border-destructive bg-card p-8 text-center shadow-2xl">
              <h1 className="text-xl font-bold text-destructive">Firebase Configuration Error</h1>
              <p className="mt-2 text-muted-foreground">
                Your Firebase environment variables seem to be missing. Please create a <code>.env.local</code> file in your project root and add your Firebase project configuration to it.
              </p>
              <div className="mt-4 text-left bg-muted p-4 rounded-md text-xs overflow-x-auto">
                <pre>
                  <code>
                    NEXT_PUBLIC_FIREBASE_API_KEY=...<br/>
                    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...<br/>
                    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...<br/>
                    {/* Add other Firebase keys here */}
                  </code>
                </pre>
              </div>
              <a href="https://firebase.google.com/docs/web/setup#add-sdks-initialize" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-primary underline">
                Click here to find your Firebase config keys.
              </a>
            </div>
          </div>
      )
  }

  useEffect(() => {
    if (!auth || !db) {
        setLoading(false);
        return;
    };
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setLoading(true);
        if (currentUser) {
            setUser(currentUser);
            const userRef = doc(db, 'users', currentUser.uid);
            
            const unsubscribeProfile = onSnapshot(userRef, 
              (docSnap) => {
                if (docSnap.exists()) {
                    setProfile(docSnap.data() as UserProfile);
                } else {
                    createUserDocument(currentUser).catch(console.error);
                }
                setLoading(false);
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
  }, []);

  useEffect(() => {
    if (loading || pathname.startsWith('/admin')) {
      return; // Don't perform redirects while loading or on admin pages
    }

    const isAuthRoute = authRoutes.includes(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is logged in and tries to access an auth route (login/signup), redirect to dashboard
    if (user && isAuthRoute) {
      router.push('/dashboard');
      return;
    }

    // If user is NOT logged in and tries to access a protected page, redirect to landing
    if (!user && !isAuthRoute && !isPublicRoute) {
      router.push('/');
      return;
    }
  }, [user, loading, pathname, router]);

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      router.replace('/'); // Use replace to prevent back button from going to protected page
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
    if (!auth || !googleProvider) return;
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
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

  const isPublicOrAuthRoute = publicRoutes.includes(pathname) || authRoutes.includes(pathname);

  if (loading && !isPublicOrAuthRoute) {
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
