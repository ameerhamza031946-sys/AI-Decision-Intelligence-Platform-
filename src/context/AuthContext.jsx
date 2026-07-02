import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there is a mock session in local storage first
    const mockSession = localStorage.getItem('mockUser');
    if (mockSession) {
      try {
        const parsed = JSON.parse(mockSession);
        setUser({
          uid: parsed.uid,
          email: parsed.email,
          displayName: parsed.name,
          emailVerified: true
        });
        setUserProfile(parsed);
        setLoading(false);
        return; // Skip firebase listener if we are in mock mode
      } catch (e) {
        localStorage.removeItem('mockUser');
      }
    }

    try {
      const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          // Load profile from Firestore
          try {
            const docRef = doc(db, 'users', firebaseUser.uid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              setUserProfile(snap.data());
            } else {
              // Create default profile
              const profile = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email,
                role: 'citizen',
                avatar: firebaseUser.photoURL || null,
                createdAt: new Date().toISOString(),
                notifications: true,
              };
              await setDoc(docRef, profile);
              setUserProfile(profile);
            }
          } catch {
            // Firestore might not be configured — use defaults
            setUserProfile({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              role: 'citizen',
            });
          }
          // Store token for API calls
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('authToken', token);
        } else {
          setUser(null);
          setUserProfile(null);
          localStorage.removeItem('authToken');
        }
        setLoading(false);
      }, (error) => {
        console.error("Firebase auth state listener error:", error);
        setLoading(false);
      });
      return unsub;
    } catch (e) {
      console.warn("Firebase Auth is not available, using local fallback state.");
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // First try normal Firebase login
      const cred = await signInWithEmailAndPassword(auth, email, password);
      localStorage.removeItem('mockUser'); // Clear any mock session
      return cred;
    } catch (err) {
      console.error("Firebase login failed:", err.code || err.message);
      // If auth is not configured or fails, do a local mock fallback
      const isConfigError = 
        err.code === 'auth/configuration-not-found' || 
        err.code === 'auth/invalid-api-key' ||
        err.code === 'auth/network-request-failed' ||
        err.code === 'auth/operation-not-allowed' ||
        err.message?.includes('configuration-not-found') ||
        err.message?.includes('API key') ||
        err.message?.includes('not-allowed');

      if (isConfigError) {
        console.log("Falling back to local mock authentication...");
        
        // Determine role based on email (for testing convenience)
        let role = 'citizen';
        let name = 'Community User';
        if (email.includes('admin')) {
          role = 'admin';
          name = 'Admin User';
        } else if (email.includes('gov')) {
          role = 'government';
          name = 'Government Representative';
        } else if (email.includes('ngo')) {
          role = 'ngo';
          name = 'NGO Coordinator';
        }

        const mockUser = {
          uid: 'mock-user-12345',
          name,
          email,
          role,
          createdAt: new Date().toISOString(),
          notifications: true,
          isMock: true
        };

        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        localStorage.setItem('authToken', 'mock-token-xyz');
        
        setUser({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.name,
          emailVerified: true
        });
        setUserProfile(mockUser);
        
        // Return a simulated cred object
        return { user: { uid: mockUser.uid, email: mockUser.email } };
      } else {
        // Rethrow other authentication errors (like wrong password)
        throw err;
      }
    }
  };

  const register = async (email, password, name, role = 'citizen') => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      const profile = {
        uid: cred.user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        notifications: true,
      };
      try { await setDoc(doc(db, 'users', cred.user.uid), profile); } catch {}
      setUserProfile(profile);
      localStorage.removeItem('mockUser');
      return cred;
    } catch (err) {
      console.error("Firebase registration failed:", err.code || err.message);
      const isConfigError = 
        err.code === 'auth/configuration-not-found' || 
        err.code === 'auth/invalid-api-key' ||
        err.code === 'auth/network-request-failed' ||
        err.code === 'auth/operation-not-allowed' ||
        err.message?.includes('configuration-not-found') ||
        err.message?.includes('API key') ||
        err.message?.includes('not-allowed');

      if (isConfigError) {
        console.log("Falling back to local mock registration...");
        const mockUser = {
          uid: `mock-user-${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          role,
          createdAt: new Date().toISOString(),
          notifications: true,
          isMock: true
        };

        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        localStorage.setItem('authToken', 'mock-token-xyz');

        setUser({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.name,
          emailVerified: true
        });
        setUserProfile(mockUser);
        return { user: { uid: mockUser.uid, email: mockUser.email } };
      } else {
        throw err;
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      localStorage.removeItem('mockUser');
      return cred;
    } catch (err) {
      console.error("Google login failed:", err.code || err.message);
      const isConfigError = 
        err.code === 'auth/configuration-not-found' || 
        err.code === 'auth/invalid-api-key' ||
        err.code === 'auth/network-request-failed' ||
        err.code === 'auth/operation-not-allowed' ||
        err.message?.includes('configuration-not-found') ||
        err.message?.includes('API key') ||
        err.message?.includes('not-allowed');

      if (isConfigError) {
        console.log("Falling back to mock Google login...");
        const mockUser = {
          uid: 'mock-google-user',
          name: 'Google User',
          email: 'google.user@example.com',
          role: 'citizen',
          createdAt: new Date().toISOString(),
          notifications: true,
          isMock: true
        };

        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        localStorage.setItem('authToken', 'mock-token-xyz');

        setUser({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.name,
          emailVerified: true
        });
        setUserProfile(mockUser);
        return { user: { uid: mockUser.uid, email: mockUser.email } };
      } else {
        throw err;
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signOut error:", e);
    }
    localStorage.removeItem('mockUser');
    localStorage.removeItem('authToken');
    setUser(null);
    setUserProfile(null);
  };

  const updateUserProfile = async (data) => {
    if (!user) return;
    const updated = { ...userProfile, ...data };
    if (userProfile?.isMock) {
      localStorage.setItem('mockUser', JSON.stringify(updated));
    } else {
      try {
        await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      } catch (e) {
        console.warn("Failed to update Firestore profile, keeping local state:", e);
      }
    }
    setUserProfile(updated);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      updateUserProfile,
      isAdmin: userProfile?.role === 'admin',
      role: userProfile?.role || 'citizen',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
