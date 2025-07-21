
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
    contactPreference?: 'email' | 'whatsapp';
    signedUp?: any;
    admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authRoutes = ['/login', '/signup', '/forgot-password', '/admin/login'];
const publicRoutes = ['/', '/about', '/privacy', '/terms', '/pricing', '/support'];


async function createUserDocument(user: User) {
  if (!db) return;
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    try {
        await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            signedUp: serverTimestamp(),
            plan: 'Free',
            contactPreference: 'email',
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
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!auth || !db) {
        setLoading(false);
        return;
    };
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setLoading(true);
        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists() && userDocSnap.data().isAdmin) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }

            setUser(currentUser);
            const userRef = doc(db, 'users', currentUser.uid);
            
            const unsubscribeProfile = onSnapshot(userRef, 
              (docSnap) => {
                if (docSnap.exists()) {
                    setProfile({
                        ...docSnap.data(),
                        admin: userDocSnap.data().isAdmin || false,
                    } as UserProfile);
                } else {
                    createUserDocument(currentUser).catch(console.error);
                }
                setLoading(false);
              }, 
              (error) => {
                console.error("Firestore snapshot error:", error);
                setProfile(null);
                setIsAdmin(false);
                setLoading(false);
            });

            return () => unsubscribeProfile();
        } else {
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
            setLoading(false);
        }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = authRoutes.includes(pathname);
    const isAdminLogin = pathname === '/admin/login';
    const isAdminRoute = pathname.startsWith('/admin');
    const isPublicRoute = publicRoutes.includes(pathname);

    if (user) {
        if (isAdminRoute && !isAdmin) {
            router.push('/dashboard');
        } else if (isAuthRoute && !isAdminLogin) {
            router.push('/dashboard');
        }
    } else {
        if (isAdminRoute && !isAdminLogin) {
            router.push('/admin/login');
        } else if (!isPublicRoute && !isAuthRoute) {
            router.push('/');
        }
    }

  }, [user, profile, isAdmin, loading, pathname, router]);


  const signOut = async () => {
    if (!auth) return;
    const wasAdmin = isAdmin;
    try {
      await firebaseSignOut(auth);
      router.replace(wasAdmin ? '/admin/login' : '/');
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
  
  if (loading && pathname.startsWith('/admin')) {
      return null;
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
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signOut, signInWithGoogle }}>
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
