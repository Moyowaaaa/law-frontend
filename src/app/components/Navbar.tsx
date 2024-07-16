"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import toast from "react-hot-toast";
import Loader from "./Loader";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pageRoutes = ["Dashboard", "Categories"];
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setIsLoading(true);
      await signOut(auth);

      window.localStorage.clear();
      window.location.replace("/");
      window.localStorage.setItem("logged out", "true");
      setTimeout(() => {
        toast.success(`User logged out`);
        window.localStorage.removeItem("logged out");
      }, 2000);
      setIsLoading(false);
    } catch (error) {
      toast.success(`An error occurred, please try again`);
      setIsLoading(false);
      return error;
    }
  };

  console.log({ currentAuth, pathname });

  return (
    <>
      <div className="w-full   flex  py-4 border-b-2 border-b-[#EAECF0]  items-center ">
        <div className="flex items-center justify-between max-w-[112rem] mx-auto w-full px-4 lg:px-20 ">
          <div
            className={`w-full max-w-[112rem] mx-auto hover:cursor-pointer hover:underline  `}
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

                  {isLoading && <Loader />}

                  {currentAuth ? (
                    <div className={`flex items-center gap-2 min-w-max `}>
                      <Link href={`/user`}>
                        <div
                          className={`flex items-center gap-4 min-w-max
                          ${
                            pathname === "/user"
                              ? "bg-[#333333] py-2 px-4  rounded-lg text-[#ffffff]"
                              : ""
                          }
                          `}
                        >
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
                <div className={`flex items-center gap-2 min-w-max `}>
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
