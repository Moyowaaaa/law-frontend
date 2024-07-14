"use client";

import { createContext, useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export const AuthContext = createContext<any | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: any) => {
      setIsLoading(true);
      setCurrentUser(user);
      // console.log(user);
      setIsLoading(false);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
