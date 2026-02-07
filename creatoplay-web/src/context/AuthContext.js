import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register new user
  async function register(email, password, username) {
    // Check if username is taken
    const usernameQuery = query(collection(db, 'users'), where('username', '==', username));
    const usernameSnapshot = await getDocs(usernameQuery);
    if (!usernameSnapshot.empty) {
      throw new Error('Username is already taken');
    }

    // Create auth user
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    await updateProfile(user, { displayName: username });

    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      username: username,
      email: email,
      displayName: username,
      avatar: {
        headColor: '#f5c469',
        torsoColor: '#4a90d9',
        legsColor: '#2d5a8a',
        armsColor: '#f5c469'
      },
      createdAt: new Date().toISOString(),
      friends: [],
      friendRequests: [],
      gamesPlayed: 0,
      robux: 0, // or creatocoins
      bio: 'Hello! I\'m new to Creatoplay!',
      status: 'offline',
      lastOnline: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    return user;
  }

  // Login
  async function login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Update online status
    await updateDoc(doc(db, 'users', result.user.uid), {
      status: 'online',
      lastOnline: new Date().toISOString()
    });
    return result;
  }

  // Logout
  async function logout() {
    if (currentUser) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        status: 'offline',
        lastOnline: new Date().toISOString()
      });
    }
    return signOut(auth);
  }

  // Get user profile
  async function getUserProfile(uid) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }

  // Update user profile
  async function updateUserProfile(data) {
    if (!currentUser) return;
    await updateDoc(doc(db, 'users', currentUser.uid), data);
    const updatedProfile = await getUserProfile(currentUser.uid);
    setUserProfile(updatedProfile);
  }

  // Send friend request
  async function sendFriendRequest(targetUserId) {
    if (!currentUser) return;
    const targetUserRef = doc(db, 'users', targetUserId);
    const targetUserSnap = await getDoc(targetUserRef);
    
    if (targetUserSnap.exists()) {
      const targetUser = targetUserSnap.data();
      if (!targetUser.friendRequests.includes(currentUser.uid)) {
        await updateDoc(targetUserRef, {
          friendRequests: [...targetUser.friendRequests, currentUser.uid]
        });
      }
    }
  }

  // Accept friend request
  async function acceptFriendRequest(fromUserId) {
    if (!currentUser || !userProfile) return;
    
    // Add to both users' friends lists
    await updateDoc(doc(db, 'users', currentUser.uid), {
      friends: [...userProfile.friends, fromUserId],
      friendRequests: userProfile.friendRequests.filter(id => id !== fromUserId)
    });
    
    const fromUserRef = doc(db, 'users', fromUserId);
    const fromUserSnap = await getDoc(fromUserRef);
    if (fromUserSnap.exists()) {
      const fromUser = fromUserSnap.data();
      await updateDoc(fromUserRef, {
        friends: [...fromUser.friends, currentUser.uid]
      });
    }
    
    // Refresh profile
    const updatedProfile = await getUserProfile(currentUser.uid);
    setUserProfile(updatedProfile);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    register,
    login,
    logout,
    getUserProfile,
    updateUserProfile,
    sendFriendRequest,
    acceptFriendRequest
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
