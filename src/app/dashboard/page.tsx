import { Inter } from "next/font/google";
import React from "react";
import searchIcon from "../../../public/images/search.svg";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], weight: "800" });
const interLight = Inter({ subsets: ["latin"], weight: "500" });

const Page = () => {
  return (
    <>
      <div className="px-20  flex flex-col gap-4">
        <div className="w-max flex flex-col gap-4">
          <h1 className={`text-[#344054] text-[2rem] ${inter.className}`}>
            Over 2000+ Nigerian Law Drafts Available
          </h1>
          <p className={`text-[#667085] text-[1rem] ${interLight.className}`}>
            No more stressful search.
          </p>
          <div className="mt-8 flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
            <div className="min-w-max">
              <Image src={searchIcon} alt="" />
            </div>
            <input
              type="text"
              placeholder="Search for draft"
              className="w-full border-none bg-[transparent] outline-none"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
