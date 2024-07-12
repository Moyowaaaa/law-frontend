"use client";

import { Inter } from "next/font/google";
import React from "react";
import DocumentsSection from "../components/DocumentsSection";
import Image from "next/image";
import searchIcon from "../../../public/images/search.svg";
import UserDocuentsSection from "../components/UserDocuentsSection";

const inter = Inter({ subsets: ["latin"], weight: "800" });
const interLight = Inter({ subsets: ["latin"], weight: "500" });

const UserPage = () => {
  return (
    <>
      <div className="px-4 lg:px-20  flex flex-col gap-4">
        <div className="w-full lg:w-max flex flex-col gap-4">
          <h1 className={`text-[#344054] text-[2rem] ${inter.className}`}>
            Your Saved Documents
          </h1>
          <p className={`text-[#667085] text-[1rem] ${interLight.className}`}>
            Search from your saved documents.
          </p>
        </div>

        <div className="w-8/12 ">
          <div className="mt-8 flex w-8/12 border-2 border-[#EAECF0] items-center rounded-lg gap-4 lg:pl-4 py-2 bg-[transparent]">
            <div className="min-w-max">
              <Image src={searchIcon} alt="" />
            </div>
            <input
              type="text"
              placeholder="Search for draft"
              className="w-full border-none bg-[transparent] outline-none"
            />
          </div>
          <UserDocuentsSection />
        </div>
      </div>
    </>
  );
};

export default UserPage;