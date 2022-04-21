import * as React from "react";
import { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";

interface AppContextInterface {
  currentUser: User | null;
}

const AuthContext = createContext<AppContextInterface>({ currentUser: null });

export function useAuthContext() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setCurrentUser(null);
      setLoading(false);
      if (user) {
        console.log("User Logged in!");
      } else {
        console.log("User Logged out!");
      }
    });
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
