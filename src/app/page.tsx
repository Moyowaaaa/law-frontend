"use client";

import Image from "next/image";
import googleIcon from "../../public/images/googleIcon.svg";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
const inter = Inter({ subsets: ["latin"], weight: "800" });
const interSemi = Inter({ subsets: ["latin"], weight: "600" });

export default function Home() {
  const router = useRouter();
  return (
    <>
      <div className="w-full h-full  min-h-[90vh] flex flex-col items-center justify-center gap-2">
        <h1 className={`text-[#344054] ${inter.className}`}>Sign Up to Law</h1>

        <button
          className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] rounded-lg"
          onClick={() => router.push("/dashboard")}
        >
          <Image src={googleIcon} alt="" />
          <p className={`text-[#344054] ${interSemi.className}`}>
            Sign up with google
          </p>
        </button>
      </div>
    </>
  );
}
