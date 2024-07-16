"use client";

import { Inter } from "next/font/google";
import React from "react";
import DocumentsSection from "../components/DocumentsSection";
import Image from "next/image";
import searchIcon from "../../../public/images/search.svg";
import UserDocuentsSection from "../components/UserDocuentsSection";

const UserPage = () => {
  return (
    <>
      <div className="px-4 lg:px-20  flex flex-col gap-4">
        <div className="w-full lg:w-max flex flex-col gap-4">
          <h1 className={`text-[#344054] text-[2rem] `}>
            Your Saved Documents
          </h1>
          <p className={`text-[#667085] text-[1rem] `}>
            Search from your saved documents.
          </p>
        </div>

        <div className="w-8/12 flex flex-col gap-10">
          <UserDocuentsSection />
        </div>
      </div>
    </>
  );
};

export default UserPage;
