import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  role: 'manager' | 'client' | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  setRole: (role: 'manager' | 'client') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<'manager' | 'client' | null>(() => {
    return localStorage.getItem('tas_user_role') as 'manager' | 'client' | null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch role from Firestore
        try {
          const userSnap = await getDoc(doc(db, 'users', user.uid));
          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.role) {
              setRoleState(userData.role);
              localStorage.setItem('tas_user_role', userData.role);
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const setRole = async (newRole: 'manager' | 'client') => {
    setRoleState(newRole);
    localStorage.setItem('tas_user_role', newRole);
    
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { 
          role: newRole,
          email: user.email || ''
        }, { merge: true });
      } catch (error) {
        console.error("Error setting role in Firestore:", error);
      }
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: result.user.displayName || '',
          email: result.user.email || '',
          photoURL: result.user.photoURL || '',
          createdAt: new Date().toISOString(),
          role: localStorage.getItem('tas_user_role') || 'client'
        });
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setRoleState(null);
    localStorage.removeItem('tas_user_role');
  };

  const register = async (email: string, pass: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(result.user, { displayName: name });
    
    await setDoc(doc(db, 'users', result.user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
      role: localStorage.getItem('tas_user_role') || 'client'
    });
  };

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginWithGoogle, logout, register, login, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
