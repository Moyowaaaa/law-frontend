"use client";

import React from "react";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"], weight: "800" });

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pageRoutes = ["Dashboard", "Categories"];

  console.log({ router, pathname });

  return (
    <>
      <div className="w-full   flex  py-4 border-b-2 border-b-[#EAECF0] px-20 items-center justify-between">
        <div
          className={`w-full max-w-[112rem] mx-auto hover:cursor-pointer hover:underline  ${inter.className}`}
          onClick={() => router.push("/")}
        >
          Untitled UI
        </div>

        {pathname !== "/" && (
          <div className="flex gap-2 items-center text-sm">
            {pageRoutes?.map((a, index) => (
              <Link href={`/${a.toLowerCase()}`} key={index}>
                <p
                  className={`font-400 py-2 px-4 hover:cursor-pointer ${
                    pathname.includes(a.toLowerCase())
                      ? "bg-[#F9FAFB] rounded-lg"
                      : ""
                  }`}
                >
                  {a}
                </p>
              </Link>
            ))}
            <button className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] rounded-lg min-w-max">
              Login
            </button>

            <button className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] rounded-lg min-w-max">
              Sign Up
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
