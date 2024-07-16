"use client";
import { Inter } from "next/font/google";
import React, { useContext, useState } from "react";
import DocumentCard from "../components/DocumentCard";
import searchIcon from "../../../public/images/search.svg";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { AuthContext } from "@/context/AuthContext";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import DocumentsSection from "../components/DocumentsSection";
import SelectCategory from "../components/SelectCategory";
import toast from "react-hot-toast";
import UploadModal from "../components/UploadModal";
import Loader from "../components/Loader";
import CategoriesSection from "../components/CategoriesSection";

const Admin = () => {
  const openFileUploader = () => {
    document.getElementById(`doc-uploader`)?.click();
  };
  const { currentUser } = useContext(AuthContext);
  const [adminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<
    "Manage Documents" | "Manage Categories"
  >("Manage Documents");

  const signInAdmin = async () => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setIsAdminLoggedIn(true);
      setIsLoading(false);
    } catch (error) {
      setIsAdminLoggedIn(false);
      console.log("Error signing in:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {openUploadModal && (
        <UploadModal
          openUploadModal={openUploadModal}
          setOpenUploadModal={setOpenUploadModal}
        />
      )}

      {isLoading ? (
        <div className="h-[30rem] w-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {!adminLoggedIn ? (
            <div className="px-4 lg:px-20  flex flex-col gap-10 items-center justify-center h-screen absolute top-0 left-0 w-full">
              <h1 className={`text-[#344054] text-[2rem] `}>Admin Login</h1>

              <div className="flex flex-col gap-2 w-[18rem]">
                <p>Email</p>
                <div className=" flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
                  <input
                    type="text"
                    placeholder=""
                    className="w-full border-none bg-[transparent] outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 w-[18rem]">
                <p>Password</p>
                <div className="px-2 flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    className="w-full border-none bg-[transparent] outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? `Hide` : `Show`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signInAdmin()}
                className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] bg-[#333333] rounded-lg text-[#ffffff] min-w-max"
              >
                Sign In as Admin
              </button>
            </div>
          ) : (
            <div className="px-4 lg:px-20  flex flex-col gap-10 w-9/12">
              <div className="flex items-center w-full justify-between">
                <h1 className={`text-[#344054] text-[2rem] `}>Admin</h1>
                <button
                  onClick={() => {
                    if (selectedTab === "Manage Categories") {
                      setSelectedTab("Manage Documents");
                    } else {
                      setSelectedTab("Manage Categories");
                    }
                  }}
                  className="flex items-center justify-center gap-4 border-2 px-4 py-2 text-sm border-[#EAECF0] rounded-lg"
                >
                  {selectedTab === "Manage Categories"
                    ? `Manage Documents`
                    : `Manage Categories`}
                </button>
              </div>

              {selectedTab === "Manage Documents" && (
                <div className="flex flex-col gap-2">
                  <div className="flex w-full  items-center justify-between">
                    <h1>Manage Documents</h1>

                    <button
                      onClick={() => setOpenUploadModal(!openUploadModal)}
                      className="px-4 py-2 bg-[#333333] rounded-lg text-[#ffffff] min-w-ma"
                    >
                      Upload
                    </button>
                  </div>

                  <hr />
                  <div className="mt-8 flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
                    <div className="min-w-max">
                      <Image src={searchIcon} alt="" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for document"
                      className="w-full border-none bg-[transparent] outline-none"
                    />
                  </div>

                  <DocumentsSection />
                </div>
              )}

              {selectedTab === "Manage Categories" && <CategoriesSection />}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Admin;
