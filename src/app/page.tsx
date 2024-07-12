"use client";

import Image from "next/image";
import googleIcon from "../../public/images/googleIcon.svg";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], weight: "800" });
const interSemi = Inter({ subsets: ["latin"], weight: "600" });
const interLight = Inter({ subsets: ["latin"], weight: "600" });

export default function Home() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const { currentUser } = useContext(AuthContext);

  console.log({ currentUser });
  const onSignInUser = async () => {
    try {
      const usersCollection = collection(db, "users");
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
      }
      console.log(user.uid);
    } catch (error) {
      console.log(error);
      toast.success(`An error occured, please try again`);
    }
  };

  return (
    <>
      <div className="w-full h-full min-h-[90vh] flex flex-col items-center justify-center gap-6 absolute top-0 left-0">
        <h1 className={`text-[#344054] ${inter.className}`}>Sign In to Law</h1>

        {!currentUser ? (
          <button
            className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] rounded-lg"
            onClick={onSignInUser}
          >
            <Image src={googleIcon} alt="Google Icon" />
            <p className={`text-[#344054] ${interSemi.className}`}>
              Sign in with Google
            </p>
          </button>
        ) : (
          <div className="flex flex-col gap-6 items-center">
            <h1 className={`text-[#344054] ${inter.className} font-[800]`}>
              {currentUser?.displayName}
            </h1>

            <div className="w-max h-max  hover:underline hover:border-b-2 hover:border-b-[#344054] ">
              <button
                className={`text-[#344054] ${interLight.className} `}
                onClick={() => router.push("/dashboard")}
              >
                Back to dashboard &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
