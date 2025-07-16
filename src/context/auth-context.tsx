
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
    // Add admin claim to profile for client-side checks
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
  
  // Warning for missing Firebase config can be simplified or removed if not needed.
  // For this fix, we'll assume config is present.

  useEffect(() => {
    if (!auth || !db) {
        setLoading(false);
        return;
    };
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setLoading(true);
        if (currentUser) {
            // FIX: Force a token refresh to get custom claims immediately after login.
            // This ensures the `admin` claim is available for Firestore security rules.
            const tokenResult = await currentUser.getIdTokenResult(true);
            const claims = tokenResult.claims;
            setIsAdmin(!!claims.admin);

            setUser(currentUser);
            const userRef = doc(db, 'users', currentUser.uid);
            
            const unsubscribeProfile = onSnapshot(userRef, 
              (docSnap) => {
                if (docSnap.exists()) {
                    setProfile({
                        ...docSnap.data(),
                        admin: !!claims.admin, // Also add admin status to the user profile object
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
    if (loading) return; // Wait until auth state is confirmed

    const isAuthRoute = authRoutes.includes(pathname);
    const isAdminLogin = pathname === '/admin/login';
    const isAdminRoute = pathname.startsWith('/admin');
    const isPublicRoute = publicRoutes.includes(pathname);

    if (user) {
        // User is logged in
        if (isAdminRoute && !isAdmin) {
            // Non-admin trying to access admin pages, redirect away
            router.push('/dashboard');
        } else if (isAuthRoute && !isAdminLogin) {
             // Logged-in user on a regular login/signup page, redirect to dashboard
            router.push('/dashboard');
        }
    } else {
        // User is not logged in
        if (isAdminRoute && !isAdminLogin) {
            // Not logged in and trying to access admin pages (except login)
            router.push('/admin/login');
        } else if (!isPublicRoute && !isAuthRoute) {
            // Not logged in and on a protected page
            router.push('/');
        }
    }

  }, [user, profile, isAdmin, loading, pathname, router]);


  const signOut = async () => {
    if (!auth) return;
    const wasAdmin = isAdmin;
    try {
      await firebaseSignOut(auth);
      // Redirect to the appropriate login page
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
      // After sign-in, the onAuthStateChanged listener will handle the rest
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
  
  // Simplified loading state for admin to avoid full-page skeleton
  if (loading && pathname.startsWith('/admin')) {
      return null; // Or a minimal loader
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
