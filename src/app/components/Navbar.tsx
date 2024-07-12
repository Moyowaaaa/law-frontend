"use client";

import React, { useContext, useEffect, useMemo } from "react";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import toast from "react-hot-toast";
const inter = Inter({ subsets: ["latin"], weight: "800" });
const interLight = Inter({ subsets: ["latin"], weight: "300" });

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pageRoutes = ["Dashboard", "Categories"];
  const { currentUser, isLoading } = useContext(AuthContext);

  const currentAuth = useMemo(() => {
    if (currentUser) return currentUser;

    return null;
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser && pathname !== "/" && pathname !== "/admin") {
      window.location.replace("/");
    }
  }, [currentUser]);

  const onLogoutUser = async () => {
    try {
      await signOut(auth);

      localStorage.clear();
      window.location.replace("/");
      setTimeout(() => {
        toast.success(`User logged out`);
      }, 2000);
    } catch (error) {
      toast.success(`An error occurred, please try again`);
      return error;
    }
  };

  console.log({ currentAuth });

  return (
    <>
      <div className="w-full   flex  py-4 border-b-2 border-b-[#EAECF0]  items-center ">
        <div className="flex items-center justify-between max-w-[112rem] mx-auto w-full px-4 lg:px-20 ">
          <div
            className={`w-full max-w-[112rem] mx-auto hover:cursor-pointer hover:underline  ${inter.className}`}
            onClick={() => router.push("/")}
          >
            Untitled UI
          </div>

          {pathname !== "/admin" && (
            <>
              {pathname !== "/" && (
                <div className="hidden lg:flex gap-2 items-center text-sm">
                  {pageRoutes?.map((a, index) => (
                    <Link href={`/${a.toLowerCase()}`} key={index}>
                      <p
                        className={`font-400 py-2 px-4 hover:cursor-pointer ${
                          pathname.includes(a.toLowerCase())
                            ? "bg-[#333333] rounded-lg text-[#ffffff]"
                            : ""
                        }`}
                      >
                        {a}
                      </p>
                    </Link>
                  ))}

                  {isLoading && <p>Loading</p>}

                  {currentAuth ? (
                    <div
                      className={`flex items-center gap-2 min-w-max ${interLight.className}`}
                    >
                      <Link href={`/user`}>
                        <div className="flex items-center gap-4 min-w-max">
                          <p>{currentAuth.displayName}</p>
                        </div>
                      </Link>

                      <button
                        onClick={() => onLogoutUser()}
                        className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] bg-[#333333] rounded-lg text-[#ffffff] min-w-max"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link href={"/"}>
                      <button className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] rounded-lg min-w-max">
                        Login
                      </button>
                    </Link>
                  )}

                  {/* <button className="flex items-center justify-center gap-4 border-2 px-4 py-2  bg-[#333333] rounded-lg text-[#ffffff] min-w-max">
                Sign Up
              </button> */}
                </div>
              )}
            </>
          )}

          {pathname === "/admin" && (
            <>
              {currentAuth ? (
                <div
                  className={`flex items-center gap-2 min-w-max ${interLight.className}`}
                >
                  <div className="flex items-center gap-4 min-w-max">
                    <p>{currentAuth.displayName}</p>
                  </div>
                  <button
                    onClick={() => onLogoutUser()}
                    className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] bg-[#333333] rounded-lg text-[#ffffff] min-w-max"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href={"/"}>
                  <button className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] rounded-lg min-w-max">
                    Login
                  </button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
