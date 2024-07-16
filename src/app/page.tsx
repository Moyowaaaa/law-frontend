"use client";

import Image from "next/image";
import googleIcon from "../../public/images/googleIcon.svg";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Loader from "./components/Loader";

export default function Home() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log({ currentUser });

  useEffect(() => {
    const loggedOut = window.localStorage.getItem("logged out");

    if (loggedOut) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, []);

  const onSignInUser = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        userName: user.displayName,
        email: user.email,
        type: "client",
        savedDocuments: [],
      });
      if (user) {
        router.push("/dashboard");
        toast.success(`Successfully logged in`);
        setIsLoading(false);
      }
      console.log(user.uid);
    } catch (error) {
      console.log(error);
      toast.success(`An error occured, please try again`);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-full min-h-[90vh] flex flex-col items-center justify-center gap-6 absolute top-0 left-0">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h1 className={`text-[#344054] `}>Sign In to Law</h1>

            {!currentUser ? (
              <button
                className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] rounded-lg"
                onClick={onSignInUser}
              >
                <Image src={googleIcon} alt="Google Icon" />
                <p className={`text-[#344054] `}>Sign in with Google</p>
              </button>
            ) : (
              <div className="flex flex-col gap-6 items-center">
                <h1 className={`text-[#344054]  font-[800]`}>
                  {currentUser?.displayName}
                </h1>

                <div className="w-max h-max  hover:underline hover:border-b-2 hover:border-b-[#344054] ">
                  <button
                    className={`text-[#344054]  `}
                    onClick={() => router.push("/dashboard")}
                  >
                    Back to dashboard &rarr;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
