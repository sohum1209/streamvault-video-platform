"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [authLoading, setAuthLoading] = useState(true);

  const SignUpUser = async (email, password, name, phone) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      console.log("userCredential: ", userCredential);

      await sendEmailVerification(userCredential.user, {
        url: "http://localhost:3000/login"
      });

      await setDoc(doc(db, 'users', email), {
        name,
        phone,
        savedShows: []
      });

      return userCredential;
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  }

  function logOutuser() {
    return signOut(auth);
  }

  async function LoginUser(email, password) {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);

      await reload(userCredentials.user);

      if (!userCredentials.user.emailVerified) {
        await signOut(auth);
        throw new Error("Email not verified. Please verify your email before logging in.");
      }

      return userCredentials;
    }
    catch (error) {
      console.error(error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, SignUpUser, logOutuser, LoginUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function UserAuth() {
  return useContext(AuthContext);
}
